import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, CheckCircle, XCircle } from "lucide-react"
import { PLANS } from "@/lib/plans"
import { CheckoutButton } from "@/components/subscription/checkout-button"
import { ManageSubscriptionButton } from "@/components/subscription/manage-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase
    .from("users")
    .select(
      `
      *,
      plan:plans(*)
    `,
    )
    .eq("id", user.id)
    .single()

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  const currentPlanCode = userData?.plan?.code || "BASIC"
  const hasActiveSubscription = !!subscription
  const params = await searchParams

  return (
    <>
      <PageHeader
        title="Subscription"
        breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Subscription" }]}
      />
      <div className="flex-1 space-y-6 p-6">
        {params.success && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Subscription successful!</AlertTitle>
            <AlertDescription>Your subscription has been activated. Thank you for your purchase!</AlertDescription>
          </Alert>
        )}
        {params.canceled && (
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <XCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle>Checkout canceled</AlertTitle>
            <AlertDescription>Your checkout was canceled. No charges were made.</AlertDescription>
          </Alert>
        )}

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Plan
              <Badge variant="secondary">{userData?.plan?.name || "Basic"}</Badge>
            </CardTitle>
            <CardDescription>
              {userData?.plan?.invoice_limit_per_day
                ? `${userData.plan.invoice_limit_per_day} invoices/day, ${userData.plan.invoice_limit_per_month}/month`
                : "Unlimited invoices"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">
              ${userData?.plan?.price_monthly || 5}
              <span className="text-base font-normal text-muted-foreground">/month</span>
            </div>
            {hasActiveSubscription && <ManageSubscriptionButton />}
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Available Plans</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.filter((p) => p.code !== "GUEST").map((plan) => {
              const isCurrent = plan.code === currentPlanCode
              const isUpgrade =
                PLANS.findIndex((p) => p.code === plan.code) > PLANS.findIndex((p) => p.code === currentPlanCode)
              const planSlugMap: Record<string, "basic" | "standard" | "pro"> = {
                BASIC: "basic",
                STANDARD: "standard",
                PRO: "pro",
              }
              const stripeSlug = planSlugMap[plan.code]

              return (
                <Card key={plan.code} className={isCurrent ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.name}</CardTitle>
                      {isCurrent && (
                        <Badge variant="secondary">
                          <Check className="mr-1 h-3 w-3" />
                          Current
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      {plan.invoiceLimitPerDay
                        ? `${plan.invoiceLimitPerDay}/day, ${plan.invoiceLimitPerMonth}/month`
                        : "Unlimited invoices"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 text-3xl font-bold">
                      ${plan.priceMonthly}
                      <span className="text-base font-normal text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      {plan.features.downloadPdf && (
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Download PDF
                        </li>
                      )}
                      {plan.features.sendEmail && (
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Send via email
                        </li>
                      )}
                      {plan.features.saveClients && (
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Client management
                        </li>
                      )}
                      {plan.features.recurring && (
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Recurring invoices
                        </li>
                      )}
                      {plan.features.paymentTracking && (
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Payment tracking
                        </li>
                      )}
                      {plan.features.analytics && (
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Analytics dashboard
                        </li>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {isCurrent ? (
                      <Button disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : stripeSlug ? (
                      <CheckoutButton
                        planSlug={stripeSlug}
                        variant={isUpgrade ? "default" : "outline"}
                        className="w-full"
                      >
                        {isUpgrade ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Upgrade to {plan.name}
                          </>
                        ) : (
                          `Switch to ${plan.name}`
                        )}
                      </CheckoutButton>
                    ) : (
                      <Button className="w-full bg-transparent" variant="outline" disabled>
                        Contact Sales
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
