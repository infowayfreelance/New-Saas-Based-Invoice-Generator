"use client"

import { useState } from "react"
import { PageHeader } from "@/components/app/page-header"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { InvoiceWorkflow } from "@/components/dashboard/invoice-workflow"
import { useCurrencyOrDefault } from "@/components/app/currency-provider"

interface DashboardClientProps {
  userData: any
}

export type DateFilter = {
  preset: "this-month" | "last-30" | "last-3-months" | "last-6-months" | "last-year" | "custom"
  startDate?: string
  endDate?: string
}

export function DashboardClient({ userData }: DashboardClientProps) {
  const { defaultCurrency } = useCurrencyOrDefault()
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    preset: "this-month",
  })

  return (
    <>
      <PageHeader title="Dashboard" />

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Filter Bar */}
        <DashboardFilters filter={dateFilter} onFilterChange={setDateFilter} />

        {/* Stats Cards */}
        <DashboardStats currency={defaultCurrency} filter={dateFilter} />

        {/* Invoice Workflow Section */}
        <InvoiceWorkflow currency={defaultCurrency} filter={dateFilter} />
      </div>
    </>
  )
}
