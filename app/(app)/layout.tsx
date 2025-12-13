import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/app/sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let userData = null
  let dbError = null

  try {
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

    if (error) {
      // Check if error is due to missing table
      if (error.code === "PGRST205") {
        dbError = "database_not_setup"
      } else {
        console.error("Error fetching user data:", error)
      }
    } else {
      userData = data
    }
  } catch (err) {
    console.error("Error querying database:", err)
  }

  // If database isn't set up, show a setup message
  if (dbError === "database_not_setup") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md space-y-4 rounded-lg border border-yellow-500 bg-yellow-50 p-6 dark:bg-yellow-950">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-yellow-500 p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-lg font-semibold text-yellow-900 dark:text-yellow-100">
                Database Setup Required
              </h2>
              <p className="mb-3 text-sm text-yellow-800 dark:text-yellow-200">
                The database tables haven't been created yet. Please run the SQL migration scripts in order:
              </p>
              <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                <li>
                  <code className="rounded bg-yellow-100 px-1 py-0.5 dark:bg-yellow-900">
                    scripts/001_create_tables.sql
                  </code>
                </li>
                <li>
                  <code className="rounded bg-yellow-100 px-1 py-0.5 dark:bg-yellow-900">
                    scripts/002_enable_rls.sql
                  </code>
                </li>
                <li>
                  <code className="rounded bg-yellow-100 px-1 py-0.5 dark:bg-yellow-900">
                    scripts/003_seed_data.sql
                  </code>
                </li>
                <li>
                  <code className="rounded bg-yellow-100 px-1 py-0.5 dark:bg-yellow-900">
                    scripts/004_create_user_trigger.sql
                  </code>
                </li>
              </ol>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                After running these scripts, refresh this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  // </CHANGE>

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
