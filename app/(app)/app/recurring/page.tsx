import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, RefreshCw, Lock, Play, Pause } from "lucide-react"
import { formatDate } from "@/lib/utils/invoice"

export default async function RecurringPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check plan
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

  const planCode = userData?.plan?.code || "BASIC"
  const canAccessRecurring = planCode === "PRO"

  if (!canAccessRecurring) {
    return (
      <>
        <PageHeader
          title="Recurring Invoices"
          breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Recurring" }]}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <Card className="max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle>Recurring Invoices</CardTitle>
              <CardDescription>
                Set up automatic monthly invoices for retainer clients. Never forget to bill again. Available on the Pro
                plan.
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

  // Fetch recurring rules
  const { data: rules } = await supabase
    .from("recurring_invoice_rules")
    .select(
      `
      *,
      client:clients(name, email)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <>
      <PageHeader
        title="Recurring Invoices"
        breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Recurring" }]}
      >
        <Link href="/app/recurring/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Rule
          </Button>
        </Link>
      </PageHeader>
      <div className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Recurring Rules</CardTitle>
            <CardDescription>Automatically generate invoices on a schedule</CardDescription>
          </CardHeader>
          <CardContent>
            {rules && rules.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Auto-Send</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.client?.name || "Unknown"}</TableCell>
                      <TableCell>{rule.frequency}</TableCell>
                      <TableCell>Day {rule.day_of_month}</TableCell>
                      <TableCell>
                        <Badge variant={rule.auto_send ? "default" : "outline"}>{rule.auto_send ? "Yes" : "No"}</Badge>
                      </TableCell>
                      <TableCell>{rule.next_run_date ? formatDate(rule.next_run_date) : "—"}</TableCell>
                      <TableCell>
                        <Badge variant={rule.is_active ? "default" : "secondary"}>
                          {rule.is_active ? (
                            <>
                              <Play className="mr-1 h-3 w-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <Pause className="mr-1 h-3 w-3" />
                              Paused
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/app/recurring/${rule.id}`}>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <RefreshCw className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">No recurring rules</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set up automatic monthly invoices for your clients.
                </p>
                <Link href="/app/recurring/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Rule
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
