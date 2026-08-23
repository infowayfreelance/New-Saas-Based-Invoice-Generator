"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { formatBankDetails, type InvoiceFormData } from "@/lib/utils/invoice"

export async function getInvoiceDataForPDF(invoiceId: string): Promise<{ 
  success: boolean
  data?: InvoiceFormData
  error?: string 
}> {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  console.log("[v0] PDF: Fetching invoice data for ID:", invoiceId)

  // Fetch invoice with items and client data
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select(`
      *,
      invoice_items (*),
      clients (
        id,
        name,
        email,
        address,
        company_name,
        tax_number
      )
    `)
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .single()

  if (invoiceError || !invoice) {
    console.error("[v0] PDF: Invoice not found or access denied:", invoiceError)
    return { success: false, error: "Invoice not found or access denied" }
  }

  console.log("[v0] PDF: Invoice fetched successfully")

  // Get user data for "from" information
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("full_name, email")
    .eq("id", user.id)
    .single()

  if (userError) {
    console.error("[v0] PDF: Error fetching user data:", userError)
  }

  const { data: bankAccount } = await supabase
    .from("bank_accounts")
    .select("account_name, bank_name, account_number, routing_number, swift_code")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: userSettings } = await supabase
    .from("user_settings")
    .select("tax_id")
    .eq("user_id", user.id)
    .maybeSingle()

  const { data: template } = await supabase
    .from("invoice_templates")
    .select("logo_url, primary_color, accent_color, watermark_text, signature_url, layout_config")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .limit(1)
    .maybeSingle()

  // Transform to InvoiceFormData format
  const invoiceData: InvoiceFormData = {
    invoiceNumber: invoice.invoice_number,
    issueDate: invoice.issue_date,
    dueDate: invoice.due_date,
    currency: invoice.currency || "USD",
    
    // From (business) info
    fromName: userData?.full_name || "Your Business",
    fromEmail: userData?.email || "",
    fromAddress: "", // Not stored in current schema
    
    // Client info
    clientId: invoice.client_id || undefined,
    clientName: invoice.clients?.company_name || invoice.clients?.name || "",
    clientEmail: invoice.clients?.email || "",
    clientAddress: invoice.clients?.address || "",
    
    // Items
    items: (invoice.invoice_items || []).map((item: any) => ({
      id: item.id,
      description: item.description || "",
      quantity: item.quantity?.toString() || "1",
      unitPrice: item.unit_price?.toString() || "0",
      taxRate: item.tax_rate?.toString() || "0",
    })),
    
    // Totals
    discountAmount: invoice.discount_amount?.toString() || "0",
    
    // Notes
    notes: invoice.notes || "",
    terms: invoice.terms || "",
    bankDetails: invoice.bank_details || formatBankDetails(bankAccount),
    poNumber: invoice.po_number || "",
    fromTaxId: userSettings?.tax_id || "",
    clientTaxId: invoice.clients?.tax_number || "",
    logoUrl: template?.logo_url || undefined,
    primaryColor: invoice.primary_color || template?.primary_color || undefined,
    accentColor: invoice.accent_color || template?.accent_color || undefined,
    watermarkText: template?.watermark_text || undefined,
    signatureUrl: template?.signature_url || undefined,
    layoutStyle: invoice.layout_style || (template?.layout_config as { style?: string } | null)?.style || undefined,
    fontFamily: invoice.font_family || undefined,
    status: invoice.status || undefined,
    amountPaid: Number(invoice.amount_paid) || 0,
  }

  return { success: true, data: invoiceData }
}
