import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      user:users(email),
      plan:plans(name)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-sm text-muted-foreground hover:text-foreground">
              Users
            </Link>
            <Link href="/admin/invoices" className="text-sm text-muted-foreground hover:text-foreground">
              Invoices
            </Link>
            <Link href="/admin/subscriptions" className="text-sm font-medium">
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

      <main className="container mx-auto space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">Manage all Stripe subscriptions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions ({subscriptions?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Period End</TableHead>
                  <TableHead>Stripe ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions?.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.user?.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{sub.plan?.name || "Unknown"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sub.status === "active" ? "default" : sub.status === "canceled" ? "destructive" : "outline"
                        }
                      >
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {sub.stripe_subscription_id?.slice(0, 20)}...
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
