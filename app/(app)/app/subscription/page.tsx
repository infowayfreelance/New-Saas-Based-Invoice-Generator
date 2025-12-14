import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ManageSubscriptionButton } from "@/components/subscription/manage-button"
import { SubscriptionUpgradeButton } from "@/components/subscription/upgrade-button"

function renderFeatureLabel(key: string, value: any): string | null {
  if (key === "download_pdf" && value) return "Download PDF invoices"
  if (key === "send_email" && value) return "Send invoices via email"
  if (key === "save_clients" && value) return "Save & manage clients"
  if (key === "templates" && Array.isArray(value) && value.length > 0) {
    return `Invoice templates: ${value.join(", ")}`
  }
  if (key === "analytics" && value) return "Analytics dashboard"
  if (key === "recurring" && value) return "Recurring invoices"
  if (key === "payment_tracking" && value) return "Payment tracking"
  if (key === "logo_upload" && value) return "Logo upload"
  if (key === "branding" && value) return "Custom branding"
  if (key === "watermark" && value) return "Custom watermark"
  if (key === "signature" && value) return "Digital signature"
  if (key === "auto_reminders" && value) return "Automatic reminders"
  return null
}

function extractFeatures(features_json: any): string[] {
  const features: string[] = []
  if (!features_json || typeof features_json !== "object") return features

  Object.entries(features_json).forEach(([key, value]) => {
    const label = renderFeatureLabel(key, value)
    if (label) features.push(label)
  })

  return features
}

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

  const { data: userData } = await supabase.from("users").select("id, email, name, plan_id").eq("id", user.id).single()

  const { data: plans } = await supabase.from("plans").select("*").order("price_monthly", { ascending: true })

  let currentPlan = plans?.find((p) => p.id === userData?.plan_id)

  // If no match or plan_id is null, fallback to GUEST plan
  if (!currentPlan) {
    currentPlan = plans?.find((p) => p.code === "GUEST")
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "ACTIVE")
    .single()

  const hasActiveSubscription = !!subscription
  const params = await searchParams

  const currentPlanFeatures = extractFeatures(currentPlan?.features_json)

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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Plan
              <Badge variant="secondary">{currentPlan?.name || "Guest"}</Badge>
            </CardTitle>
            <CardDescription>
              {currentPlan?.invoice_limit_per_day !== null && currentPlan?.invoice_limit_per_month !== null
                ? `${currentPlan.invoice_limit_per_day} invoices/day, ${currentPlan.invoice_limit_per_month} invoices/month`
                : currentPlan?.invoice_limit_per_day !== null && currentPlan?.invoice_limit_per_month === null
                  ? `${currentPlan.invoice_limit_per_day} invoices/day, No monthly limit`
                  : currentPlan?.invoice_limit_per_day === null && currentPlan?.invoice_limit_per_month !== null
                    ? `No daily limit, ${currentPlan.invoice_limit_per_month} invoices/month`
                    : "No invoice limits"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-3xl font-bold">
              ${currentPlan?.price_monthly?.toFixed(2) || "0.00"}
              <span className="text-base font-normal text-muted-foreground">/month</span>
            </div>
            {currentPlanFeatures.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold">Included:</h4>
                <ul className="space-y-1.5 text-sm">
                  {currentPlanFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {hasActiveSubscription && (
              <div className="mt-4">
                <ManageSubscriptionButton />
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Available Plans</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {plans?.map((plan) => {
              const isCurrent = plan.id === currentPlan?.id
              const planFeatures = extractFeatures(plan.features_json)

              return (
                <Card key={plan.id} className={isCurrent ? "border-primary" : ""}>
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
                      {plan.invoice_limit_per_day !== null && plan.invoice_limit_per_month !== null
                        ? `${plan.invoice_limit_per_day} invoices/day, ${plan.invoice_limit_per_month} invoices/month`
                        : plan.invoice_limit_per_day !== null && plan.invoice_limit_per_month === null
                          ? `${plan.invoice_limit_per_day} invoices/day, No monthly limit`
                          : plan.invoice_limit_per_day === null && plan.invoice_limit_per_month !== null
                            ? `No daily limit, ${plan.invoice_limit_per_month} invoices/month`
                            : "No invoice limits"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 text-3xl font-bold">
                      ${plan.price_monthly?.toFixed(2) || "0.00"}
                      <span className="text-base font-normal text-muted-foreground">/month</span>
                    </div>
                    {planFeatures.length > 0 && (
                      <div>
                        <h4 className="mb-3 text-sm font-semibold">What&apos;s included:</h4>
                        <ul className="space-y-2 text-sm">
                          {planFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {isCurrent ? (
                      <Button disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : (
                      <SubscriptionUpgradeButton planName={plan.name}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Upgrade to {plan.name}
                      </SubscriptionUpgradeButton>
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
