import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let userData
  let hasDbError = false

  try {
    // Fetch user with plan
    const { data, error } = await supabase
      .from("users")
      .select(
        `
      *,
      plan:plans(*)
    `,
      )
      .eq("id", user.id)
      .single()

    if (error) throw error
    userData = data
  } catch (error: any) {
    if (error?.code === "42P01" || error?.code === "PGRST204" || error?.message?.includes("does not exist")) {
      hasDbError = true
    } else {
      throw error
    }
  }

  // If database is not set up, show setup instructions
  if (hasDbError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Database Setup Required
            </CardTitle>
            <CardDescription>The database tables haven't been created yet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Setup Instructions</AlertTitle>
              <AlertDescription>
                Run these SQL scripts in your Supabase SQL Editor in order:
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                  <li>
                    <code className="rounded bg-muted px-1">scripts/001_create_tables.sql</code>
                  </li>
                  <li>
                    <code className="rounded bg-muted px-1">scripts/002_enable_rls.sql</code>
                  </li>
                  <li>
                    <code className="rounded bg-muted px-1">scripts/003_seed_data.sql</code>
                  </li>
                  <li>
                    <code className="rounded bg-muted px-1">scripts/004_create_user_trigger.sql</code>
                  </li>
                  <li>
                    <code className="rounded bg-muted px-1">scripts/005_fix_default_plan.sql</code>
                  </li>
                  <li>
                    <code className="rounded bg-muted px-1">scripts/014_create_dashboard_views.sql</code>
                  </li>
                  <li>
                    <code className="rounded bg-muted px-1">scripts/015_create_invoice_workflow_views.sql</code>
                  </li>
                  <li>
                    <code className="rounded bg-muted px-1">scripts/016_create_fx_tables.sql</code>
                  </li>
                  <li>
                    <code className="rounded bg-muted px-1">scripts/017_add_fx_fields_to_payments.sql</code>
                  </li>
                </ol>
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">After running all scripts, refresh this page to continue.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <DashboardClient userData={userData} />
}
