"use server"

import { getClientIp } from "@/lib/utils/ip"
import { createClient } from "@/lib/supabase/server"
import { checkUsageLimits, incrementUsage } from "@/lib/utils/usage"
import { type InvoiceFormData, calculateInvoiceTotals } from "@/lib/utils/invoice"

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

export async function generateAuthenticatedInvoice(data: InvoiceFormData): Promise<GenerateInvoiceResult> {
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

  // Create invoice in database
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      invoice_number: data.invoiceNumber,
      status: "DRAFT",
      issue_date: data.issueDate,
      due_date: data.dueDate,
      currency: data.currency,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      discount_amount: totals.discountAmount,
      total_amount: totals.totalAmount,
      amount_paid: 0,
      notes: data.notes || null,
      terms: data.terms || null,
      client_name: data.clientName,
      client_email: data.clientEmail,
      client_address: data.clientAddress || null,
      from_name: data.fromName,
      from_email: data.fromEmail,
      from_address: data.fromAddress || null,
    })
    .select()
    .single()

  if (invoiceError) {
    console.error("Error creating invoice:", invoiceError)
    return {
      success: false,
      error: "Failed to create invoice. Please try again.",
    }
  }

  // Create invoice items
  const itemsToInsert = data.items.map((item, index) => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    tax_rate: item.taxRate,
    total: item.quantity * item.unitPrice * (1 + item.taxRate / 100),
    sort_order: index,
  }))

  const { error: itemsError } = await supabase.from("invoice_items").insert(itemsToInsert)

  if (itemsError) {
    console.error("Error creating invoice items:", itemsError)
    // Rollback invoice
    await supabase.from("invoices").delete().eq("id", invoice.id)
    return {
      success: false,
      error: "Failed to create invoice items. Please try again.",
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
