"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, DollarSign, Clock, Users } from "lucide-react"
import { formatCurrency } from "@/lib/utils/invoice"
import type { DateFilter } from "./dashboard-client"

interface DashboardStatsProps {
  currency: string
  filter: DateFilter
}

interface Stats {
  totalInvoices: number
  totalReceived: number
  totalPending: number
  totalClients: number
}

export function DashboardStats({ currency, filter }: DashboardStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading - in production, fetch real data here
    setIsLoading(true)
    const timer = setTimeout(() => {
      // Placeholder stats - replace with actual API call
      setStats({
        totalInvoices: 0,
        totalReceived: 0,
        totalPending: 0,
        totalClients: 0,
      })
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
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

  const cards = [
    {
      title: "Total Invoices",
      value: stats?.totalInvoices || 0,
      icon: FileText,
      description: "All invoices",
      format: (val: number) => val.toString(),
    },
    {
      title: "Total Received",
      value: stats?.totalReceived || 0,
      icon: DollarSign,
      description: "Paid invoices",
      format: (val: number) => formatCurrency(val, currency),
    },
    {
      title: "Total Pending",
      value: stats?.totalPending || 0,
      icon: Clock,
      description: "Awaiting payment",
      format: (val: number) => formatCurrency(val, currency),
    },
    {
      title: "Total Clients",
      value: stats?.totalClients || 0,
      icon: Users,
      description: "Active clients",
      format: (val: number) => val.toString(),
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
