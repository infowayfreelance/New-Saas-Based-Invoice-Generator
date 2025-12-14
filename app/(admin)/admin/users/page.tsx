import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; role?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let query = supabase.from("users").select(
    `
      *,
      plan:plans(name, code)
    `,
  )

  if (params.email) {
    query = query.ilike("email", `%${params.email}%`)
  }

  if (params.role) {
    query = query.eq("role", params.role)
  }

  const { data: users } = await query.order("created_at", { ascending: false })

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <AdminHeader title="Users" description="Manage all platform users" />
      <main className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <form method="get" className="flex gap-4">
              <Input name="email" placeholder="Search by email" defaultValue={params.email} className="max-w-xs" />
              <Select name="role" defaultValue={params.role}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Apply</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/users">Clear</Link>
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({users?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-xs">{u.id.slice(0, 8)}...</TableCell>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>{u.name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === "ADMIN" ? "destructive" : "outline"}>{u.role || "USER"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          u.plan?.code === "PRO" ? "default" : u.plan?.code === "STANDARD" ? "secondary" : "outline"
                        }
                      >
                        {u.plan?.name || "Guest"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/users/${u.id}`}>View</Link>
                      </Button>
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
