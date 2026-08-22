import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AccountsList } from "@/components/accounts/accounts-list"
import { Plus, Lock, Building2 } from "lucide-react"

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
        <PageHeader title="Bank Details" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Bank Details" }]} />
        <div className="flex-1 p-4 md:p-6">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Bank Details is a Pro feature</p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Pro to add bank account details and have them appear automatically on your invoices.
                </p>
              </div>
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
      <PageHeader title="Bank Details" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Bank Details" }]}>
        <Link href="/app/accounts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Bank Account
          </Button>
        </Link>
      </PageHeader>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {accounts && accounts.length > 0 ? (
          <AccountsList accounts={accounts} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No bank accounts yet</CardTitle>
              <CardDescription>
                Add a bank account so its details automatically appear on the invoices you create.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/app/accounts/new">
                <Button>
                  <Building2 className="mr-2 h-4 w-4" />
                  Add your first bank account
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
