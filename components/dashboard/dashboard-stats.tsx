"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, DollarSign, Clock, Users } from "lucide-react"
import { formatCurrency } from "@/lib/utils/invoice"
import { getDashboardStats, type DashboardStats as Stats } from "@/app/actions/dashboard"
import type { DateFilter } from "./dashboard-client"

interface DashboardStatsProps {
  currency: string
  filter: DateFilter
}

export function DashboardStats({ currency, filter }: DashboardStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)

      try {
        const result = await getDashboardStats(currency, filter)
        setStats(result)
      } catch (err: any) {
        console.error("[v0] Error fetching dashboard stats:", err)
        // Set zero values on error instead of showing error UI
        setStats({
          totalInvoices: 0,
          totalClients: 0,
          totalReceived: 0,
          totalPending: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [filter, currency])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="mt-1 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Always show stats (with zero values if necessary)
  if (!stats) {
    return null
  }

  const cards = [
    {
      title: "Total Invoices",
      value: stats.totalInvoices,
      icon: FileText,
      description: "All invoices",
      format: (val: number) => val.toLocaleString(),
    },
    {
      title: "Total Received",
      value: stats.totalReceived,
      icon: DollarSign,
      description: "Paid invoices",
      format: (val: number) => formatCurrency(val, currency),
    },
    {
      title: "Total Pending",
      value: stats.totalPending,
      icon: Clock,
      description: "Awaiting payment",
      format: (val: number) => formatCurrency(val, currency),
    },
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      description: "Active clients",
      format: (val: number) => val.toLocaleString(),
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm">{card.title}</CardTitle>
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-lg font-bold sm:text-2xl">{card.format(card.value)}</div>
              <p className="truncate text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
