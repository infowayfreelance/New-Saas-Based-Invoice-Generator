import { createServiceClient } from "@/lib/supabase/service"

/**
 * Minimal, unauthenticated invoice summary used for the public invoice page's
 * metadata and its Open Graph share image. Uses the service-role client to
 * bypass RLS, but only ever returns the single invoice matching this exact
 * ID - the invoice's own UUID is the access token.
 */
export async function getPublicInvoiceSummary(id: string) {
  const supabase = createServiceClient()

  const { data: invoice } = await supabase
    .from("invoices")
    .select("invoice_number, total_amount, currency, due_date, client_id, user_id")
    .eq("id", id)
    .maybeSingle()

  if (!invoice) return null

  const [{ data: client }, { data: userSettings }] = await Promise.all([
    invoice.client_id
      ? supabase.from("clients").select("name, company_name").eq("id", invoice.client_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("user_settings").select("business_name, full_name").eq("user_id", invoice.user_id).maybeSingle(),
  ])

  return {
    invoiceNumber: invoice.invoice_number as string,
    totalAmount: invoice.total_amount as number,
    currency: invoice.currency as string,
    dueDate: invoice.due_date as string,
    businessName: userSettings?.business_name || userSettings?.full_name || "Business",
    clientName: client?.name || client?.company_name || null,
  }
}
