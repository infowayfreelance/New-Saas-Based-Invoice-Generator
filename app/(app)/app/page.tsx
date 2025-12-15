import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Plus, Users, TrendingUp, Clock, ArrowRight, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils/invoice"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let userData
  let hasDbError = false
  let dbErrorMessage = ""

  try {
    // Fetch user with plan
    const { data, error } = await supabase
      .from("users")
      .select(
        `
      *,
      plan:plans(*)
    `,
      )
      .eq("id", user.id)
      .single()

    if (error) throw error
    userData = data
  } catch (error: any) {
    if (error?.code === "42P01" || error?.code === "PGRST204" || error?.message?.includes("does not exist")) {
      hasDbError = true
      dbErrorMessage = "Database tables not found. Please run the SQL migration scripts."
    } else {
      throw error
    }
  }

  // If database is not set up, show setup instructions
  if (hasDbError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Database Setup Required
            </CardTitle>
            <CardDescription>The database tables haven't been created yet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Setup Instructions</AlertTitle>
              <AlertDescription>
                Run these SQL scripts in your Supabase SQL Editor in order:
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                  <li>
                    <code className="rounded bg-muted px-1">scripts/001_create_tables.sql</code>
                  </li>
                  <li>
                    <code className="rounded bg-muted px-1">scripts/002_enable_rls.sql</code>
                  </li>
                  <li>
                    <code className="rounded bg-muted px-1">scripts/003_seed_data.sql</code>
                  </li>
                  <li>
                    <code className="rounded bg-muted px-1">scripts/004_create_user_trigger.sql</code>
                  </li>
                  <li>
                    <code className="rounded bg-muted px-1">scripts/005_fix_default_plan.sql</code>
                  </li>
                </ol>
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">After running all scripts, refresh this page to continue.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  let totalInvoices = 0
  let paidInvoices: any[] = []
  let pendingInvoices: any[] = []
  let clientCount = 0
  let recentInvoices: any[] = []
  let usageLog: any = null

  try {
    // Fetch invoice stats
    const { count } = await supabase.from("invoices").select("id", { count: "exact" }).eq("user_id", user.id)
    totalInvoices = count || 0

    const { data: paid } = await supabase.from("invoices").select("total").eq("user_id", user.id).eq("status", "PAID")
    paidInvoices = paid || []

    const { data: pending } = await supabase
      .from("invoices")
      .select("total")
      .eq("user_id", user.id)
      .in("status", ["SENT", "DRAFT"])
    pendingInvoices = pending || []

    const { count: clients } = await supabase.from("clients").select("id", { count: "exact" }).eq("user_id", user.id)
    clientCount = clients || 0

    // Recent invoices
    const { data: recent } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
    recentInvoices = recent || []

    // Get today's usage
    const today = new Date().toISOString().split("T")[0]
    const { data: usage } = await supabase
      .from("usage_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle()
    usageLog = usage
  } catch (error) {
    // If queries fail, continue with empty data
    console.error("Error fetching dashboard data:", error)
  }

  const totalPaid = paidInvoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0
  const totalPending = pendingInvoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0

  const planCode = userData?.plan?.code || "BASIC"
  const dailyLimit = userData?.plan?.invoice_limit_per_day
  const monthlyLimit = userData?.plan?.invoice_limit_per_month

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
                      <p className="font-medium">{formatCurrency(Number(invoice.total), invoice.currency)}</p>
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
