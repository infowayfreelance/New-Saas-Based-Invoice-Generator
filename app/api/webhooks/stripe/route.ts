export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from "next/server"

const PLAN_MAPPING: Record<string, string> = {
  prod_TZgwJzsBISQoVW: "basic",
  prod_TZgwNbfS4MfzSv: "standard",
  prod_TZgwfycFvWN4a5: "pro",
}

async function getSupabaseAdmin() {
  const { createClient } = await import("@supabase/supabase-js")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables for webhook handler")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

async function getStripe() {
  const Stripe = (await import("stripe")).default

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    throw new Error("Missing Stripe secret key for webhook handler")
  }
  return new Stripe(stripeSecretKey, { apiVersion: "2023-08-16" })
}

export async function POST(req: Request) {
  const { headers } = await import("next/headers")
  const Stripe = (await import("stripe")).default

  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  const stripeInstance = await getStripe()

  let event: Stripe.Event

  try {
    event = stripeInstance.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
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

async function handleCheckoutCompleted(session: any) {
  const Stripe = (await import("stripe")).default
  const stripeInstance = await getStripe()
  const supabaseAdmin = await getSupabaseAdmin()

  const userId = session.metadata?.user_id
  const planSlug = session.metadata?.plan_slug

  if (!userId || !planSlug) return

  const { data: plan } = await supabaseAdmin.from("plans").select("id").eq("slug", planSlug).single()

  if (!plan) return

  const subscriptionId = session.subscription as string
  const subscription = await stripeInstance.subscriptions.retrieve(subscriptionId)

  await supabaseAdmin.from("users").update({ plan_id: plan.id }).eq("id", userId)

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

async function handleSubscriptionUpdated(subscription: any) {
  const supabaseAdmin = await getSupabaseAdmin()

  const customerId = subscription.customer as string

  const { data: user } = await supabaseAdmin.from("users").select("id").eq("stripe_customer_id", customerId).single()

  if (!user) return

  const productId = subscription.items.data[0]?.price.product as string
  const planSlug = PLAN_MAPPING[productId]

  if (planSlug) {
    const { data: plan } = await supabaseAdmin.from("plans").select("id").eq("slug", planSlug).single()

    if (plan) {
      await supabaseAdmin.from("users").update({ plan_id: plan.id }).eq("id", user.id)
    }
  }

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

async function handleSubscriptionDeleted(subscription: any) {
  const supabaseAdmin = await getSupabaseAdmin()

  const customerId = subscription.customer as string

  const { data: user } = await supabaseAdmin.from("users").select("id").eq("stripe_customer_id", customerId).single()

  if (!user) return

  const { data: guestPlan } = await supabaseAdmin.from("plans").select("id").eq("slug", "guest").single()

  if (guestPlan) {
    await supabaseAdmin.from("users").update({ plan_id: guestPlan.id }).eq("id", user.id)
  }

  await supabaseAdmin.from("subscriptions").update({ status: "canceled" }).eq("stripe_subscription_id", subscription.id)
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log("Payment succeeded for invoice:", invoice.id)
}

async function handleInvoicePaymentFailed(invoice: any) {
  console.log("Payment failed for invoice:", invoice.id)
}
