"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const PRICE_IDS = {
  basic: process.env.STRIPE_PRICE_ID_BASIC || "",
  standard: process.env.STRIPE_PRICE_ID_STANDARD || "",
  pro: process.env.STRIPE_PRICE_ID_PRO || "",
}

export async function createCheckoutSession(planSlug: "basic" | "standard" | "pro") {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/pricing`)
  }

  const priceId = PRICE_IDS[planSlug]
  if (!priceId) {
    throw new Error(
      `Stripe price ID not configured for plan: ${planSlug}. Please add STRIPE_PRICE_ID_${planSlug.toUpperCase()} to your environment variables.`,
    )
  }

  // Get or create Stripe customer
  const { data: profile } = await supabase.from("users").select("stripe_customer_id, email").eq("id", user.id).single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const { getStripe } = await import("@/lib/stripe")
    const stripe = getStripe()

    const customer = await stripe.customers.create({
      email: user.email || profile?.email,
      metadata: {
        supabase_user_id: user.id,
      },
    })
    customerId = customer.id

    // Save customer ID to user profile
    await supabase.from("users").update({ stripe_customer_id: customerId }).eq("id", user.id)
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const { getStripe } = await import("@/lib/stripe")
  const stripe = getStripe()

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/billing/cancel`,
    metadata: {
      user_id: user.id,
      plan_slug: planSlug,
    },
  })

  if (session.url) {
    redirect(session.url)
  }

  throw new Error("Failed to create checkout session")
}

export async function createCustomerPortalSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("users").select("stripe_customer_id").eq("id", user.id).single()

  if (!profile?.stripe_customer_id) {
    throw new Error("No subscription found")
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const { getStripe } = await import("@/lib/stripe")
  const stripe = getStripe()

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${baseUrl}/app/subscription`,
  })

  redirect(session.url)
}
