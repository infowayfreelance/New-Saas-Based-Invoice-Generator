import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { NewAccountForm } from "@/components/accounts/new-account-form"

export default async function NewAccountPage() {
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

  return (
    <>
      <PageHeader
        title="Add Bank Account"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Bank Details", href: "/app/accounts" },
          { label: "New" },
        ]}
      />
      <div className="p-6">
        <NewAccountForm userId={user.id} />
      </div>
    </>
  )
}
