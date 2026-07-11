"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
import { LayoutDashboard, FileText, Plus, Users, Menu } from "lucide-react"

const navItems = [
  { title: "Home", href: "/app", icon: LayoutDashboard, match: (p: string) => p === "/app" },
  { title: "Invoices", href: "/app/invoices", icon: FileText, match: (p: string) => p.startsWith("/app/invoices") },
]

const rightNavItems = [
  { title: "Clients", href: "/app/clients", icon: Users, match: (p: string) => p.startsWith("/app/clients") },
]

/**
 * App-style bottom tab bar for mobile/tablet. Hidden on desktop, where the
 * sidebar already provides navigation. The "More" tab opens the same
 * off-canvas sidebar sheet used on mobile, giving access to every page
 * that doesn't fit in the tab bar (Recurring, Analytics, Settings, ...).
 */
export function MobileBottomNav() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
      aria-label="Primary"
    >
      <div className="relative mx-auto grid h-16 max-w-md grid-cols-5 items-stretch">
        {navItems.map((item) => {
          const isActive = item.match(pathname)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-xs ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}

        {/* Center action: create a new invoice, elevated above the bar */}
        <div className="flex items-center justify-center">
          <Link
            href="/app/invoices/new"
            aria-label="New Invoice"
            className="flex h-14 w-14 -translate-y-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background transition-transform active:scale-95"
          >
            <Plus className="h-7 w-7" />
          </Link>
        </div>

        {rightNavItems.map((item) => {
          const isActive = item.match(pathname)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-xs ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}

        <button
          type="button"
          onClick={() => setOpenMobile(true)}
          className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground"
        >
          <Menu className="h-5 w-5" />
          <span>More</span>
        </button>
      </div>
    </nav>
  )
}
