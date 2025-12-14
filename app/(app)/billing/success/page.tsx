import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id

  if (!sessionId) {
    redirect("/app/subscription")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid" && session.subscription) {
      const subscriptionId = session.subscription as string
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const planSlug = session.metadata?.plan_slug

      if (planSlug) {
        const { data: plan } = await supabase.from("plans").select("id").eq("code", planSlug.toUpperCase()).single()

        if (plan) {
          // Update user's plan
          await supabase.from("users").update({ plan_id: plan.id }).eq("id", user.id)

          // Create or update subscription record
          await supabase.from("subscriptions").upsert({
            user_id: user.id,
            provider: "STRIPE",
            provider_customer_id: session.customer as string,
            provider_subscription_id: subscriptionId,
            status: "ACTIVE",
            current_plan_id: plan.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
        }
      }
    }
  } catch (error) {
    console.error("Error processing successful checkout:", error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle>Payment Successful!</CardTitle>
          <CardDescription>Your subscription has been activated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Thank you for subscribing! Your account has been upgraded and you now have access to all premium features.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/app" className="w-full">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
            <Link href="/app/subscription" className="w-full">
              <Button variant="outline" className="w-full bg-transparent">
                View Subscription
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
