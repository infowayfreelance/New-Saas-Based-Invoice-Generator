import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
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
    <header className="flex min-h-14 shrink-0 flex-wrap items-center gap-2 border-b border-border px-4 py-2 md:min-h-16">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
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
