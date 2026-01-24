import type React from "react"
import { AppSidebar } from "@/components/app/sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AuthProvider } from "@/components/app/auth-provider"
import { CurrencyProvider } from "@/components/app/currency-provider"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </CurrencyProvider>
    </AuthProvider>
  )
}
