import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, TrendingUp, TrendingDown, DollarSign, FileText, Users, Clock } from "lucide-react"
import { formatCurrency } from "@/lib/utils/invoice"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select(`*, plan:plans(*)`).eq("id", user.id).single()

  const planCode = userData?.plan?.code || "BASIC"
  const canAccessAnalytics = planCode === "PRO"

  if (!canAccessAnalytics) {
    return (
      <>
        <PageHeader title="Analytics" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Analytics" }]} />
        <div className="flex flex-1 items-center justify-center p-6">
          <Card className="max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Get deep insights into your invoicing with revenue trends, client analytics, and payment patterns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/app/subscription">
                <Button>Upgrade to Pro</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  // Fetch analytics data
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  // This month's invoices
  const { data: thisMonthInvoices } = await supabase
    .from("invoices")
    .select("total, status")
    .eq("user_id", user.id)
    .gte("created_at", thisMonth.toISOString())

  // Last month's invoices
  const { data: lastMonthInvoices } = await supabase
    .from("invoices")
    .select("total, status")
    .eq("user_id", user.id)
    .gte("created_at", lastMonth.toISOString())
    .lte("created_at", lastMonthEnd.toISOString())

  // All invoices for overall stats
  const { data: allInvoices } = await supabase
    .from("invoices")
    .select("total, status, created_at")
    .eq("user_id", user.id)

  // Clients count
  const { count: clientCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  // Calculate metrics
  const thisMonthRevenue =
    thisMonthInvoices?.reduce((sum, inv) => (inv.status === "paid" ? sum + (inv.total || 0) : sum), 0) || 0
  const lastMonthRevenue =
    lastMonthInvoices?.reduce((sum, inv) => (inv.status === "paid" ? sum + (inv.total || 0) : sum), 0) || 0
  const revenueChange = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

  const thisMonthInvoiceCount = thisMonthInvoices?.length || 0
  const lastMonthInvoiceCount = lastMonthInvoices?.length || 0
  const invoiceCountChange =
    lastMonthInvoiceCount > 0 ? ((thisMonthInvoiceCount - lastMonthInvoiceCount) / lastMonthInvoiceCount) * 100 : 0

  const totalRevenue = allInvoices?.reduce((sum, inv) => (inv.status === "paid" ? sum + (inv.total || 0) : sum), 0) || 0
  const totalPending =
    allInvoices?.reduce(
      (sum, inv) => (inv.status === "pending" || inv.status === "sent" ? sum + (inv.total || 0) : sum),
      0,
    ) || 0
  const totalOverdue =
    allInvoices?.reduce((sum, inv) => (inv.status === "overdue" ? sum + (inv.total || 0) : sum), 0) || 0

  // Monthly breakdown (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 0)
    const monthInvoices =
      allInvoices?.filter((inv) => {
        const invDate = new Date(inv.created_at)
        return invDate >= date && invDate <= monthEnd
      }) || []
    const revenue = monthInvoices.reduce((sum, inv) => (inv.status === "paid" ? sum + (inv.total || 0) : sum), 0)
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      revenue,
      count: monthInvoices.length,
    }
  })

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1)

  return (
    <>
      <PageHeader title="Analytics" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Analytics" }]} />
      <div className="flex-1 space-y-6 p-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(thisMonthRevenue)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {revenueChange >= 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={revenueChange >= 0 ? "text-green-500" : "text-red-500"}>
                  {revenueChange >= 0 ? "+" : ""}
                  {revenueChange.toFixed(1)}%
                </span>
                <span className="ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Invoices This Month</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisMonthInvoiceCount}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {invoiceCountChange >= 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={invoiceCountChange >= 0 ? "text-green-500" : "text-red-500"}>
                  {invoiceCountChange >= 0 ? "+" : ""}
                  {invoiceCountChange.toFixed(1)}%
                </span>
                <span className="ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientCount || 0}</div>
              <p className="text-xs text-muted-foreground">Active client relationships</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPending)}</div>
              <p className="text-xs text-muted-foreground">
                {totalOverdue > 0 && <span className="text-red-500">{formatCurrency(totalOverdue)} overdue</span>}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <div className="flex h-full items-end gap-2">
                {monthlyData.map((data, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="relative w-full">
                      <div
                        className="w-full rounded-t bg-primary transition-all hover:bg-primary/80"
                        style={{
                          height: `${Math.max((data.revenue / maxRevenue) * 240, 4)}px`,
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium">{data.month}</div>
                      <div className="text-xs text-muted-foreground">{formatCurrency(data.revenue, "USD", true)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Revenue</CardTitle>
              <CardDescription>All time paid invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Average Invoice</CardTitle>
              <CardDescription>Per invoice value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(allInvoices?.length ? totalRevenue / allInvoices.length : 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Collection Rate</CardTitle>
              <CardDescription>Paid vs total invoiced</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {allInvoices?.length
                  ? Math.round((allInvoices.filter((i) => i.status === "paid").length / allInvoices.length) * 100)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
