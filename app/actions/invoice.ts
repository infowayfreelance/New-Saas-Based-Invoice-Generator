"use server"

import { redirect } from "next/navigation"
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
      status: "DRAFT", // Always uppercase
      issue_date: data.issueDate,
      due_date: data.dueDate,
      currency: data.currency,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount, // Correct column name
      discount_amount: totals.discountAmount, // Correct column name
      total_amount: totals.totalAmount, // Correct column name
      notes: data.notes || null,
      terms: data.terms || null,
    })
    .select()
    .single()

  if (invoiceError) {
    console.error("[v0] Error creating invoice:", invoiceError)
    return {
      success: false,
      error: invoiceError.message || "Failed to create invoice",
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
      total: quantity * unitPrice, // Correct column name is 'total', not 'line_total'
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

export async function updateInvoice(
  invoiceId: string,
  data: InvoiceFormData & { clientId?: string | null },
): Promise<GenerateInvoiceResult> {
  console.log("[v0] ========== UPDATE INVOICE STARTED ==========")
  console.log("[v0] STEP 1: Received invoiceId:", invoiceId)
  
  // Validate invoiceId
  if (!invoiceId || typeof invoiceId !== "string" || invoiceId.trim() === "") {
    const error = "VALIDATION ERROR: invoiceId is missing or invalid"
    console.error("[v0]", error, "| Received:", invoiceId)
    throw new Error(error)
  }
  
  console.log("[v0] STEP 2: Received form payload:", {
    hasClientId: !!data.clientId,
    clientId: data.clientId,
    invoiceNumber: data.invoiceNumber,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    currency: data.currency,
    itemsCount: data.items?.length || 0,
    items: data.items,
    discountAmount: data.discountAmount,
    notes: data.notes ? `${data.notes.substring(0, 50)}...` : null,
    terms: data.terms ? `${data.terms.substring(0, 50)}...` : null,
  })

  // Validate required fields in payload
  if (!data.items || data.items.length === 0) {
    const error = "VALIDATION ERROR: items array is missing or empty"
    console.error("[v0]", error, "| Received items:", data.items)
    throw new Error(error)
  }

  const supabase = await createClient()
  console.log("[v0] STEP 3: Supabase client created")

  // Get authenticated user
  console.log("[v0] STEP 4: Getting authenticated user...")
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    const error = `AUTH ERROR: Failed to get user - ${authError.message}`
    console.error("[v0]", error, "| Full error:", authError)
    return {
      success: false,
      error: error,
    }
  }

  if (!user) {
    const error = "AUTH ERROR: User not authenticated"
    console.error("[v0]", error)
    return {
      success: false,
      error: "You must be logged in to update invoices",
    }
  }

  console.log("[v0] STEP 4 COMPLETE: User authenticated | user_id:", user.id)

  // Validate user_id
  if (!user.id) {
    const error = "VALIDATION ERROR: user_id is missing from authenticated user"
    console.error("[v0]", error)
    throw new Error(error)
  }

  // Verify invoice ownership
  console.log("[v0] STEP 5: Verifying invoice ownership...")
  console.log("[v0] STEP 5: Query params - invoiceId:", invoiceId, "| user_id:", user.id)
  
  const { data: existingInvoice, error: fetchError } = await supabase
    .from("invoices")
    .select("id")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .single()

  console.log("[v0] STEP 5 COMPLETE: Invoice ownership check result:", {
    found: !!existingInvoice,
    existingInvoice,
    error: fetchError,
  })

  if (fetchError) {
    const error = `FETCH ERROR: Failed to verify invoice ownership - ${fetchError.message} | Code: ${fetchError.code} | Details: ${fetchError.details} | Hint: ${fetchError.hint}`
    console.error("[v0]", error, "| Full error:", fetchError)
    return {
      success: false,
      error: error,
    }
  }

  if (!existingInvoice) {
    const error = "AUTHORIZATION ERROR: Invoice not found or access denied"
    console.error("[v0]", error, "| invoiceId:", invoiceId, "| user_id:", user.id)
    return {
      success: false,
      error: error,
    }
  }

  console.log("[v0] STEP 6: Calculating invoice totals...")
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)
  console.log("[v0] STEP 6 COMPLETE: Totals calculated:", totals)

  // Build update payload matching exact schema columns
  console.log("[v0] STEP 7: Building update payload...")
  const updateData: any = {
    invoice_number: data.invoiceNumber,
    status: "DRAFT", // Always uppercase
    issue_date: data.issueDate,
    due_date: data.dueDate,
    currency: data.currency,
    subtotal: totals.subtotal,
    tax_amount: totals.taxAmount, // Correct column name
    discount_amount: totals.discountAmount, // Correct column name
    total_amount: totals.totalAmount, // Correct column name
    notes: data.notes || null,
    terms: data.terms || null,
    client_id: data.clientId && data.clientId !== "none" ? data.clientId : null,
  }
  console.log("[v0] STEP 7 COMPLETE: Update payload built:", updateData)
  
  console.log("[v0] STEP 8: Updating invoices table...")
  console.log("[v0] STEP 8: Update query - invoiceId:", invoiceId, "| payload:", updateData)
  
  const { data: updatedInvoice, error: invoiceError } = await supabase
    .from("invoices")
    .update(updateData)
    .eq("id", invoiceId)
    .select()

  console.log("[v0] STEP 8 COMPLETE: Invoice update result:", {
    success: !invoiceError,
    updatedInvoice,
    error: invoiceError,
  })

  if (invoiceError) {
    const error = `INVOICE UPDATE ERROR: ${invoiceError.message} | Code: ${invoiceError.code} | Details: ${invoiceError.details} | Hint: ${invoiceError.hint}`
    console.error("[v0]", error, "| Full error:", invoiceError)
    return {
      success: false,
      error: error,
    }
  }

  // Delete existing items (scoped by invoice_id AND user_id for security)
  console.log("[v0] STEP 9: Deleting existing invoice_items...")
  console.log("[v0] STEP 9: Delete query - invoice_id:", invoiceId, "| user_id:", user.id)
  
  const { data: deletedItems, error: deleteError } = await supabase
    .from("invoice_items")
    .delete()
    .eq("invoice_id", invoiceId)
    .eq("user_id", user.id)
    .select()

  console.log("[v0] STEP 9 COMPLETE: Delete result:", {
    success: !deleteError,
    deletedCount: deletedItems?.length || 0,
    deletedItems,
    error: deleteError,
  })

  if (deleteError) {
    const error = `DELETE ITEMS ERROR: ${deleteError.message} | Code: ${deleteError.code} | Details: ${deleteError.details} | Hint: ${deleteError.hint}`
    console.error("[v0]", error, "| Full error:", deleteError)
    return {
      success: false,
      error: error,
    }
  }

  // Insert new items
  console.log("[v0] STEP 10: Preparing items to insert...")
  const itemsToInsert = data.items.map((item, index) => {
    const quantity = toNumber(item.quantity)
    const unitPrice = toNumber(item.unitPrice)
    const taxRate = toNumber(item.taxRate)

    const insertItem = {
      invoice_id: invoiceId,
      user_id: user.id,
      description: item.description,
      quantity: quantity,
      unit_price: unitPrice,
      tax_rate: taxRate,
      total: quantity * unitPrice, // Correct column name is 'total', not 'line_total'
    }

    console.log(`[v0] STEP 10: Item ${index + 1}:`, insertItem)
    return insertItem
  })

  console.log("[v0] STEP 10 COMPLETE: Prepared", itemsToInsert.length, "items for insertion")

  console.log("[v0] STEP 11: Inserting invoice_items...")
  const { data: insertedItems, error: itemsError } = await supabase
    .from("invoice_items")
    .insert(itemsToInsert)
    .select()

  console.log("[v0] STEP 11 COMPLETE: Insert result:", {
    success: !itemsError,
    insertedCount: insertedItems?.length || 0,
    insertedItems,
    error: itemsError,
  })

  if (itemsError) {
    const error = `INSERT ITEMS ERROR: ${itemsError.message} | Code: ${itemsError.code} | Details: ${itemsError.details} | Hint: ${itemsError.hint}`
    console.error("[v0]", error, "| Full error:", itemsError)
    return {
      success: false,
      error: error,
    }
  }

  console.log("[v0] ========== UPDATE INVOICE SUCCESS ==========")
  console.log("[v0] Final result: invoiceId:", invoiceId)

  return {
    success: true,
    invoiceId: invoiceId,
  }
}

export async function updateInvoiceAction(
  invoiceId: string,
  data: InvoiceFormData & { clientId?: string | null },
) {
  const result = await updateInvoice(invoiceId, data)
  if (result.success) {
    redirect(`/app/invoices/${invoiceId}`)
  }
  return result
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
