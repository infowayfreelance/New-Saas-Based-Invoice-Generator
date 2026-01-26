"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export interface RecordPaymentInput {
  invoiceId: string
  amount: number
  paymentDate: string
  paymentMethod?: string
  reference?: string
  dashboardCurrency: string
}

interface FXRate {
  base_currency: string
  target_currency: string
  rate: number
  rate_date: string
}

/**
 * Get the latest FX rate for currency conversion
 */
async function getFXRate(
  fromCurrency: string,
  toCurrency: string,
): Promise<{ rate: number; date: string } | { error: string }> {
  try {
    // If same currency, return 1:1
    if (fromCurrency === toCurrency) {
      return {
        rate: 1.0,
        date: new Date().toISOString().split("T")[0],
      }
    }

    const supabase = await createClient()

    // Try to get the latest rate from fx_latest_rates view
    const { data, error } = await supabase
      .from("fx_rates")
      .select("rate, rate_date")
      .eq("base_currency", fromCurrency)
      .eq("target_currency", toCurrency)
      .order("rate_date", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      console.error("[v0] Error fetching FX rate:", error)
      // Return a fallback rate of 1.0 if not found
      return {
        rate: 1.0,
        date: new Date().toISOString().split("T")[0],
      }
    }

    return {
      rate: Number(data.rate),
      date: data.rate_date,
    }
  } catch (error: any) {
    console.error("[v0] Error in getFXRate:", error)
    return { error: error.message || "Failed to get FX rate" }
  }
}

/**
 * Record a payment for an invoice
 */
export async function recordPayment(
  input: RecordPaymentInput,
): Promise<{ success: true; newStatus: string; totalPaid: number; remaining: number } | { error: string }> {
  try {
    console.log("[v0] recordPayment called with:", { invoiceId: input.invoiceId, amount: input.amount, date: input.paymentDate })
    
    const supabase = await createClient()

    // Get authenticated user - CRITICAL: This must return a valid user for RLS to work
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Auth check - user:", user?.id, "error:", authError)

    if (!user || authError) {
      console.error("[v0] UNAUTHORIZED: No user context in server action", { authError })
      throw new Error("Unauthorized: Authentication required")
    }

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("id, user_id, client_id, currency, total_amount, amount_paid, status")
      .eq("id", input.invoiceId)
      .single()

    if (invoiceError || !invoice) {
      console.error("[v0] Error fetching invoice:", invoiceError)
      return { error: "Invoice not found" }
    }

    console.log("[v0] Invoice fetched:", { id: invoice.id, total: invoice.total_amount, paid: invoice.amount_paid, status: invoice.status })

    // Verify ownership
    if (invoice.user_id !== user.id) {
      return { error: "Unauthorized" }
    }

    // Block additional payments if invoice is already fully paid
    if (invoice.status === 'paid') {
      return { error: "This invoice is already fully paid" }
    }

    const invoiceTotal = Number(invoice.total_amount || 0)

    // Get FX rate
    const fxResult = await getFXRate(invoice.currency, input.dashboardCurrency)

    if ("error" in fxResult) {
      return { error: fxResult.error }
    }

    const { rate: fxRate, date: fxDate } = fxResult

    // Calculate converted amount
    const convertedAmount = input.amount * fxRate

    // Insert payment entry with explicit user_id for RLS compliance
    const paymentEntry = {
      user_id: user.id,
      invoice_id: input.invoiceId,
      client_id: invoice.client_id,
      amount: input.amount,
      payment_date: input.paymentDate,
      payment_method: input.paymentMethod || null,
      payment_reference: input.reference || null,
      payment_currency: invoice.currency,
      fx_rate: fxRate,
      fx_date: fxDate,
      converted_amount: convertedAmount,
      converted_currency: input.dashboardCurrency,
    }
    
    console.log("[v0] Inserting payment entry:", paymentEntry)
    console.log("[v0] Active user_id for RLS:", user.id)
    
    const { data: insertedPayment, error: insertError } = await supabase
      .from("payment_entries")
      .insert(paymentEntry)
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Error inserting payment:", insertError)
      console.error("[v0] Insert error details:", {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      })
      return { error: "Failed to record payment: " + (insertError.message || "Unknown error") }
    }

    if (!insertedPayment) {
      console.error("[v0] No payment data returned after insert")
      return { error: "Failed to record payment: No data returned" }
    }

    console.log("[v0] Payment entry inserted successfully:", insertedPayment.id)

    // STEP 2: Calculate total paid from all payment_entries for this invoice
    const { data: paymentData, error: paymentError } = await supabase
      .from("payment_entries")
      .select("amount")
      .eq("invoice_id", input.invoiceId)
      .eq("user_id", user.id)

    if (paymentError) {
      console.error("[v0] Error calculating total paid:", paymentError)
      return { error: "Failed to calculate payment total" }
    }

    const totalPaid = (paymentData || []).reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0,
    )

    console.log("[v0] Total paid calculated:", totalPaid, "from", paymentData?.length, "payments")

    // STEP 3: Calculate remaining amount
    const remaining = Math.max(0, invoiceTotal - totalPaid)

    console.log("[v0] Remaining calculated:", remaining, "(total:", invoiceTotal, "- paid:", totalPaid, ")")

    // STEP 4: Update invoice status and amount_paid (using lowercase status values)
    let newStatus: string
    if (remaining <= 0) {
      newStatus = 'paid'
    } else if (totalPaid > 0) {
      newStatus = 'partially_paid'
    } else {
      newStatus = invoice.status // Keep existing status if no payment
    }

    console.log("[v0] New status:", newStatus)

    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        status: newStatus,
        amount_paid: totalPaid,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.invoiceId)
      .eq("user_id", user.id)

    if (updateError) {
      console.error("[v0] Error updating invoice status:", updateError)
      return { error: "Payment recorded but failed to update invoice status" }
    }

    console.log("[v0] Invoice updated successfully - status:", newStatus, "amount_paid:", totalPaid)

    // Revalidate dashboard and payment pages
    revalidatePath("/app")
    revalidatePath("/app/payments")
    revalidatePath("/app/invoices")

    return { 
      success: true,
      newStatus,
      totalPaid,
      remaining: remaining > 0 ? remaining : 0,
    }
  } catch (error: any) {
    console.error("[v0] Error in recordPayment:", error)
    return { error: error.message || "An unexpected error occurred" }
  }
}

/**
 * Get invoice details for payment recording
 */
export async function getInvoiceForPayment(invoiceId: string) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      console.error("[v0] UNAUTHORIZED: No user context in getInvoiceForPayment", { authError })
      throw new Error("Unauthorized: Authentication required")
    }

    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(
        `
        id,
        invoice_number,
        currency,
        total_amount,
        amount_paid,
        status,
        client_id,
        clients (
          name
        )
      `,
      )
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single()

    if (error || !invoice) {
      console.error("[v0] Error fetching invoice:", error)
      return { error: "Invoice not found" }
    }

    const remaining = Number(invoice.total_amount || 0) - Number(invoice.amount_paid || 0)

    return {
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      currency: invoice.currency,
      total_amount: Number(invoice.total_amount || 0),
      amount_paid: Number(invoice.amount_paid || 0),
      remaining_amount: remaining > 0 ? remaining : 0,
      status: invoice.status,
      client_name: invoice.clients?.name || "Unknown Client",
    }
  } catch (error: any) {
    console.error("[v0] Error in getInvoiceForPayment:", error)
    return { error: error.message || "An unexpected error occurred" }
  }
}
