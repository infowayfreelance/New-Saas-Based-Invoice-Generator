import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { TableCell } from "@/components/ui/table"
import { TableBody } from "@/components/ui/table"
import { TableHead } from "@/components/ui/table"
import { TableRow } from "@/components/ui/table"
import { TableHeader } from "@/components/ui/table"
import { Table } from "@/components/ui/table"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ClientsList } from "@/components/clients/clients-list"
import { Plus, Search, Users, Lock, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const params = await searchParams
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
  const canAccessClients = planCode === "STANDARD" || planCode === "PRO"

  if (!canAccessClients) {
    return (
      <>
        <PageHeader title="Clients" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Clients" }]} />
        <div className="flex flex-1 items-center justify-center p-6">
          <Card className="max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>
                Save and manage your clients with the Standard or Pro plan. Store client details and quickly create
                invoices for returning customers.
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

  // Fetch clients
  let query = supabase.from("clients").select("*").eq("user_id", user.id).order("created_at", { ascending: false })

  if (params.search) {
    query = query.or(
      `name.ilike.%${params.search}%,email.ilike.%${params.search}%,company_name.ilike.%${params.search}%`,
    )
  }

  const { data: clients } = await query.limit(50)

  // Get invoice count per client
  const clientIds = clients?.map((c) => c.id) || []
  const { data: invoiceCounts } = await supabase
    .from("invoices")
    .select("client_id")
    .in("client_id", clientIds.length > 0 ? clientIds : ["none"])

  const invoiceCountMap: Record<string, number> = {}
  invoiceCounts?.forEach((inv) => {
    if (inv.client_id) {
      invoiceCountMap[inv.client_id] = (invoiceCountMap[inv.client_id] || 0) + 1
    }
  })

  return (
    <>
      <PageHeader title="Clients" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Clients" }]}>
        <Link href="/app/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </PageHeader>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <form className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search clients..."
                  defaultValue={params.search || ""}
                  className="pl-9"
                />
              </div>
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
            <CardDescription>{clients?.length || 0} clients found</CardDescription>
          </CardHeader>
          <CardContent>
            {clients && clients.length > 0 ? (
              <ClientsList clients={clients} invoiceCountMap={invoiceCountMap} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">No clients yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {params.search ? "Try adjusting your search" : "Add your first client to get started."}
                </p>
                <Link href="/app/clients/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
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
