import React from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ProfileMenu } from "@/components/app/profile-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface PageHeaderProps {
  title: string
  breadcrumbs?: { label: string; href?: string }[]
  children?: React.ReactNode
}

export function PageHeader({ title, breadcrumbs, children }: PageHeaderProps) {
  // The dashboard is the app's home screen - the brand name already identifies
  // it, so showing the redundant "Dashboard" label next to the logo is skipped.
  const showMobileContext = !(title === "Dashboard" && (!breadcrumbs || breadcrumbs.length === 0))

  return (
    <header className="sticky top-0 z-30 flex min-h-14 shrink-0 flex-col gap-1 border-b border-border bg-background/95 px-4 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 md:min-h-16 md:flex-row md:flex-wrap md:items-center md:gap-2">
      <div className="relative flex items-center gap-2">
        {/* Mobile: persistent brand identity, top-left */}
        <Link href="/app" className="-ml-0.5 flex shrink-0 items-center gap-2 md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight">Make Invo</span>
        </Link>
        {/* Desktop: classic collapsible-sidebar trigger (brand lives in the sidebar) */}
        <SidebarTrigger className="-ml-1 hidden md:flex" />
        <Separator orientation="vertical" className="mr-2 hidden h-4 md:block" />
        {/* Desktop breadcrumbs/title sit inline with the trigger */}
        <div className="hidden min-w-0 md:block">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="flex-nowrap">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {index < breadcrumbs.length - 1 ? (
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          ) : (
            <h1 className="truncate text-lg font-semibold">{title}</h1>
          )}
        </div>
        {/* Mobile: avatar pinned to the top-right; opens account actions (edit profile, sign out, ...) */}
        <ProfileMenu className="absolute right-0 top-1/2 flex -translate-y-1/2 md:hidden" />
      </div>

      {/* Mobile: compact context line for the current page (skipped on the dashboard) */}
      {showMobileContext && (
        <p className="truncate pr-12 text-sm text-muted-foreground md:hidden">
          {breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : title}
        </p>
      )}

      {children && (
        <div className="flex w-full flex-wrap items-center justify-end gap-2 md:ml-auto md:w-auto">{children}</div>
      )}
    </header>
  )
}
