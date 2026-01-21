"use server"

import { createClient } from "@/lib/supabase/server"
import { paypalRequest } from "@/lib/paypal"
import { redirect } from "next/navigation"

/**
 * PayPal Subscription Response Types
 */
interface PayPalPlanResponse {
  id: string
  product_id: string
  name: string
  status: string
  billing_cycles: Array<{
    frequency: {
      interval_unit: string
      interval_count: number
    }
    tenure_type: string
    sequence: number
    total_cycles: number
    pricing_scheme: {
      fixed_price: {
        value: string
        currency_code: string
      }
    }
  }>
  payment_preferences: {
    auto_bill_outstanding: boolean
    setup_fee_failure_action: string
    payment_failure_threshold: number
  }
  create_time: string
  links: Array<{
    href: string
    rel: string
    method: string
  }>
}

interface PayPalSubscriptionResponse {
  id: string
  status: string
  status_update_time: string
  plan_id: string
  start_time: string
  quantity: string
  subscriber: {
    email_address?: string
    payer_id?: string
    name?: {
      given_name?: string
      surname?: string
    }
  }
  billing_info?: {
    outstanding_balance: {
      currency_code: string
      value: string
    }
    cycle_executions: Array<{
      tenure_type: string
      sequence: number
      cycles_completed: number
      cycles_remaining: number
      current_pricing_scheme_version: number
    }>
    last_payment?: {
      amount: {
        currency_code: string
        value: string
      }
      time: string
    }
    next_billing_time?: string
  }
  create_time: string
  update_time: string
  links: Array<{
    href: string
    rel: string
    method: string
  }>
}

/**
 * Create or get a PayPal billing plan for the given price
 * Plans are created per price point and cached
 */
async function createPayPalBillingPlan(
  planName: string,
  priceMonthly: number,
  planSlug: string,
): Promise<string> {
  const supabase = await createClient()

  // Check if we already have a PayPal plan ID for this plan
  const { data: existingPlan } = await supabase
    .from("plans")
    .select("paypal_plan_id")
    .eq("code", planSlug.toUpperCase())
    .single()

  if (existingPlan?.paypal_plan_id) {
    return existingPlan.paypal_plan_id
  }

  // Create a PayPal product first (required for subscription plans)
  const product = await paypalRequest<{ id: string }>("/v1/catalogs/products", {
    method: "POST",
    body: JSON.stringify({
      name: `${planName} Subscription`,
      description: `Monthly subscription for ${planName} plan`,
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  })

  // Create the billing plan
  const plan = await paypalRequest<PayPalPlanResponse>("/v1/billing/plans", {
    method: "POST",
    body: JSON.stringify({
      product_id: product.id,
      name: `${planName} - Monthly`,
      description: `Monthly subscription for ${planName} plan`,
      billing_cycles: [
        {
          frequency: {
            interval_unit: "MONTH",
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // 0 = infinite
          pricing_scheme: {
            fixed_price: {
              value: priceMonthly.toFixed(2),
              currency_code: "USD",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    }),
  })

  // Save the PayPal plan ID to our database for future use
  await supabase
    .from("plans")
    .update({ paypal_plan_id: plan.id })
    .eq("code", planSlug.toUpperCase())

  return plan.id
}

/**
 * Create a PayPal subscription for a user
 * Returns the approval URL for the user to complete the payment
 */
export async function createPayPalSubscription(
  planSlug: "basic" | "standard" | "pro",
): Promise<{ approvalUrl: string }> {
  const supabase = await createClient()
  
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/pricing`)
  }

  // Get the plan details
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("id, name, code, price_monthly")
    .eq("code", planSlug.toUpperCase())
    .single()

  if (planError || !plan) {
    throw new Error(`Plan not found: ${planSlug}`)
  }

  // Get or create PayPal billing plan ID
  const paypalPlanId = await createPayPalBillingPlan(
    plan.name,
    Number(plan.price_monthly),
    planSlug,
  )

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // Create the subscription
  const subscription = await paypalRequest<PayPalSubscriptionResponse>(
    "/v1/billing/subscriptions",
    {
      method: "POST",
      body: JSON.stringify({
        plan_id: paypalPlanId,
        start_time: new Date(Date.now() + 60000).toISOString(), // Start 1 minute from now
        subscriber: {
          email_address: user.email,
        },
        application_context: {
          brand_name: "Invoice Generator",
          locale: "en-US",
          shipping_preference: "NO_SHIPPING",
          user_action: "SUBSCRIBE_NOW",
          payment_method: {
            payer_selected: "PAYPAL",
            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
          },
          return_url: `${baseUrl}/billing/paypal/success?subscription_id=\${subscription_id}`,
          cancel_url: `${baseUrl}/billing/cancel`,
        },
        custom_id: user.id, // Store user ID for webhook processing
      }),
    },
  )

  // Insert subscription record with pending status
  // It will be activated via webhook when user completes payment
  const { error: subError } = await supabase.from("subscriptions").insert({
    user_id: user.id,
    provider: "PAYPAL",
    provider_subscription_id: subscription.id,
    status: "INACTIVE", // Will be updated to ACTIVE via webhook
    current_plan_id: plan.id,
  })

  if (subError) {
    console.error("[v0] Failed to create subscription record:", subError)
    throw new Error("Failed to create subscription record")
  }

  // Find the approval URL from the links
  const approvalLink = subscription.links.find((link) => link.rel === "approve")

  if (!approvalLink) {
    throw new Error("PayPal approval URL not found in response")
  }

  return {
    approvalUrl: approvalLink.href,
  }
}

/**
 * Get PayPal subscription details
 */
export async function getPayPalSubscription(
  subscriptionId: string,
): Promise<PayPalSubscriptionResponse> {
  return paypalRequest<PayPalSubscriptionResponse>(
    `/v1/billing/subscriptions/${subscriptionId}`,
  )
}

/**
 * Cancel a PayPal subscription
 */
export async function cancelPayPalSubscription(
  subscriptionId: string,
  reason?: string,
): Promise<void> {
  await paypalRequest(`/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    body: JSON.stringify({
      reason: reason || "Customer requested cancellation",
    }),
  })

  // Update our database
  const supabase = await createClient()
  await supabase
    .from("subscriptions")
    .update({ status: "CANCELED" })
    .eq("provider_subscription_id", subscriptionId)
}
