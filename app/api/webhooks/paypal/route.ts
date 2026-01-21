export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { getPayPalConfig } from "@/lib/paypal"
import crypto from "crypto"

/**
 * PayPal Webhook Event Types
 */
interface PayPalWebhookEvent {
  id: string
  event_type: string
  resource: {
    id: string
    status?: string
    billing_agreement_id?: string
    subscription_id?: string
  }
  [key: string]: unknown
}

/**
 * Verify PayPal webhook signature
 * Based on PayPal's webhook signature verification algorithm
 */
async function verifyPayPalSignature(
  req: Request,
  body: string
): Promise<boolean> {
  const { headers } = await import("next/headers")
  const headersList = await headers()

  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) {
    console.error("[v0] PAYPAL_WEBHOOK_ID is not configured")
    return false
  }

  // Get PayPal signature headers
  const transmissionId = headersList.get("paypal-transmission-id")
  const transmissionTime = headersList.get("paypal-transmission-time")
  const certUrl = headersList.get("paypal-cert-url")
  const transmissionSig = headersList.get("paypal-transmission-sig")
  const authAlgo = headersList.get("paypal-auth-algo")

  if (!transmissionId || !transmissionTime || !certUrl || !transmissionSig || !authAlgo) {
    console.error("[v0] Missing PayPal webhook signature headers")
    return false
  }

  try {
    // Construct the expected signature string
    const expectedSig = `${transmissionId}|${transmissionTime}|${webhookId}|${crypto
      .createHash("sha256")
      .update(body)
      .digest("base64")}`

    // Fetch the PayPal certificate
    const certResponse = await fetch(certUrl)
    if (!certResponse.ok) {
      console.error("[v0] Failed to fetch PayPal certificate")
      return false
    }
    const cert = await certResponse.text()

    // Verify signature using the certificate
    const verifier = crypto.createVerify(authAlgo)
    verifier.update(expectedSig)
    const isValid = verifier.verify(cert, transmissionSig, "base64")

    return isValid
  } catch (error) {
    console.error("[v0] PayPal signature verification error:", error)
    return false
  }
}

/**
 * Handle BILLING.SUBSCRIPTION.ACTIVATED event
 */
async function handleSubscriptionActivated(event: PayPalWebhookEvent) {
  const supabase = createServiceClient()
  const subscriptionId = event.resource.id

  console.log(`[v0] Processing BILLING.SUBSCRIPTION.ACTIVATED for: ${subscriptionId}`)

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "ACTIVE",
      updated_at: new Date().toISOString(),
    })
    .eq("provider_subscription_id", subscriptionId)
    .eq("payment_provider", "paypal")

  if (error) {
    console.error("[v0] Error updating subscription status:", error)
    throw error
  }
}

/**
 * Handle BILLING.SUBSCRIPTION.CANCELLED event
 */
async function handleSubscriptionCancelled(event: PayPalWebhookEvent) {
  const supabase = createServiceClient()
  const subscriptionId = event.resource.id

  console.log(`[v0] Processing BILLING.SUBSCRIPTION.CANCELLED for: ${subscriptionId}`)

  // Get the subscription to find the user
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("provider_subscription_id", subscriptionId)
    .eq("payment_provider", "paypal")
    .single()

  if (!subscription) {
    console.warn(`[v0] Subscription not found: ${subscriptionId}`)
    return
  }

  // Update subscription status to cancelled
  const { error: subError } = await supabase
    .from("subscriptions")
    .update({
      status: "CANCELED",
      updated_at: new Date().toISOString(),
    })
    .eq("provider_subscription_id", subscriptionId)
    .eq("payment_provider", "paypal")

  if (subError) {
    console.error("[v0] Error updating subscription status:", subError)
    throw subError
  }

  // Downgrade user to GUEST plan
  const { data: guestPlan } = await supabase
    .from("plans")
    .select("id")
    .eq("code", "GUEST")
    .single()

  if (guestPlan) {
    const { error: userError } = await supabase
      .from("users")
      .update({ plan_id: guestPlan.id })
      .eq("id", subscription.user_id)

    if (userError) {
      console.error("[v0] Error downgrading user plan:", userError)
    }
  }
}

/**
 * Handle PAYMENT.SALE.COMPLETED event
 * This event is triggered when a subscription payment is successfully processed
 */
async function handlePaymentCompleted(event: PayPalWebhookEvent) {
  const supabase = createServiceClient()
  
  // PayPal sends billing_agreement_id for subscription payments
  const billingAgreementId = event.resource.billing_agreement_id
  
  if (!billingAgreementId) {
    console.log("[v0] Payment not related to subscription, skipping")
    return
  }

  console.log(`[v0] Processing PAYMENT.SALE.COMPLETED for subscription: ${billingAgreementId}`)

  // Update subscription to ensure it's active
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "ACTIVE",
      updated_at: new Date().toISOString(),
    })
    .eq("provider_subscription_id", billingAgreementId)
    .eq("payment_provider", "paypal")

  if (error) {
    console.error("[v0] Error updating subscription after payment:", error)
    throw error
  }

  console.log(`[v0] Subscription payment recorded for: ${billingAgreementId}`)
}

/**
 * Handle BILLING.SUBSCRIPTION.SUSPENDED event
 */
async function handleSubscriptionSuspended(event: PayPalWebhookEvent) {
  const supabase = createServiceClient()
  const subscriptionId = event.resource.id

  console.log(`[v0] Processing BILLING.SUBSCRIPTION.SUSPENDED for: ${subscriptionId}`)

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "PAST_DUE",
      updated_at: new Date().toISOString(),
    })
    .eq("provider_subscription_id", subscriptionId)
    .eq("payment_provider", "paypal")

  if (error) {
    console.error("[v0] Error updating subscription status:", error)
    throw error
  }
}

/**
 * Handle BILLING.SUBSCRIPTION.EXPIRED event
 */
async function handleSubscriptionExpired(event: PayPalWebhookEvent) {
  const supabase = createServiceClient()
  const subscriptionId = event.resource.id

  console.log(`[v0] Processing BILLING.SUBSCRIPTION.EXPIRED for: ${subscriptionId}`)

  // Get the subscription to find the user
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("provider_subscription_id", subscriptionId)
    .eq("payment_provider", "paypal")
    .single()

  if (!subscription) {
    console.warn(`[v0] Subscription not found: ${subscriptionId}`)
    return
  }

  // Update subscription status
  const { error: subError } = await supabase
    .from("subscriptions")
    .update({
      status: "EXPIRED",
      updated_at: new Date().toISOString(),
    })
    .eq("provider_subscription_id", subscriptionId)
    .eq("payment_provider", "paypal")

  if (subError) {
    console.error("[v0] Error updating subscription status:", subError)
    throw subError
  }

  // Downgrade user to GUEST plan
  const { data: guestPlan } = await supabase
    .from("plans")
    .select("id")
    .eq("code", "GUEST")
    .single()

  if (guestPlan) {
    const { error: userError } = await supabase
      .from("users")
      .update({ plan_id: guestPlan.id })
      .eq("id", subscription.user_id)

    if (userError) {
      console.error("[v0] Error downgrading user plan:", userError)
    }
  }
}

/**
 * POST handler for PayPal webhooks
 */
export async function POST(req: Request) {
  try {
    // Read the raw body for signature verification
    const body = await req.text()

    // Verify webhook signature
    const isValid = await verifyPayPalSignature(req, body)
    
    if (!isValid) {
      console.error("[v0] PayPal webhook signature verification failed")
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      )
    }

    // Parse the event
    const event: PayPalWebhookEvent = JSON.parse(body)
    
    console.log(`[v0] Received PayPal webhook: ${event.event_type}`)

    // Handle different event types
    switch (event.event_type) {
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        await handleSubscriptionActivated(event)
        break

      case "BILLING.SUBSCRIPTION.CANCELLED":
        await handleSubscriptionCancelled(event)
        break

      case "BILLING.SUBSCRIPTION.SUSPENDED":
        await handleSubscriptionSuspended(event)
        break

      case "BILLING.SUBSCRIPTION.EXPIRED":
        await handleSubscriptionExpired(event)
        break

      case "PAYMENT.SALE.COMPLETED":
        await handlePaymentCompleted(event)
        break

      default:
        console.log(`[v0] Unhandled PayPal event type: ${event.event_type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] PayPal webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
