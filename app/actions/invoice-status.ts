"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * SINGLE SOURCE OF TRUTH for invoice status updates
 * Marks invoice as 'sent' based on USER INTENT (Download PDF / Send Email).
 * 
 * BUSINESS RULE: User intent matters, technical success does NOT.
 * This function is idempotent - safe to call multiple times.
 * 
 * Rules:
 * - If status !== 'draft', return silently (already sent)
 * - If status === 'draft', update to 'sent'
 * - No dependency on PDF/email success
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

  // Fetch invoice and verify ownership
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

  // IDEMPOTENT: If already sent (or paid/partially_paid), return silently
  if (invoice.status !== "draft") {
    console.log("[v0] Invoice already sent (status:", invoice.status, ") - skipping update")
    return {
      success: true,
    }
  }

  // Only update if status is 'draft'
  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      status: "sent",
      updated_at: new Date().toISOString(),
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

  console.log("[v0] Invoice marked as sent:", invoiceId, "| draft → sent")

  return {
    success: true,
  }
}
