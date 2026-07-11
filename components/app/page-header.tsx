import React from "react"
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
  return (
    <header className="sticky top-0 z-30 flex min-h-14 shrink-0 flex-wrap items-center gap-2 border-b border-border bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:min-h-16">
      {/* Mobile: tapping the avatar opens account actions (edit profile, sign out, ...) */}
      <ProfileMenu className="-ml-1 flex md:hidden" />
      {/* Desktop: classic collapsible-sidebar trigger */}
      <SidebarTrigger className="-ml-1 hidden md:flex" />
      <Separator orientation="vertical" className="mr-2 hidden h-4 md:block" />
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {/* On phones, show only the current page to keep the header compact */}
                <BreadcrumbItem className={index < breadcrumbs.length - 1 ? "hidden sm:inline-flex" : ""}>
                  {index < breadcrumbs.length - 1 ? (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden sm:block" />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      ) : (
        <h1 className="truncate text-lg font-semibold">{title}</h1>
      )}
      {children && (
        <div className="ml-auto flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">{children}</div>
      )}
    </header>
  )
}
