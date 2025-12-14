import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/app/sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  let user = null
  let authError = false

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (err) {
    console.error("Error fetching auth user:", err)
    authError = true
  }

  if (!user && !authError) {
    redirect("/login")
  }
  // </CHANGE>

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md space-y-4 rounded-lg border border-red-500 bg-red-50 p-6 dark:bg-red-950">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-500 p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-100">Authentication Error</h2>
              <p className="mb-3 text-sm text-red-800 dark:text-red-200">
                Unable to connect to Supabase. Please check:
              </p>
              <ul className="mb-3 list-inside list-disc space-y-1 text-sm text-red-800 dark:text-red-200">
                <li>Supabase environment variables are set correctly</li>
                <li>Your internet connection is working</li>
                <li>Supabase project is active</li>
              </ul>
              <a
                href="/login"
                className="inline-block rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Try Again
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
  // </CHANGE>

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
      if (error.code === "PGRST116" || error.code === "42P01") {
        dbError = "database_not_setup"
      } else {
        console.error("Error fetching user data:", error)
        dbError = "query_failed"
      }
      // </CHANGE>
    } else {
      userData = data
    }
  } catch (err) {
    console.error("Error fetching user data:", err)
    dbError = "query_failed"
    // </CHANGE>
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
                    scripts/002_rls_policies.sql
                  </code>
                </li>
                <li>
                  <code className="rounded bg-yellow-100 px-1 py-0.5 dark:bg-yellow-900">
                    scripts/003_seed_data.sql
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

  // This allows the app to at least load and show an error state
  if (dbError === "query_failed") {
    console.warn("Rendering app with null user data due to database query failure")
  }
  // </CHANGE>

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
