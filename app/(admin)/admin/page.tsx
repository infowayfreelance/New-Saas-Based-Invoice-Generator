import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, FileText, CreditCard, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default async function AdminDashboard() {
  const supabase = await createClient()

  let usersCount = 0
  let invoicesCount = 0
  let totalRevenue = 0
  let activeSubscriptions = 0
  let recentUsers: any[] = []
  let recentInvoices: any[] = []
  let hasDbError = false

  try {
    const { count: users } = await supabase.from("users").select("*", { count: "exact", head: true })
    usersCount = users || 0

    const { count: invoices } = await supabase.from("invoices").select("*", { count: "exact", head: true })
    invoicesCount = invoices || 0

    const { data: paidInvoices } = await supabase.from("invoices").select("total_amount").eq("status", "paid")
    totalRevenue = paidInvoices?.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0) || 0

    const { count: active } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "ACTIVE")
    activeSubscriptions = active || 0

    const { data: users_data } = await supabase
      .from("users")
      .select("id, email, name, created_at, role")
      .order("created_at", { ascending: false })
      .limit(5)
    recentUsers = users_data || []

    const { data: invoices_data } = await supabase
      .from("invoices")
      .select("id, invoice_number, total_amount, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
    recentInvoices = invoices_data || []
  } catch (error: any) {
    console.error("Admin dashboard error:", error)
    hasDbError = true
  }
  // </CHANGE>

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <AdminHeader title="Dashboard" description="Overview of your SaaS platform" />
      <main className="flex-1 space-y-6 p-6">
        {hasDbError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Error</AlertTitle>
            <AlertDescription>
              Unable to load dashboard data. Please ensure the database tables have been created by running the SQL
              migration scripts.
            </AlertDescription>
          </Alert>
        )}
        {/* </CHANGE> */}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoicesCount}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From paid invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              {recentUsers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">No users found</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {recentInvoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Number</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>${Number(invoice.total_amount || 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              invoice.status?.toLowerCase() === "paid"
                                ? "default"
                                : invoice.status?.toLowerCase() === "sent"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">No invoices found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
