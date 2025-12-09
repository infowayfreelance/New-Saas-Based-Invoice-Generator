"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/app/actions/stripe"
import { Loader2 } from "lucide-react"

interface CheckoutButtonProps {
  planSlug: "basic" | "standard" | "pro"
  children: React.ReactNode
  variant?: "default" | "outline"
  className?: string
}

export function CheckoutButton({ planSlug, children, variant = "default", className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await createCheckoutSession(planSlug)
    } catch (error) {
      console.error("Checkout error:", error)
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} variant={variant} className={className}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
      {children}
    </Button>
  )
}
