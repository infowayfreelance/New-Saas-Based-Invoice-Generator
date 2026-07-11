"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/app/auth-provider"
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
  LayoutDashboard,
  FileText,
  Users,
  RefreshCw,
  CreditCard,
  BarChart3,
  Palette,
  SettingsIcon,
  Sparkles,
  LogOut,
  ChevronUp,
  Mail,
} from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()
  const { profile: user, signOut } = useAuth()

  const planCode = user?.plan?.code || "BASIC"
  const canAccessClients = planCode === "STANDARD" || planCode === "PRO"
  const canAccessAccounts = planCode === "PRO"
  const canAccessRecurring = planCode === "PRO"
  const canAccessAnalytics = planCode === "STANDARD" || planCode === "PRO"

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
    // Accounts feature temporarily hidden - bank_accounts table not yet created
    // {
    //   title: "Accounts",
    //   href: "/app/accounts",
    //   icon: CreditCard,
    //   active: pathname.startsWith("/app/accounts"),
    //   locked: !canAccessAccounts,
    //   minPlan: "Pro",
    // },
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
      icon: SettingsIcon,
      active: pathname.startsWith("/app/settings") && !pathname.startsWith("/app/settings/email-setup"),
    },
    {
      title: "Email Setup",
      href: "/app/settings/email-setup",
      icon: Mail,
      active: pathname.startsWith("/app/settings/email-setup"),
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/app" className="flex items-center px-2 py-1.5">
              <Image
                src="/Make-invo-logo.webp"
                alt="MakeInvo"
                width={821}
                height={273}
                className="h-7 w-auto"
              />
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
                      {item.icon && <item.icon className="h-4 w-4" />}
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
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span>{item.title}</span>
                        </div>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {item.minPlan}
                        </Badge>
                      </div>
                    ) : (
                      <Link href={item.href}>
                        {item.icon && <item.icon className="h-4 w-4" />}
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
                      {item.icon && <item.icon className="h-4 w-4" />}
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
                    <SettingsIcon className="mr-2 h-4 w-4" />
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
                <DropdownMenuItem onClick={signOut}>
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
