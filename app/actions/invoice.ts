"use server"

import { getClientIp } from "@/lib/utils/ip"
import { createClient } from "@/lib/supabase/server"
import { checkUsageLimits, incrementUsage } from "@/lib/utils/usage"
import { type InvoiceFormData, calculateInvoiceTotals, toNumber } from "@/lib/utils/invoice"

export { getClientIp }

export interface GenerateInvoiceResult {
  success: boolean
  error?: string
  invoiceId?: string
  usage?: {
    canCreate: boolean
    dailyUsed: number
    dailyLimit: number | null
    monthlyUsed: number
    monthlyLimit: number | null
    message?: string
  }
}

export async function checkInvoiceUsage(userId: string | null): Promise<GenerateInvoiceResult["usage"]> {
  const ip = await getClientIp()
  return await checkUsageLimits(userId, ip)
}

export async function generateGuestInvoice(data: InvoiceFormData): Promise<GenerateInvoiceResult> {
  const ip = await getClientIp()

  // Check usage limits
  const usage = await checkUsageLimits(null, ip)
  if (!usage.canCreate) {
    return {
      success: false,
      error: usage.message,
      usage,
    }
  }

  // For guest users, we just increment usage and return success
  // The actual PDF generation happens on the client side
  await incrementUsage(null, ip)

  return {
    success: true,
    usage: {
      ...usage,
      dailyUsed: usage.dailyUsed + 1,
      monthlyUsed: usage.monthlyUsed + 1,
    },
  }
}

export async function generateAuthenticatedInvoice(
  data: InvoiceFormData & { clientId?: string | null },
): Promise<GenerateInvoiceResult> {
  const supabase = await createClient()
  const ip = await getClientIp()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to save invoices",
    }
  }

  // Check usage limits
  const usage = await checkUsageLimits(user.id, ip)
  if (!usage.canCreate) {
    return {
      success: false,
      error: usage.message,
      usage,
    }
  }

  const totals = calculateInvoiceTotals(data.items, data.discountAmount)

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      client_id: data.clientId || null,
      invoice_number: data.invoiceNumber,
      status: "DRAFT",
      issue_date: data.issueDate,
      due_date: data.dueDate,
      currency: data.currency,
      subtotal: totals.subtotal,
      tax_total: totals.taxAmount,
      discount_total: totals.discountAmount,
      total: totals.totalAmount,
      notes: data.notes || null,
    })
    .select()
    .single()

  if (invoiceError) {
    console.error("[v0] Error creating invoice:", invoiceError.message)
    return {
      success: false,
      error: `Failed to create invoice: ${invoiceError.message || "Unknown error"}`,
    }
  }

  const itemsToInsert = data.items.map((item) => {
    const quantity = toNumber(item.quantity)
    const unitPrice = toNumber(item.unitPrice)
    const taxRate = toNumber(item.taxRate)

    return {
      invoice_id: invoice.id,
      user_id: user.id,
      description: item.description,
      quantity: quantity,
      unit_price: unitPrice,
      tax_rate: taxRate,
      line_total: quantity * unitPrice,
    }
  })

  const { error: itemsError } = await supabase.from("invoice_items").insert(itemsToInsert)

  if (itemsError) {
    console.error("[v0] Error creating invoice items:", itemsError.message)
    // Rollback invoice
    await supabase.from("invoices").delete().eq("id", invoice.id)
    return {
      success: false,
      error: `Failed to create invoice items: ${itemsError.message || "Unknown error"}`,
    }
  }

  // Increment usage
  await incrementUsage(user.id, ip)

  return {
    success: true,
    invoiceId: invoice.id,
    usage: {
      ...usage,
      dailyUsed: usage.dailyUsed + 1,
      monthlyUsed: usage.monthlyUsed + 1,
    },
  }
}

export async function sendInvoiceEmail(invoiceId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to send invoices",
    }
  }

  // Fetch invoice to verify ownership
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .single()

  if (invoiceError || !invoice) {
    return {
      success: false,
      error: "Invoice not found or access denied",
    }
  }

  // Check if user has email sending capability based on plan
  const { data: userData } = await supabase.from("users").select("*, plan:plans(*)").eq("id", user.id).single()

  if (!userData?.plan) {
    return {
      success: false,
      error: "Unable to verify your plan. Please contact support.",
    }
  }

  const planCode = userData.plan.code
  const canSendEmail = planCode !== "GUEST"

  if (!canSendEmail) {
    return {
      success: false,
      error: "Email sending is not available on the Guest plan. Please upgrade to send invoices via email.",
    }
  }

  // TODO: Implement actual email sending logic here
  // For now, just update the invoice status to SENT
  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      status: "SENT",
      sent_at: new Date().toISOString(),
    })
    .eq("id", invoiceId)

  if (updateError) {
    return {
      success: false,
      error: "Failed to update invoice status",
    }
  }

  return {
    success: true,
  }
}
