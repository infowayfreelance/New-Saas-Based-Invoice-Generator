"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface DeleteInvoiceResult {
  success: boolean
  error?: string
}

export async function deleteInvoice(invoiceId: string): Promise<DeleteInvoiceResult> {
  try {
    const supabase = await createClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Authentication error:", authError)
      return { success: false, error: "Authentication required" }
    }

    // Verify invoice ownership
    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select("id, user_id")
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single()

    if (fetchError) {
      console.error("[v0] Error fetching invoice:", fetchError)
      return { success: false, error: "Invoice not found" }
    }

    if (!invoice) {
      console.error("[v0] Invoice not found or access denied")
      return { success: false, error: "Invoice not found or access denied" }
    }

    // Delete invoice items first (foreign key constraint)
    const { error: itemsError } = await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", invoiceId)
      .eq("user_id", user.id)

    if (itemsError) {
      console.error("[v0] Error deleting invoice items:", itemsError)
      return { success: false, error: "Failed to delete invoice items" }
    }

    // Delete invoice
    const { error: deleteError } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoiceId)
      .eq("user_id", user.id)

    if (deleteError) {
      console.error("[v0] Error deleting invoice:", deleteError)
      return { success: false, error: "Failed to delete invoice" }
    }

    // Revalidate the invoices page
    revalidatePath("/app/invoices")

    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected error deleting invoice:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
