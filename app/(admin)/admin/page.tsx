import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, FileText, DollarSign, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get stats
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  const { count: totalInvoices } = await supabase.from("invoices").select("*", { count: "exact", head: true })

  const { data: subscriptions } = await supabase.from("subscriptions").select("*").eq("status", "active")

  const { data: invoiceTotal } = await supabase.from("invoices").select("total_amount")

  const totalRevenue = invoiceTotal?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0

  // Get recent users
  const { data: recentUsers } = await supabase
    .from("users")
    .select(
      `
      *,
      plan:plans(name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(10)

  // Get plan distribution
  const { data: planStats } = await supabase.from("users").select("plan_id, plans(name)")

  const planCounts: Record<string, number> = {}
  planStats?.forEach((u: any) => {
    const planName = u.plans?.name || "No Plan"
    planCounts[planName] = (planCounts[planName] || 0) + 1
  })

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-sm text-muted-foreground hover:text-foreground">
              Users
            </Link>
            <Link href="/admin/invoices" className="text-sm text-muted-foreground hover:text-foreground">
              Invoices
            </Link>
            <Link href="/admin/subscriptions" className="text-sm text-muted-foreground hover:text-foreground">
              Subscriptions
            </Link>
            <Link href="/app">
              <Button variant="outline" size="sm">
                Back to App
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your SaaS platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoices || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscriptions?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Plan Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Distribution</CardTitle>
              <CardDescription>Users by subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(planCounts).map(([plan, count]) => (
                  <div key={plan} className="flex items-center justify-between">
                    <span className="text-sm">{plan}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${(count / (totalUsers || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers?.slice(0, 5).map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{u.plan?.name || "None"}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
