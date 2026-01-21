"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/app/actions/stripe"
import { createPayPalSubscription } from "@/app/actions/paypal"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
      // Use PayPal for Basic plan, Stripe for others
      if (planSlug === "basic") {
        console.log("[v0] Creating PayPal subscription for Basic plan")
        const { approvalUrl } = await createPayPalSubscription(planSlug)
        console.log("[v0] PayPal approval URL received:", approvalUrl)
        // Redirect to PayPal for approval
        window.location.href = approvalUrl
      } else {
        // Use Stripe for Standard and Pro plans
        await createCheckoutSession(planSlug)
      }
    } catch (error: any) {
      if (error?.message?.includes("NEXT_REDIRECT")) {
        throw error
      }
      console.error("[v0] Checkout error:", error)
      toast.error(error?.message || "Failed to start checkout. Please try again.")
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
