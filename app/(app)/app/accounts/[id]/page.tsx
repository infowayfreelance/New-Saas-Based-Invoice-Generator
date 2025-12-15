import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { EditAccountForm } from "@/components/accounts/edit-account-form"

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export default async function EditAccountPage({ params }: { params: { id: string } }) {
  if (!isValidUUID(params.id)) {
    redirect("/app/accounts")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: userData } = await supabase.from("users").select(`*, plan:plans(*)`).eq("id", user.id).maybeSingle()

  const planCode = userData?.plan?.code || "GUEST"

  if (planCode !== "PRO") {
    redirect("/app/accounts")
  }

  const { data: account } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!account) {
    notFound()
  }

  return (
    <>
      <PageHeader
        title="Edit Bank Account"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Accounts", href: "/app/accounts" },
          { label: "Edit" },
        ]}
      />
      <div className="p-6">
        <EditAccountForm account={account} />
      </div>
    </>
  )
}
