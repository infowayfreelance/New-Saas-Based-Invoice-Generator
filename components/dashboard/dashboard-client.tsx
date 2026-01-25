"use client"

import { useState } from "react"
import { PageHeader } from "@/components/app/page-header"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { InvoiceWorkflow } from "@/components/dashboard/invoice-workflow"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ALL_CURRENCIES } from "@/lib/utils/currency"

interface DashboardClientProps {
  userData: any
}

export type DateFilter = {
  preset: "this-month" | "last-30" | "last-3-months" | "last-6-months" | "last-year" | "custom"
  startDate?: string
  endDate?: string
}

export function DashboardClient({ userData }: DashboardClientProps) {
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    preset: "this-month",
  })

  console.log("[v0] Dashboard client rendering", { userData, selectedCurrency, dateFilter })

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Business overview"
      >
        <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALL_CURRENCIES.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.symbol} {currency.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      <div className="flex-1 space-y-6 p-6">
        {/* Filter Bar */}
        <DashboardFilters filter={dateFilter} onFilterChange={setDateFilter} />

        {/* Stats Cards */}
        <DashboardStats currency={selectedCurrency} filter={dateFilter} />

        {/* Invoice Workflow Section */}
        <InvoiceWorkflow currency={selectedCurrency} filter={dateFilter} />
      </div>
    </>
  )
}
