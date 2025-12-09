import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, FileText, Plus, Mail, Phone, MapPin, Building } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/invoice"

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: client } = await supabase.from("clients").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!client) {
    notFound()
  }

  // Fetch client's invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Calculate totals
  const totalInvoiced = invoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0
  const totalPaid =
    invoices?.filter((inv) => inv.status === "PAID").reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0

  const formatAddress = () => {
    const parts = [
      client.address_line1,
      client.address_line2,
      [client.city, client.state, client.postcode].filter(Boolean).join(", "),
      client.country,
    ].filter(Boolean)
    return parts.length > 0 ? parts.join("\n") : null
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PAID: "default",
      SENT: "secondary",
      DRAFT: "outline",
      OVERDUE: "destructive",
      PARTIALLY_PAID: "secondary",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  return (
    <>
      <PageHeader
        title={client.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Clients", href: "/app/clients" },
          { label: client.name },
        ]}
      >
        <Link href={`/app/clients/${id}/edit`}>
          <Button variant="outline" className="bg-transparent">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
        <Link href={`/app/invoices/new?client=${id}`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </PageHeader>
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Client Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {client.company_name && <Building className="h-5 w-5 text-muted-foreground" />}
                {client.company_name || client.name}
              </CardTitle>
              {client.company_name && <CardDescription>{client.name}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {client.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${client.email}`} className="text-sm hover:text-primary hover:underline">
                      {client.email}
                    </a>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${client.phone}`} className="text-sm hover:text-primary hover:underline">
                      {client.phone}
                    </a>
                  </div>
                )}
              </div>
              {formatAddress() && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <p className="whitespace-pre-line text-sm">{formatAddress()}</p>
                </div>
              )}
              {client.notes && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="mt-1 text-sm">{client.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalInvoiced)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{formatCurrency(totalPaid)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{invoices?.length || 0}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Client Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Invoices for this client</CardDescription>
            </div>
            <Link href={`/app/invoices/new?client=${id}`}>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {invoices && invoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <Link
                          href={`/app/invoices/${invoice.id}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {invoice.invoice_number}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                      <TableCell>{formatDate(invoice.due_date)}</TableCell>
                      <TableCell>{formatCurrency(Number(invoice.total_amount), invoice.currency)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No invoices yet for this client</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
