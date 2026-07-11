import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, FileText, MoreHorizontal, Eye, Download, Send } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/invoice"
import { InvoiceListActions } from "@/components/invoice/invoice-list-actions"

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Build query - join clients to get client name
  let query = supabase
    .from("invoices")
    .select("*, clients(name, company_name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status.toLowerCase())
  }

  if (params.search) {
    query = query.or(
      `invoice_number.ilike.%${params.search}%,clients.name.ilike.%${params.search}%,clients.company_name.ilike.%${params.search}%`
    )
  }

  const { data: invoices } = await query.limit(50)

  const getStatusBadge = (status: string) => {
    const normalized = (status || "").toLowerCase()
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      paid: "default",
      sent: "secondary",
      draft: "outline",
      overdue: "destructive",
      partially_paid: "secondary",
      cancelled: "outline",
    }
    return <Badge variant={variants[normalized] || "outline"}>{normalized.replace(/_/g, " ").toUpperCase()}</Badge>
  }

  return (
    <>
      <PageHeader title="Invoices" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Invoices" }]}>
        <Button asChild>
          <Link href="/app/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </PageHeader>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <form className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search invoices..."
                  defaultValue={params.search || ""}
                  className="pl-9"
                />
              </div>
              <Select name="status" defaultValue={params.status || "all"}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partially_paid">Partially Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" variant="secondary">
                Filter
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>{invoices?.length || 0} invoices found</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices && invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => {
                      // Get client name with priority: company_name > name > fallback
                      const clientName = invoice.clients?.company_name || invoice.clients?.name || "—"
                      
                      return (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">
                            <Link href={`/app/invoices/${invoice.id}`} className="hover:text-primary hover:underline">
                              {invoice.invoice_number}
                            </Link>
                          </TableCell>
                          <TableCell>{clientName}</TableCell>
                          <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                          <TableCell>{formatDate(invoice.due_date)}</TableCell>
                          <TableCell>{formatCurrency(Number(invoice.total_amount), invoice.currency)}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>
                            <InvoiceListActions invoiceId={invoice.id} invoiceNumber={invoice.invoice_number} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">No invoices found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {params.search || params.status
                    ? "Try adjusting your filters"
                    : "Create your first invoice to get started."}
                </p>
                <Button asChild className="mt-4">
                  <Link href="/app/invoices/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
