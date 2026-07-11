import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; user?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let query = supabase.from("invoices").select(
    `
      *,
      user:users(email),
      client:clients(name)
    `,
  )

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status.toLowerCase())
  }

  if (params.user) {
    query = query.eq("user_id", params.user)
  }

  const { data: invoices } = await query.order("created_at", { ascending: false })

  const { data: users } = await supabase.from("users").select("id, email").order("email")

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <AdminHeader title="Invoices" description="View all invoices in the system" />
      <main className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <form method="get" className="flex gap-4">
              <Select name="status" defaultValue={params.status || "all"}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partially_paid">Partially Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select name="user" defaultValue={params.user}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users?.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit">Apply</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/invoices">Clear</Link>
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Invoices ({invoices?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Issue Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices?.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.user?.email}</TableCell>
                    <TableCell>{invoice.client?.name || invoice.client_name || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status?.toLowerCase() === "paid"
                            ? "default"
                            : invoice.status?.toLowerCase() === "overdue"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {invoice.currency} {Number(invoice.total_amount || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invoice.issue_date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {!invoices?.length && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
