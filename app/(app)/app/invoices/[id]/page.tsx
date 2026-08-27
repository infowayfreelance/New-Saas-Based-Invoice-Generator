import type React from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { InvoiceDesignPreview } from "@/components/invoice/invoice-design-preview"
import { InvoiceActionButtons } from "@/components/invoice/invoice-action-buttons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Clock, CheckCircle2, Send } from "lucide-react"
import {
  formatCurrency,
  formatDate,
  toNumber,
  formatBankDetails,
  pickBankAccountForCurrency,
  type InvoiceFormData,
} from "@/lib/utils/invoice"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!isValidUUID(id)) {
    redirect("/app/invoices")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let invoice: any
  let items: any[] | null = null
  let client: any = null
  let userSettings: any = null
  let bankAccount: any = null
  let template: any = null

  try {
    // Fetch invoice first to check if it exists
    const invoiceResult = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (!invoiceResult.data || invoiceResult.error) {
      // Return error page instead of redirecting from inside try-catch
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
                The invoice you're looking for doesn't exist or you don't have permission to view it.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Link href="/app/invoices">
                <Button>Back to Invoices</Button>
              </Link>
              <Link href="/app/invoices/new">
                <Button variant="outline">Create New Invoice</Button>
              </Link>
            </div>
          </div>
        </>
      )
    }

    invoice = invoiceResult.data

    // Now fetch related data in parallel - using separate queries to avoid LEFT JOIN issues
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
            whatsapp_number,
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
      supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("bank_accounts")
        .select("account_name, bank_name, account_number, routing_number, swift_code, sort_code, bank_address, currency, is_default")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false }),
      supabase
        .from("invoice_templates")
        .select("logo_url, primary_color, accent_color, watermark_text, signature_url, layout_config")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

    items = itemsResult.data
    client = clientResult.data
    userSettings = settingsResult.data
    bankAccount = pickBankAccountForCurrency(bankAccountResult.data, invoice.currency)
    template = templateResult.data

    console.log("[v0] User settings data:", userSettings)
    console.log("[v0] Client data:", client)


  } catch (error) {
    console.error("[v0] Error loading invoice:", error)
    return (
      <>
        <PageHeader
          title="Error Loading Invoice"
          breadcrumbs={[
            { label: "Dashboard", href: "/app" },
            { label: "Invoices", href: "/app/invoices" },
            { label: "Error" },
          ]}
        />
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Invoice</AlertTitle>
            <AlertDescription>
              There was an error loading this invoice. Please try again or contact support if the problem persists.
            </AlertDescription>
          </Alert>
          <div className="flex gap-4">
            <Link href="/app/invoices">
              <Button>Back to Invoices</Button>
            </Link>
            <Link href="/app/invoices/new">
              <Button variant="outline">Create New Invoice</Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

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

  // Compose business/sender information from user_settings
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
  
  // Build sender address block with contact info
  const senderAddressBlock = [
    senderAddress,
    userSettings?.phone ? `Phone: ${userSettings.phone}` : null,
    userSettings?.email ? `Email: ${userSettings.email}` : null,
  ].filter(Boolean).join("\n")

  const formData: InvoiceFormData = {
    fromName: userSettings?.business_name || userSettings?.full_name || user.email || "Your Business Name",
    fromEmail: userSettings?.email || user.email || "",
    fromAddress: senderAddressBlock,
    clientName: client?.name || client?.company_name || "Client Name",
    clientEmail: client?.email || "",
    clientAddress: clientAddress,
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
    terms: invoice.terms || "",
    termsDetail: invoice.terms_detail || "",
    taxRate: 0,
    discountAmount: toNumber(invoice.discount_amount),
    bankDetails: invoice.bank_details || formatBankDetails(bankAccount),
    poNumber: invoice.po_number || "",
    fromTaxId: userSettings?.tax_id || "",
    clientTaxId: client?.tax_number || "",
    logoUrl: template?.logo_url || undefined,
    primaryColor: invoice.primary_color || template?.primary_color || undefined,
    accentColor: invoice.accent_color || template?.accent_color || undefined,
    watermarkText: template?.watermark_text || undefined,
    signatureUrl: template?.signature_url || undefined,
    layoutStyle: invoice.layout_style || (template?.layout_config as { style?: string } | null)?.style || undefined,
    fontFamily: invoice.font_family || undefined,
    status: invoice.status || undefined,
    amountPaid: toNumber(invoice.amount_paid),
  }

  const invoiceStatus = (invoice.status || "").toLowerCase()

  const getStatusBadge = (status: string) => {
    const normalized = (status || "").toLowerCase()
    const config: Record<
      string,
      { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }
    > = {
      paid: { variant: "default", icon: CheckCircle2 },
      sent: { variant: "secondary", icon: Send },
      draft: { variant: "outline", icon: Edit },
      overdue: { variant: "destructive", icon: Clock },
      partially_paid: { variant: "secondary", icon: Clock },
    }
    const { variant, icon: Icon } = config[normalized] || { variant: "outline", icon: Clock }
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {normalized.replace(/_/g, " ").toUpperCase()}
      </Badge>
    )
  }

  return (
    <>
      <PageHeader
        title={`Invoice ${invoice.invoice_number}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Invoices", href: "/app/invoices" },
          { label: invoice.invoice_number },
        ]}
      >
        <InvoiceActionButtons
          invoiceData={formData}
          invoiceId={id}
          invoiceNumber={invoice.invoice_number}
          totalAmount={toNumber(invoice.total_amount)}
          dueDate={invoice.due_date}
          senderWhatsapp={userSettings?.whatsapp_number}
          clientWhatsapp={client?.whatsapp_number}
        />
      </PageHeader>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Status Banner */}
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {getStatusBadge(invoice.status)}
              <div>
                <p className="font-semibold">{formatCurrency(toNumber(invoice.total_amount), invoice.currency)}</p>
                <p className="text-sm text-muted-foreground">Due {formatDate(invoice.due_date)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {invoiceStatus === "draft" && (
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Send className="mr-2 h-4 w-4" />
                  Mark as Sent
                </Button>
              )}
              {(invoiceStatus === "sent" || invoiceStatus === "partially_paid") && (
                <Button variant="outline" size="sm" className="bg-transparent">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Paid
                </Button>
              )}
              <Link href={`/app/invoices/${id}/edit`}>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-6">
            <InvoiceDesignPreview invoiceId={id} data={formData} />
          </TabsContent>
          <TabsContent value="details" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Invoice Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice Number</span>
                    <span className="font-medium">{invoice.invoice_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issue Date</span>
                    <span>{formatDate(invoice.issue_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date</span>
                    <span>{formatDate(invoice.due_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Currency</span>
                    <span>{invoice.currency}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(toNumber(invoice.subtotal), invoice.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(toNumber(invoice.tax_amount), invoice.currency)}</span>
                  </div>
                  {toNumber(invoice.discount_amount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span>-{formatCurrency(toNumber(invoice.discount_amount), invoice.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-4 font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(toNumber(invoice.total_amount), invoice.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span>{formatCurrency(toNumber(invoice.amount_paid), invoice.currency)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-primary">
                    <span>Balance Due</span>
                    <span>
                      {formatCurrency(toNumber(invoice.total_amount) - toNumber(invoice.amount_paid), invoice.currency)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity Log</CardTitle>
                <CardDescription>Invoice timeline and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Edit className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Invoice created</p>
                      <p className="text-sm text-muted-foreground">{formatDate(invoice.created_at)}</p>
                    </div>
                  </div>
                  {invoice.sent_at && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Send className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Invoice sent</p>
                        <p className="text-sm text-muted-foreground">{formatDate(invoice.sent_at)}</p>
                      </div>
                    </div>
                  )}
                  {invoice.paid_at && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Invoice paid</p>
                        <p className="text-sm text-muted-foreground">{formatDate(invoice.paid_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
