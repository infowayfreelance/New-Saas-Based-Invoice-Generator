import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Plus, Users, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils/invoice"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user with plan
  const { data: userData } = await supabase
    .from("users")
    .select(
      `
      *,
      plan:plans(*)
    `,
    )
    .eq("id", user.id)
    .single()

  // Fetch invoice stats
  const { count: totalInvoices } = await supabase
    .from("invoices")
    .select("id", { count: "exact" })
    .eq("user_id", user.id)

  const { data: paidInvoices } = await supabase
    .from("invoices")
    .select("total_amount")
    .eq("user_id", user.id)
    .eq("status", "PAID")

  const { data: pendingInvoices } = await supabase
    .from("invoices")
    .select("total_amount")
    .eq("user_id", user.id)
    .in("status", ["SENT", "DRAFT"])

  const { count: clientCount } = await supabase.from("clients").select("id", { count: "exact" }).eq("user_id", user.id)

  // Recent invoices
  const { data: recentInvoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const totalPaid = paidInvoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0
  const totalPending = pendingInvoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0

  const planCode = userData?.plan?.code || "BASIC"
  const dailyLimit = userData?.plan?.invoice_limit_per_day
  const monthlyLimit = userData?.plan?.invoice_limit_per_month

  // Get today's usage
  const today = new Date().toISOString().split("T")[0]
  const { data: usageLog } = await supabase
    .from("usage_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .single()

  const dailyUsed = usageLog?.invoices_today || 0

  return (
    <>
      <PageHeader title="Dashboard">
        <Link href="/app/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </PageHeader>
      <div className="flex-1 space-y-6 p-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back{userData?.name ? `, ${userData.name}` : ""}</h2>
            <p className="text-muted-foreground">Here's what's happening with your invoices today.</p>
          </div>
          <Badge variant="secondary" className="w-fit">
            {userData?.plan?.name || "Basic"} Plan
          </Badge>
        </div>

        {/* Usage Limits (for limited plans) */}
        {(dailyLimit || monthlyLimit) && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Usage This Period</CardTitle>
              <CardDescription>Your invoice creation limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dailyLimit && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Usage</span>
                    <span>
                      {dailyUsed} / {dailyLimit}
                    </span>
                  </div>
                  <Progress value={(dailyUsed / dailyLimit) * 100} />
                </div>
              )}
              {monthlyLimit && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Usage</span>
                    <span>
                      {totalInvoices || 0} / {monthlyLimit}
                    </span>
                  </div>
                  <Progress value={((totalInvoices || 0) / monthlyLimit) * 100} />
                </div>
              )}
              <Link href="/app/subscription" className="inline-flex items-center text-sm text-primary hover:underline">
                Upgrade for unlimited invoices
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoices || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Received</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
              <p className="text-xs text-muted-foreground">From paid invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPending)}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                {planCode === "BASIC" ? (
                  <Link href="/app/subscription" className="text-primary hover:underline">
                    Upgrade to manage clients
                  </Link>
                ) : (
                  "Total clients"
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Your latest invoices</CardDescription>
            </div>
            <Link href="/app/invoices">
              <Button variant="outline" size="sm" className="bg-transparent">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentInvoices && recentInvoices.length > 0 ? (
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{invoice.invoice_number}</p>
                        <p className="text-sm text-muted-foreground">{invoice.client_name || "No client"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(Number(invoice.total_amount), invoice.currency)}</p>
                      <Badge
                        variant={
                          invoice.status === "PAID"
                            ? "default"
                            : invoice.status === "SENT"
                              ? "secondary"
                              : invoice.status === "OVERDUE"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">No invoices yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create your first invoice to get started.</p>
                <Link href="/app/invoices/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
