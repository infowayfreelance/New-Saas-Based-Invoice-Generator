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

  // Fetch user data with plan
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

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
