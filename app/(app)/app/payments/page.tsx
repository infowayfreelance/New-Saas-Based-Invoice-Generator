import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Receipt, Lock, DollarSign } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/invoice"

export default async function PaymentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select(`*, plan:plans(*)`).eq("id", user.id).single()

  const planCode = userData?.plan?.code || "BASIC"
  const canAccessPayments = planCode === "PRO" || planCode === "STANDARD"

  if (!canAccessPayments) {
    return (
      <>
        <PageHeader title="Payments" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Payments" }]} />
        <div className="flex flex-1 items-center justify-center p-6">
          <Card className="max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle>Payment Tracking</CardTitle>
              <CardDescription>
                Track partial payments, record payment methods, and keep a complete payment history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/app/subscription">
                <Button>Upgrade to Standard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  // Fetch payments
  const { data: payments } = await supabase
    .from("payment_entries")
    .select(`
      *,
      invoice:invoices(invoice_number, client_name)
    `)
    .eq("user_id", user.id)
    .order("payment_date", { ascending: false })
    .limit(50)

  const totalReceived = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

  return (
    <>
      <PageHeader title="Payments" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Payments" }]}>
        <Link href="/app/payments/record">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </Link>
      </PageHeader>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Received</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalReceived)}</div>
              <p className="text-xs text-muted-foreground">{payments?.length || 0} payments recorded</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All recorded payments across your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {payments && payments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.payment_date)}</TableCell>
                      <TableCell>
                        <Link href={`/app/invoices/${payment.invoice_id}`} className="font-medium hover:underline">
                          {payment.invoice?.invoice_number || "—"}
                        </Link>
                      </TableCell>
                      <TableCell>{payment.invoice?.client_name || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.method || "Other"}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        +{formatCurrency(payment.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Receipt className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">No payments recorded</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Record payments as they come in to track your income.
                </p>
                <Link href="/app/payments/record">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Record Payment
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
