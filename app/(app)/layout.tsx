import type React from "react"
import type { Metadata } from "next"
import { AppSidebar } from "@/components/app/sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AuthProvider } from "@/components/app/auth-provider"
import { MobileBottomNav } from "@/components/app/mobile-bottom-nav"

// Everything under /app/* and /billing/* is a signed-in user's private
// dashboard - never index it, and don't follow links out of it either.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Bottom padding reserves space for the fixed mobile tab bar */}
          <div className="pb-16 md:pb-0">{children}</div>
        </SidebarInset>
        <MobileBottomNav />
      </SidebarProvider>
    </AuthProvider>
  )
}
