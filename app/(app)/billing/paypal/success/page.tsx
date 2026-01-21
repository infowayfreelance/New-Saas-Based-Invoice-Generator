import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPayPalSubscription } from "@/app/actions/paypal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

async function PayPalSuccessContent({
  subscriptionId,
}: {
  subscriptionId: string
}) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get subscription details from PayPal
  const subscription = await getPayPalSubscription(subscriptionId)

  // Update subscription status in our database
  if (subscription.status === "ACTIVE") {
    const { data: subData } = await supabase
      .from("subscriptions")
      .select("current_plan_id")
      .eq("provider_subscription_id", subscriptionId)
      .single()

    if (subData) {
      // Update subscription status
      await supabase
        .from("subscriptions")
        .update({
          status: "ACTIVE",
          current_period_start: subscription.start_time,
          current_period_end: subscription.billing_info?.next_billing_time || null,
        })
        .eq("provider_subscription_id", subscriptionId)

      // Update user's plan
      await supabase
        .from("users")
        .update({ plan_id: subData.current_plan_id })
        .eq("id", user.id)
    }
  }

  return (
    <div className="container max-w-2xl py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Subscription Activated!</CardTitle>
          <CardDescription>
            Your PayPal subscription has been successfully activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subscription ID</dt>
                <dd className="font-mono">{subscription.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium text-green-600">{subscription.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Started</dt>
                <dd>{new Date(subscription.start_time).toLocaleDateString()}</dd>
              </div>
              {subscription.billing_info?.next_billing_time && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Next Billing</dt>
                  <dd>
                    {new Date(subscription.billing_info.next_billing_time).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/app">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/app/subscription">Manage Subscription</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function PayPalSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ subscription_id?: string }>
}) {
  const params = await searchParams
  const subscriptionId = params.subscription_id

  if (!subscriptionId) {
    redirect("/pricing")
  }

  return (
    <Suspense
      fallback={
        <div className="container max-w-2xl py-12">
          <Card>
            <CardHeader>
              <CardTitle>Processing...</CardTitle>
              <CardDescription>Please wait while we activate your subscription.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <PayPalSuccessContent subscriptionId={subscriptionId} />
    </Suspense>
  )
}
