"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, DollarSign, Clock, Users, AlertCircle } from "lucide-react"
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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getDashboardStats(currency, filter)

        if ("error" in result) {
          setError(result.error)
          setStats(null)
        } else {
          setStats(result)
        }
      } catch (err: any) {
        console.error("[v0] Error fetching dashboard stats:", err)
        setError("Failed to load dashboard statistics")
        setStats(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [filter, currency])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!stats) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No data available</AlertDescription>
      </Alert>
    )
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.format(card.value)}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
