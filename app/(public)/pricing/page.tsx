import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { PricingButton } from "@/components/pricing/pricing-button"
import { BillingToggle } from "@/components/pricing/billing-toggle"
import { getPricingDataWithFallback } from "@/app/actions/pricing"

export const metadata: Metadata = {
  title: "Pricing - Choose Your Plan",
  description: "Simple, transparent pricing for everyone. Choose the plan that fits your needs with country-specific pricing.",
}

const planFeatures = {
  GUEST: [
    { text: "3 invoices per day", included: true },
    { text: "15 invoices per month", included: true },
    { text: "Download PDF", included: true },
    { text: "Basic template", included: true },
    { text: "Send via email", included: false },
    { text: "Save clients", included: false },
    { text: "Invoice history", included: false },
  ],
  BASIC: [
    { text: "5 invoices per day", included: true },
    { text: "30 invoices per month", included: true },
    { text: "Download PDF", included: true },
    { text: "Send via email", included: true },
    { text: "Basic template", included: true },
    { text: "Save clients", included: false },
    { text: "Multiple templates", included: false },
  ],
  STANDARD: [
    { text: "Unlimited invoices", included: true },
    { text: "Download PDF", included: true },
    { text: "Send via email", included: true },
    { text: "Save & manage clients", included: true },
    { text: "3 professional templates", included: true },
    { text: "Upload your logo", included: true },
    { text: "Basic analytics", included: true },
  ],
  PRO: [
    { text: "Everything in Standard", included: true },
    { text: "5 premium templates", included: true },
    { text: "Recurring invoices", included: true },
    { text: "Payment tracking", included: true },
    { text: "Auto late reminders", included: true },
    { text: "Full analytics dashboard", included: true },
    { text: "Watermark & signature", included: true },
  ],
}

const planDescriptions = {
  GUEST: "Try it out without signing up",
  BASIC: "Perfect for getting started",
  STANDARD: "For growing businesses",
  PRO: "For power users",
}

export default async function PricingPage() {
  // Get pricing data with automatic country detection and US fallback
  const pricingData = await getPricingDataWithFallback()

  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Choose the plan that fits your needs. All paid plans include a 14-day free trial.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center">
          <BillingToggle />
        </div>

        {/* Pricing Cards - Always render when data exists */}
        {pricingData.length > 0 ? (
          <>
            <div className="mt-12 grid gap-6 lg:grid-cols-4">
              {/* Guest Plan */}
              <Card className="relative flex flex-col border-border">
                <CardHeader>
                  <CardTitle>Guest</CardTitle>
                  <CardDescription>{planDescriptions.GUEST}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Free</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {planFeatures.GUEST.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                        )}
                        <span className={feature.included ? "" : "text-muted-foreground/50"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/free-invoice" className="w-full">
                    <button className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                      Create Free Invoice
                    </button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Paid Plans */}
              {pricingData
                .filter((plan) => plan.plan_code !== 'GUEST') // Filter out duplicate free plan
                .map((plan) => {
                  const isPopular = plan.plan_code === 'STANDARD'
                  const features = planFeatures[plan.plan_code as keyof typeof planFeatures] || []
                  const description = planDescriptions[plan.plan_code as keyof typeof planDescriptions] || ''
                  
                  // Calculate monthly-equivalent for yearly pricing
                  const yearlyMonthly = Math.round(plan.price_yearly / 12)

                  return (
                    <Card
                      key={plan.plan_code}
                      className={`relative flex flex-col ${isPopular ? "border-primary shadow-lg" : "border-border"}`}
                      data-plan={plan.plan_code.toLowerCase()}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{plan.plan_name}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                        <div className="mt-4">
                          {/* Monthly Pricing Display */}
                          <div data-price-monthly>
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-bold">
                                {plan.currency_symbol}{plan.price_amount}
                              </span>
                              <span className="text-muted-foreground">/month</span>
                            </div>
                          </div>
                          
                          {/* Yearly Pricing Display */}
                          <div data-price-yearly className="hidden">
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-bold">
                                {plan.currency_symbol}{yearlyMonthly}
                              </span>
                              <span className="text-muted-foreground">/month</span>
                            </div>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-muted-foreground">billed annually</p>
                              <p className="text-sm">
                                <span className="text-muted-foreground line-through">
                                  {plan.currency_symbol}{plan.price_amount}
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Billed {plan.currency_symbol}{plan.price_yearly} yearly
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <ul className="space-y-3">
                          {features.map((feature) => (
                            <li key={feature.text} className="flex items-start gap-3">
                              {feature.included ? (
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              ) : (
                                <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                              )}
                              <span className={feature.included ? "" : "text-muted-foreground/50"}>
                                {feature.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <PricingButton
                          planSlug={plan.plan_code.toLowerCase() as "basic" | "standard" | "pro"}
                          variant={isPopular ? "default" : "outline"}
                        >
                          Upgrade to {plan.plan_name}
                        </PricingButton>
                      </CardFooter>
                    </Card>
                  )
                })}
            </div>

            <div className="mt-16 text-center">
              <p className="text-muted-foreground">
                All prices in {pricingData[0]?.currency_code || 'USD'} for {pricingData[0]?.country_name || 'your region'}.{' '}
                Need a custom plan?{" "}
                <Link href="/contact" className="font-medium text-primary hover:underline">
                  Contact us
                </Link>
              </p>
            </div>
          </>
        ) : (
          <div className="mt-12 space-y-4">
            <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
              <h3 className="font-semibold text-destructive">⚠️ Debug: No Pricing Data Loaded</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>Issue:</strong> No rows returned from country_pricing table</p>
                <p><strong>Expected:</strong> US pricing should always be available as fallback</p>
                <p><strong>Check server logs for:</strong></p>
                <ul className="ml-4 list-disc space-y-1 text-xs">
                  <li>Detected country code</li>
                  <li>Query result row counts</li>
                  <li>Sample data structure</li>
                  <li>Database connection errors</li>
                </ul>
                <p className="mt-2"><strong>Database query:</strong> SELECT * FROM country_pricing WHERE country_code = 'US';</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <h3 className="text-xl font-semibold">Pricing Information Unavailable</h3>
              <p className="mt-2 text-muted-foreground">
                We're experiencing technical difficulties. Please check the server logs or contact support.
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Sign up for free
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link href="/" className="font-medium text-primary hover:underline">
                  Return home
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
