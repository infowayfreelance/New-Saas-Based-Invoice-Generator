"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * SINGLE SOURCE OF TRUTH for invoice status updates
 * Updates invoice.status to 'sent' and sets sent_at timestamp
 * 
 * This is the ONLY function that should be used to mark invoices as sent
 * from the dashboard workflow.
 */
export async function markInvoiceAsSent(invoiceId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to update invoices",
    }
  }

  // Verify invoice ownership before updating
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("id, status")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .single()

  if (invoiceError || !invoice) {
    return {
      success: false,
      error: "Invoice not found or access denied",
    }
  }

  // Update invoice status to 'sent' (lowercase to match DB schema)
  // Also set sent_at timestamp
  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      status: "sent",
      sent_at: new Date().toISOString(),
    })
    .eq("id", invoiceId)
    .eq("user_id", user.id)

  if (updateError) {
    console.error("[v0] Error updating invoice status to sent:", updateError)
    return {
      success: false,
      error: "Failed to update invoice status",
    }
  }

  console.log("[v0] Invoice marked as sent:", invoiceId, "| status: sent")

  return {
    success: true,
  }
}
