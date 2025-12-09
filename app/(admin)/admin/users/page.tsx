import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: users } = await supabase
    .from("users")
    .select(
      `
      *,
      plan:plans(name, code)
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
            <Link href="/admin/users" className="text-sm font-medium">
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
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage all platform users</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({users?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>
                      {u.first_name || u.last_name ? `${u.first_name || ""} ${u.last_name || ""}`.trim() : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          u.plan?.code === "PRO" ? "default" : u.plan?.code === "STANDARD" ? "secondary" : "outline"
                        }
                      >
                        {u.plan?.name || "None"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.role === "admin" ? "destructive" : "outline"}>{u.role || "user"}</Badge>
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
      </main>
    </div>
  )
}
