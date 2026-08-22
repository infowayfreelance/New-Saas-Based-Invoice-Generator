import type { Metadata } from "next"
import { createServiceClient } from "@/lib/supabase/service"
import { toNumber, formatCurrency, formatDate, formatBankDetails, type InvoiceFormData } from "@/lib/utils/invoice"
import { PublicInvoiceView } from "@/components/invoice/public-invoice-view"
import { getPublicInvoiceSummary } from "@/lib/data/public-invoice"

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

const noindexRobots = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false },
} as const

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  if (!isValidUUID(id)) return { title: "Invoice not found", robots: noindexRobots }

  const summary = await getPublicInvoiceSummary(id).catch(() => null)
  if (!summary) return { title: "Invoice not found", robots: noindexRobots }

  const title = `Invoice ${summary.invoiceNumber} from ${summary.businessName}`
  const description = `${formatCurrency(toNumber(summary.totalAmount), summary.currency)} due ${formatDate(summary.dueDate)}${
    summary.clientName ? ` · Billed to ${summary.clientName}` : ""
  }`

  return {
    title,
    description,
    // This page exposes one specific client's real financial data - never
    // index it or let search engines follow/cache it, even though the OG
    // preview above is meant for chat apps like WhatsApp to render.
    robots: noindexRobots,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  }
}

/**
 * Public, unauthenticated invoice view - shared via a link (e.g. WhatsApp)
 * so a client without an account can view/download the PDF. The invoice
 * UUID itself is the access token, same approach used by hosted-invoice
 * pages elsewhere; only the single matching invoice is ever returned.
 */
export default async function PublicInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!isValidUUID(id)) {
    return <NotFound />
  }

  try {
    const supabase = createServiceClient()

    const { data: invoice } = await supabase.from("invoices").select("*").eq("id", id).maybeSingle()

    if (!invoice) {
      return <NotFound />
    }

    const [{ data: items }, { data: client }, { data: userSettings }, { data: bankAccount }] = await Promise.all([
      supabase.from("invoice_items").select("*").eq("invoice_id", id).order("created_at", { ascending: true }),
      invoice.client_id
        ? supabase.from("clients").select("*").eq("id", invoice.client_id).maybeSingle()
        : Promise.resolve({ data: null }),
      supabase.from("user_settings").select("*").eq("user_id", invoice.user_id).maybeSingle(),
      supabase
        .from("bank_accounts")
        .select("account_name, bank_name, account_number, routing_number, swift_code")
        .eq("user_id", invoice.user_id)
        .order("is_default", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

    const clientAddress = client
      ? [
          client.address_line1,
          client.address_line2,
          [client.city, client.state].filter(Boolean).join(", "),
          client.postal_code,
          client.country,
        ]
          .filter(Boolean)
          .join("\n")
      : ""

    const senderAddress = userSettings
      ? [
          userSettings.address_line1,
          userSettings.address_line2,
          [userSettings.city, userSettings.state].filter(Boolean).join(", "),
          userSettings.postal_code,
          userSettings.country,
        ]
          .filter(Boolean)
          .join("\n")
      : ""

    const senderAddressBlock = [
      senderAddress,
      userSettings?.phone ? `Phone: ${userSettings.phone}` : null,
      userSettings?.email ? `Email: ${userSettings.email}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    const formData: InvoiceFormData = {
      fromName: userSettings?.business_name || userSettings?.full_name || "Business",
      fromEmail: userSettings?.email || "",
      fromAddress: senderAddressBlock,
      clientName: client?.name || client?.company_name || "Client",
      clientEmail: client?.email || "",
      clientAddress,
      invoiceNumber: invoice.invoice_number,
      issueDate: invoice.issue_date,
      dueDate: invoice.due_date,
      currency: invoice.currency,
      items:
        items?.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: toNumber(item.quantity),
          unitPrice: toNumber(item.unit_price),
          taxRate: toNumber(item.tax_rate),
        })) || [],
      notes: invoice.notes || "",
      terms: invoice.terms || "",
      taxRate: 0,
      discountAmount: toNumber(invoice.discount_amount),
      bankDetails: invoice.bank_details || formatBankDetails(bankAccount),
    }

    return <PublicInvoiceView data={formData} invoiceNumber={invoice.invoice_number} />
  } catch (error) {
    console.error("[v0] Error loading public invoice:", error)
    return <NotFound />
  }
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-xl font-semibold">Invoice not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This invoice link is invalid or no longer available.
        </p>
      </div>
    </div>
  )
}
