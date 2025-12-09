import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for everyone. Choose the plan that fits your needs.",
}

const planDetails = [
  {
    code: "GUEST",
    name: "Guest",
    description: "Try it out without signing up",
    price: "Free",
    period: "",
    cta: "Create Free Invoice",
    href: "/free-invoice",
    popular: false,
    features: [
      { text: "3 invoices per day", included: true },
      { text: "15 invoices per month", included: true },
      { text: "Download PDF", included: true },
      { text: "Basic template", included: true },
      { text: "Send via email", included: false },
      { text: "Save clients", included: false },
      { text: "Invoice history", included: false },
    ],
  },
  {
    code: "BASIC",
    name: "Basic",
    description: "Perfect for getting started",
    price: "$5",
    period: "/month",
    cta: "Start Free Trial",
    href: "/register?plan=basic",
    popular: false,
    features: [
      { text: "5 invoices per day", included: true },
      { text: "30 invoices per month", included: true },
      { text: "Download PDF", included: true },
      { text: "Send via email", included: true },
      { text: "Basic template", included: true },
      { text: "Save clients", included: false },
      { text: "Multiple templates", included: false },
    ],
  },
  {
    code: "STANDARD",
    name: "Standard",
    description: "For growing businesses",
    price: "$12",
    period: "/month",
    cta: "Start Free Trial",
    href: "/register?plan=standard",
    popular: true,
    features: [
      { text: "Unlimited invoices", included: true },
      { text: "Download PDF", included: true },
      { text: "Send via email", included: true },
      { text: "Save & manage clients", included: true },
      { text: "3 professional templates", included: true },
      { text: "Upload your logo", included: true },
      { text: "Basic analytics", included: true },
    ],
  },
  {
    code: "PRO",
    name: "Pro",
    description: "For power users",
    price: "$29.99",
    period: "/month",
    cta: "Start Free Trial",
    href: "/register?plan=pro",
    popular: false,
    features: [
      { text: "Everything in Standard", included: true },
      { text: "5 premium templates", included: true },
      { text: "Recurring invoices", included: true },
      { text: "Payment tracking", included: true },
      { text: "Auto late reminders", included: true },
      { text: "Full analytics dashboard", included: true },
      { text: "Watermark & signature", included: true },
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Choose the plan that fits your needs. All paid plans include a 14-day free trial.
          </p>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-4">
          {planDetails.map((plan) => (
            <Card
              key={plan.code}
              className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg" : "border-border"}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground/50"}>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All prices in USD. Need a custom plan?{" "}
            <Link href="/contact" className="font-medium text-primary hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
