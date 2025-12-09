import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"

// Use service role for webhook handler
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const PLAN_MAPPING: Record<string, string> = {
  prod_TZgwJzsBISQoVW: "basic",
  prod_TZgwNbfS4MfzSv: "standard",
  prod_TZgwfycFvWN4a5: "pro",
}

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook handler error:", err)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id
  const planSlug = session.metadata?.plan_slug

  if (!userId || !planSlug) return

  // Get plan ID from database
  const { data: plan } = await supabaseAdmin.from("plans").select("id").eq("slug", planSlug).single()

  if (!plan) return

  // Get subscription details
  const subscriptionId = session.subscription as string
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Update user's plan
  await supabaseAdmin.from("users").update({ plan_id: plan.id }).eq("id", userId)

  // Create subscription record
  await supabaseAdmin.from("subscriptions").upsert({
    user_id: userId,
    plan_id: plan.id,
    stripe_subscription_id: subscriptionId,
    stripe_customer_id: session.customer as string,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find user by Stripe customer ID
  const { data: user } = await supabaseAdmin.from("users").select("id").eq("stripe_customer_id", customerId).single()

  if (!user) return

  // Get product ID from subscription
  const productId = subscription.items.data[0]?.price.product as string
  const planSlug = PLAN_MAPPING[productId]

  if (planSlug) {
    const { data: plan } = await supabaseAdmin.from("plans").select("id").eq("slug", planSlug).single()

    if (plan) {
      await supabaseAdmin.from("users").update({ plan_id: plan.id }).eq("id", user.id)
    }
  }

  // Update subscription record
  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq("stripe_subscription_id", subscription.id)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find user and reset to guest plan
  const { data: user } = await supabaseAdmin.from("users").select("id").eq("stripe_customer_id", customerId).single()

  if (!user) return

  // Get guest plan
  const { data: guestPlan } = await supabaseAdmin.from("plans").select("id").eq("slug", "guest").single()

  if (guestPlan) {
    await supabaseAdmin.from("users").update({ plan_id: guestPlan.id }).eq("id", user.id)
  }

  // Update subscription status
  await supabaseAdmin.from("subscriptions").update({ status: "canceled" }).eq("stripe_subscription_id", subscription.id)
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Log successful payment if needed
  console.log("Payment succeeded for invoice:", invoice.id)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // Log failed payment for follow-up
  console.log("Payment failed for invoice:", invoice.id)
}
