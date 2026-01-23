"use server"

import { createClient } from "@/lib/supabase/server"
import { type InvoiceFormData, calculateInvoiceTotals, toNumber } from "@/lib/utils/invoice"

/**
 * Single source of truth for updating invoices
 * NO redirects, NO UI logic
 */
export async function updateInvoice(
  invoiceId: string,
  data: InvoiceFormData & { clientId?: string | null }
): Promise<{ success: boolean; error?: string }> {
  // Validation
  if (!invoiceId || typeof invoiceId !== "string" || invoiceId.trim() === "") {
    console.error("[v0] updateInvoice: Invalid invoiceId:", invoiceId)
    return { success: false, error: "Invalid invoice ID" }
  }

  if (!data.items || data.items.length === 0) {
    console.error("[v0] updateInvoice: No items provided")
    return { success: false, error: "Invoice must have at least one item" }
  }

  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error("[v0] updateInvoice: Auth error:", authError)
    return { success: false, error: "You must be logged in to update invoices" }
  }

  // Verify ownership
  const { data: existingInvoice, error: fetchError } = await supabase
    .from("invoices")
    .select("id")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !existingInvoice) {
    console.error("[v0] updateInvoice: Ownership check failed:", fetchError)
    return { success: false, error: "Invoice not found or access denied" }
  }

  // Calculate totals
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)

  // Update invoice
  const { error: invoiceError } = await supabase
    .from("invoices")
    .update({
      invoice_number: data.invoiceNumber,
      status: "DRAFT",
      issue_date: data.issueDate,
      due_date: data.dueDate,
      currency: data.currency,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      discount_amount: totals.discountAmount,
      total_amount: totals.totalAmount,
      notes: data.notes || null,
      terms: data.terms || null,
      client_id: data.clientId && data.clientId !== "none" ? data.clientId : null,
    })
    .eq("id", invoiceId)

  if (invoiceError) {
    console.error("[v0] updateInvoice: Invoice update error:", invoiceError)
    return { success: false, error: `Failed to update invoice: ${invoiceError.message}` }
  }

  // Delete existing items
  const { error: deleteError } = await supabase
    .from("invoice_items")
    .delete()
    .eq("invoice_id", invoiceId)
    .eq("user_id", user.id)

  if (deleteError) {
    console.error("[v0] updateInvoice: Delete items error:", deleteError)
    return { success: false, error: `Failed to delete old items: ${deleteError.message}` }
  }

  // Insert new items
  const itemsToInsert = data.items.map((item) => {
    const quantity = toNumber(item.quantity)
    const unitPrice = toNumber(item.unitPrice)
    const taxRate = toNumber(item.taxRate)

    return {
      invoice_id: invoiceId,
      user_id: user.id,
      description: item.description,
      quantity: quantity,
      unit_price: unitPrice,
      tax_rate: taxRate,
      total: quantity * unitPrice,
    }
  })

  const { error: itemsError } = await supabase.from("invoice_items").insert(itemsToInsert)

  if (itemsError) {
    console.error("[v0] updateInvoice: Insert items error:", itemsError)
    return { success: false, error: `Failed to create invoice items: ${itemsError.message}` }
  }

  return { success: true }
}
