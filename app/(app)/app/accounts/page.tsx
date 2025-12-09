import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Lock, Building2, Wallet } from "lucide-react"

export default async function AccountsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select(`*, plan:plans(*)`).eq("id", user.id).single()

  const planCode = userData?.plan?.code || "BASIC"
  const canAccessAccounts = planCode === "PRO"

  if (!canAccessAccounts) {
    return (
      <>
        <PageHeader title="Bank Accounts" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Accounts" }]} />
        <div className="flex flex-1 items-center justify-center p-6">
          <Card className="max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle>Bank Accounts</CardTitle>
              <CardDescription>
                Manage multiple bank accounts for different clients or regions. Track where payments should go.
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

  const { data: accounts } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })

  return (
    <>
      <PageHeader title="Bank Accounts" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Accounts" }]}>
        <Link href="/app/accounts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </Link>
      </PageHeader>
      <div className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Bank Accounts</CardTitle>
            <CardDescription>Add payment details to display on invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {accounts && accounts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {accounts.map((account) => (
                  <Card key={account.id} className={account.is_default ? "border-primary" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{account.account_name}</CardTitle>
                            <CardDescription>{account.bank_name}</CardDescription>
                          </div>
                        </div>
                        {account.is_default && <Badge>Default</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account:</span>
                        <span className="font-mono">****{account.account_number?.slice(-4)}</span>
                      </div>
                      {account.routing_number && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Routing:</span>
                          <span className="font-mono">{account.routing_number}</span>
                        </div>
                      )}
                      {account.swift_code && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">SWIFT:</span>
                          <span className="font-mono">{account.swift_code}</span>
                        </div>
                      )}
                      <div className="pt-2">
                        <Link href={`/app/accounts/${account.id}`}>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">No bank accounts</h3>
                <p className="mt-1 text-sm text-muted-foreground">Add your bank details to display on invoices.</p>
                <Link href="/app/accounts/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Account
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
