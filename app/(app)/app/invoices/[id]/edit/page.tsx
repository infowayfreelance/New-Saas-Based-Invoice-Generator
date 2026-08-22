import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { type InvoiceFormData, toNumber, formatBankDetails } from "@/lib/utils/invoice"
import { EditInvoiceForm } from "@/components/invoice/edit-invoice-form"

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export default async function InvoiceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!isValidUUID(id)) {
    return (
      <>
        <PageHeader
          title="Invalid Invoice ID"
          breadcrumbs={[
            { label: "Dashboard", href: "/app" },
            { label: "Invoices", href: "/app/invoices" },
            { label: "Error" },
          ]}
        />
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Invalid Invoice ID</AlertTitle>
            <AlertDescription>The invoice ID is not valid.</AlertDescription>
          </Alert>
          <Link href="/app/invoices">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <>
        <PageHeader
          title="Authentication Required"
          breadcrumbs={[
            { label: "Dashboard", href: "/app" },
            { label: "Invoices", href: "/app/invoices" },
            { label: "Error" },
          ]}
        />
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Authenticated</AlertTitle>
            <AlertDescription>You must be logged in to edit invoices.</AlertDescription>
          </Alert>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </>
    )
  }

  // Fetch invoice
  const invoiceResult = await supabase.from("invoices").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!invoiceResult.data || invoiceResult.error) {
    return (
      <>
        <PageHeader
          title="Invoice Not Found"
          breadcrumbs={[
            { label: "Dashboard", href: "/app" },
            { label: "Invoices", href: "/app/invoices" },
            { label: "Error" },
          ]}
        />
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Invoice Not Found</AlertTitle>
            <AlertDescription>
              The invoice you're trying to edit doesn't exist or you don't have permission to edit it.
            </AlertDescription>
          </Alert>
          <Link href="/app/invoices">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </>
    )
  }

  const invoice = invoiceResult.data

  // Fetch related data
  const [itemsResult, clientResult, settingsResult, bankAccountResult, templateResult] = await Promise.all([
    supabase.from("invoice_items").select("*").eq("invoice_id", id).order("created_at", { ascending: true }),
    invoice.client_id
      ? supabase
          .from("clients")
          .select(
            `
        id,
        name,
        company_name,
        email,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        tax_number
      `
          )
          .eq("id", invoice.client_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("bank_accounts")
      .select("account_name, bank_name, account_number, routing_number, swift_code")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("invoice_templates")
      .select("logo_url, primary_color, accent_color, watermark_text, signature_url, layout_config")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const items = itemsResult.data || []
  const client = clientResult.data
  const userSettings = settingsResult.data
  const bankAccount = bankAccountResult.data
  const template = templateResult.data

  // Prepare form data
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

  const initialData: InvoiceFormData & { clientId?: string | null } = {
    fromName: userSettings?.business_name || userSettings?.full_name || user.email || "Your Business Name",
    fromEmail: userSettings?.email || user.email || "",
    fromAddress: senderAddressBlock,
    clientName: client?.name || client?.company_name || "",
    clientEmail: client?.email || "",
    clientAddress: clientAddress,
    clientId: invoice.client_id || null,
    invoiceNumber: invoice.invoice_number,
    issueDate: invoice.issue_date,
    dueDate: invoice.due_date,
    currency: invoice.currency,
    items:
      items.map((item) => ({
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
    poNumber: invoice.po_number || "",
    fromTaxId: userSettings?.tax_id || "",
    clientTaxId: client?.tax_number || "",
    logoUrl: template?.logo_url || undefined,
    primaryColor: template?.primary_color || undefined,
    accentColor: template?.accent_color || undefined,
    watermarkText: template?.watermark_text || undefined,
    signatureUrl: template?.signature_url || undefined,
    layoutStyle: invoice.layout_style || (template?.layout_config as { style?: string } | null)?.style || undefined,
    status: invoice.status || undefined,
    amountPaid: toNumber(invoice.amount_paid),
  }

  return (
    <>
      <PageHeader
        title={`Edit Invoice ${invoice.invoice_number}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Invoices", href: "/app/invoices" },
          { label: invoice.invoice_number, href: `/app/invoices/${id}` },
          { label: "Edit" },
        ]}
      />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <EditInvoiceForm invoiceId={id} initialData={initialData} />
      </div>
    </>
  )
}
