import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AdminHeader } from "@/components/admin/admin-header"
import { UserManagementForm } from "@/components/admin/user-management-form"

async function updateUserRole(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const userId = formData.get("userId") as string
  const role = formData.get("role") as string

  await supabase.from("users").update({ role }).eq("id", userId)
  redirect(`/admin/users/${userId}`)
}

async function updateUserPlan(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const userId = formData.get("userId") as string
  const planId = formData.get("planId") as string

  await supabase.from("users").update({ plan_id: planId }).eq("id", userId)
  redirect(`/admin/users/${userId}`)
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: user } = await supabase
    .from("users")
    .select(
      `
      *,
      plan:plans(*)
    `,
    )
    .eq("id", id)
    .single()

  const { data: plans } = await supabase.from("plans").select("*").order("price_monthly", { ascending: true })

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false })

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, client:clients(name)")
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (!user) {
    redirect("/admin/users")
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <AdminHeader title="User Details" description={user.email} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">User Details</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{user.name || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">User ID</Label>
                <p className="font-mono text-xs">{user.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Created</Label>
                <p>{new Date(user.created_at).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Current Plan</Label>
                <div className="mt-1">
                  <Badge
                    variant={
                      user.plan?.code === "PRO" ? "default" : user.plan?.code === "STANDARD" ? "secondary" : "outline"
                    }
                  >
                    {user.plan?.name || "Guest"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <UserManagementForm
            userId={user.id}
            currentRole={user.role || "USER"}
            currentPlanId={user.plan_id || ""}
            plans={plans || []}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Clients ({clients?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients?.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.company_name || "-"}</TableCell>
                    <TableCell>{client.email || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(client.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {!clients?.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No clients
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices ({invoices?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices?.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.client?.name || invoice.client_name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status?.toLowerCase() === "paid" ? "default" : "outline"}>{invoice.status}</Badge>
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
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No invoices
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
