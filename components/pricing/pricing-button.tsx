"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/app/actions/stripe"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface PricingButtonProps {
  planSlug: "basic" | "standard" | "pro"
  children: React.ReactNode
  variant?: "default" | "outline"
}

export function PricingButton({ planSlug, children, variant = "default" }: PricingButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setLoading(true)
    try {
      await createCheckoutSession(planSlug)
    } catch (error: any) {
      if (error?.message?.includes("NEXT_REDIRECT")) {
        throw error
      }
      console.error("Checkout error:", error)
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} variant={variant} className="w-full">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  )
}
