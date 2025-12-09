"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCustomerPortalSession } from "@/app/actions/stripe"
import { Loader2, Settings } from "lucide-react"

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await createCustomerPortalSession()
    } catch (error) {
      console.error("Portal error:", error)
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} variant="outline">
      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
      Manage Subscription
    </Button>
  )
}
