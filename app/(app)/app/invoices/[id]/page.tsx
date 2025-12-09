import type React from "react"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { InvoicePreview } from "@/components/invoice/invoice-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Send, Edit, Clock, CheckCircle2 } from "lucide-react"
import { formatCurrency, formatDate, type InvoiceFormData } from "@/lib/utils/invoice"

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch invoice with items
  const { data: invoice } = await supabase.from("invoices").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!invoice) {
    notFound()
  }

  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id)
    .order("sort_order", { ascending: true })

  // Convert to form data for preview
  const formData: InvoiceFormData = {
    fromName: invoice.from_name || "",
    fromEmail: invoice.from_email || "",
    fromAddress: invoice.from_address || "",
    clientName: invoice.client_name || "",
    clientEmail: invoice.client_email || "",
    clientAddress: invoice.client_address || "",
    invoiceNumber: invoice.invoice_number,
    issueDate: invoice.issue_date,
    dueDate: invoice.due_date,
    currency: invoice.currency,
    items:
      items?.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unit_price),
        taxRate: Number(item.tax_rate),
      })) || [],
    notes: invoice.notes || "",
    terms: invoice.terms || "",
    taxRate: 0,
    discountAmount: Number(invoice.discount_amount),
  }

  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }
    > = {
      PAID: { variant: "default", icon: CheckCircle2 },
      SENT: { variant: "secondary", icon: Send },
      DRAFT: { variant: "outline", icon: Edit },
      OVERDUE: { variant: "destructive", icon: Clock },
      PARTIALLY_PAID: { variant: "secondary", icon: Clock },
    }
    const { variant, icon: Icon } = config[status] || { variant: "outline", icon: Clock }
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
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
        <Button variant="outline" className="bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Send Email
        </Button>
      </PageHeader>
      <div className="flex-1 space-y-6 p-6">
        {/* Status Banner */}
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {getStatusBadge(invoice.status)}
              <div>
                <p className="font-semibold">{formatCurrency(Number(invoice.total_amount), invoice.currency)}</p>
                <p className="text-sm text-muted-foreground">Due {formatDate(invoice.due_date)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {invoice.status === "DRAFT" && (
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Send className="mr-2 h-4 w-4" />
                  Mark as Sent
                </Button>
              )}
              {(invoice.status === "SENT" || invoice.status === "PARTIALLY_PAID") && (
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
            <div className="rounded-lg border border-border shadow-sm">
              <InvoicePreview data={formData} />
            </div>
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
                    <span>{formatCurrency(Number(invoice.subtotal), invoice.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(Number(invoice.tax_amount), invoice.currency)}</span>
                  </div>
                  {Number(invoice.discount_amount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span>-{formatCurrency(Number(invoice.discount_amount), invoice.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-4 font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(Number(invoice.total_amount), invoice.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span>{formatCurrency(Number(invoice.amount_paid), invoice.currency)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-primary">
                    <span>Balance Due</span>
                    <span>
                      {formatCurrency(Number(invoice.total_amount) - Number(invoice.amount_paid), invoice.currency)}
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
