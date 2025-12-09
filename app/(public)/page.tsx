import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Users,
  BarChart3,
  RefreshCw,
  Send,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
} from "lucide-react"

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>Create invoices in under 60 seconds</span>
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Professional invoicing
              <span className="text-primary"> made simple</span>
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Create beautiful invoices, manage clients, track payments, and grow your business. Everything you need to
              get paid faster, all in one powerful platform.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/free-invoice">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Create Free Invoice
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required for free invoices</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "50K+", label: "Invoices Created" },
              { value: "$2M+", label: "Payments Processed" },
              { value: "10K+", label: "Happy Users" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage invoicing
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              From creating invoices to tracking payments, we have got you covered with powerful features.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "Invoice Generator",
                description:
                  "Create professional invoices in seconds with customizable templates and automatic calculations.",
              },
              {
                icon: Users,
                title: "Client Management",
                description: "Store client details, view invoice history, and maintain relationships all in one place.",
              },
              {
                icon: Send,
                title: "Email Delivery",
                description:
                  "Send invoices directly to clients with professional email templates and delivery tracking.",
              },
              {
                icon: CreditCard,
                title: "Payment Tracking",
                description: "Track paid, unpaid, and partially paid invoices. Record payments with multiple methods.",
              },
              {
                icon: RefreshCw,
                title: "Recurring Invoices",
                description: "Set up automatic monthly invoices for retainer clients. Never forget to bill again.",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Get insights into your revenue, payment trends, and top clients with visual reports.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Why businesses choose InvoiceFlow
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Join thousands of freelancers and small businesses who trust InvoiceFlow for their invoicing needs.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: Clock, text: "Save 5+ hours per week on invoicing" },
                  { icon: Shield, text: "Bank-level security for your data" },
                  { icon: Zap, text: "Get paid 2x faster on average" },
                  { icon: CheckCircle2, text: "Professional templates included" },
                ].map((benefit) => (
                  <div key={benefit.text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <benefit.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Invoice Preview</span>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    Professional
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <div className="font-semibold">INV-001</div>
                      <div className="text-sm text-muted-foreground">Due: Dec 15, 2025</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">$2,500.00</div>
                      <div className="text-sm text-primary">Paid</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Web Design Services</span>
                      <span>$2,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Logo Design</span>
                      <span>$500.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to streamline your invoicing?
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Start creating professional invoices today. No credit card required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
