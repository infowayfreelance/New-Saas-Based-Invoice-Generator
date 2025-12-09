"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  RefreshCw,
  Settings,
  Palette,
  LogOut,
  ChevronUp,
  Sparkles,
} from "lucide-react"
import type { UserWithPlan } from "@/lib/types"

interface AppSidebarProps {
  user: UserWithPlan | null
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const planCode = user?.plan?.code || "BASIC"
  const canAccessClients = planCode === "STANDARD" || planCode === "PRO"
  const canAccessAccounts = planCode === "PRO"
  const canAccessRecurring = planCode === "PRO"
  const canAccessAnalytics = planCode === "STANDARD" || planCode === "PRO"

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const mainNav = [
    {
      title: "Dashboard",
      href: "/app",
      icon: LayoutDashboard,
      active: pathname === "/app",
    },
    {
      title: "Invoices",
      href: "/app/invoices",
      icon: FileText,
      active: pathname.startsWith("/app/invoices"),
    },
  ]

  const managementNav = [
    {
      title: "Clients",
      href: "/app/clients",
      icon: Users,
      active: pathname.startsWith("/app/clients"),
      locked: !canAccessClients,
      minPlan: "Standard",
    },
    {
      title: "Recurring",
      href: "/app/recurring",
      icon: RefreshCw,
      active: pathname.startsWith("/app/recurring"),
      locked: !canAccessRecurring,
      minPlan: "Pro",
    },
    {
      title: "Accounts",
      href: "/app/accounts",
      icon: CreditCard,
      active: pathname.startsWith("/app/accounts"),
      locked: !canAccessAccounts,
      minPlan: "Pro",
    },
    {
      title: "Analytics",
      href: "/app/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/app/analytics"),
      locked: !canAccessAnalytics,
      minPlan: "Standard",
    },
  ]

  const settingsNav = [
    {
      title: "Templates",
      href: "/app/templates",
      icon: Palette,
      active: pathname.startsWith("/app/templates"),
    },
    {
      title: "Subscription",
      href: "/app/subscription",
      icon: CreditCard,
      active: pathname === "/app/subscription",
    },
    {
      title: "Settings",
      href: "/app/settings",
      icon: Settings,
      active: pathname.startsWith("/app/settings"),
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/app" className="flex items-center gap-2 px-2 py-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">InvoiceFlow</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.active} disabled={item.locked}>
                    {item.locked ? (
                      <div className="flex w-full items-center justify-between opacity-50">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {item.minPlan}
                        </Badge>
                      </div>
                    ) : (
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col items-start text-sm">
                    <span className="font-medium">{user?.name || "User"}</span>
                    <span className="text-xs text-muted-foreground">{user?.plan?.name || "Basic"} Plan</span>
                  </div>
                  <ChevronUp className="h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/app/settings/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/app/subscription">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
