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
  return (
    <header className="sticky top-0 z-30 relative flex min-h-14 shrink-0 flex-wrap items-center gap-2 border-b border-border bg-background/95 px-4 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 md:min-h-16">
      {/* Mobile: brand logo, top-left */}
      <Link href="/app" className="-ml-0.5 flex shrink-0 items-center md:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
          <FileText className="h-4 w-4 text-primary-foreground" />
        </div>
      </Link>
      {/* Desktop: classic collapsible-sidebar trigger */}
      <SidebarTrigger className="-ml-1 hidden md:flex" />
      <Separator orientation="vertical" className="mr-2 hidden h-4 md:block" />
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb className="min-w-0 pr-12 md:pr-0">
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
        <h1 className="truncate pr-12 text-lg font-semibold md:pr-0">{title}</h1>
      )}
      {children && (
        <div className="ml-auto flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">{children}</div>
      )}
      {/* Mobile: avatar pinned to the top-right; opens account actions (edit profile, sign out, ...) */}
      <ProfileMenu className="absolute right-3 top-1/2 flex -translate-y-1/2 md:hidden" />
    </header>
  )
}
