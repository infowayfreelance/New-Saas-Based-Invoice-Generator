import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { EmailSetupWizard } from "@/components/settings/email-setup-wizard"

export default async function EmailSetupPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <>
      <PageHeader
        title="Email Setup"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Settings", href: "/app/settings" },
          { label: "Email Setup" },
        ]}
      />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <EmailSetupWizard userEmail={user.email || ""} />
      </div>
    </>
  )
}
