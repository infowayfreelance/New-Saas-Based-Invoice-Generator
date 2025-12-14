"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { ReactNode } from "react"

export function SubscriptionUpgradeButton({
  planName,
  children,
}: {
  planName: string
  children: ReactNode
}) {
  const { toast } = useToast()

  const handleUpgrade = () => {
    toast({
      title: "Payments coming soon",
      description: "Please contact admin to upgrade your plan.",
    })
  }

  return (
    <Button onClick={handleUpgrade} className="w-full">
      {children}
    </Button>
  )
}
