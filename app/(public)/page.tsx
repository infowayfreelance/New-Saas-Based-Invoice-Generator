import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Download,
  Smartphone,
  Check,
  X,
} from "lucide-react"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://invoiceflow.vercel.app"

export const metadata: Metadata = {
  title: "Free Online Invoice Generator for Freelancers & Small Businesses",
  description:
    "Generate professional invoices, download PDF invoices, manage recurring billing, and track payments with InvoiceFlow invoicing software.",
  keywords: [
    "free online invoice generator",
    "invoice generator",
    "free invoice maker",
    "PDF invoice",
    "invoicing software for freelancers",
    "small business invoicing",
    "online invoicing",
    "recurring invoices",
    "payment tracking",
    "invoice template",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Free Online Invoice Generator for Freelancers & Small Businesses",
    description:
      "Generate professional invoices, download PDF invoices, manage recurring billing, and track payments with InvoiceFlow invoicing software.",
    url: siteUrl,
    siteName: "InvoiceFlow",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "InvoiceFlow – Free Online Invoice Generator",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Invoice Generator for Freelancers & Small Businesses",
    description:
      "Generate professional invoices, download PDF invoices, manage recurring billing, and track payments with InvoiceFlow invoicing software.",
    images: [`${siteUrl}/og-image.png`],
  },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "InvoiceFlow",
  url: siteUrl,
  description:
    "Free online invoice generator for freelancers and small businesses. Create professional PDF invoices, manage clients, and track payments.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "InvoiceFlow",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  url: siteUrl,
  description:
    "Free online invoice generator. Create professional PDF invoices, manage clients, track payments, and automate recurring billing.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "1200",
  },
  featureList: [
    "PDF Invoice Generator",
    "Client Management",
    "Email Delivery",
    "Payment Tracking",
    "Recurring Invoices",
    "Analytics Dashboard",
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I create an invoice online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply add your business details, client information, services, and pricing. InvoiceFlow automatically generates a professional PDF invoice in seconds.",
      },
    },
    {
      "@type": "Question",
      name: "Is InvoiceFlow free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can create free invoices online without entering credit card details. Premium features are available with paid plans.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download invoices as PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all invoices can be downloaded instantly as professional PDF files for printing or sharing with clients.",
      },
    },
    {
      "@type": "Question",
      name: "Does InvoiceFlow support recurring invoices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can automate recurring invoices for monthly billing, retainers, subscriptions, and repeat clients.",
      },
    },
    {
      "@type": "Question",
      name: "Can freelancers use InvoiceFlow?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. InvoiceFlow is designed for freelancers, agencies, consultants, contractors, and small businesses.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track paid and unpaid invoices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can monitor paid, unpaid, overdue, and partially paid invoices from your dashboard in real time.",
      },
    },
  ],
}

const features = [
  {
    icon: FileText,
    title: "Invoice Generator",
    description:
      "Create professional PDF invoices online with customizable templates, automatic tax calculations, and instant invoice downloads.",
  },
  {
    icon: Users,
    title: "Client Management",
    description:
      "Store customer details, manage client billing information, and access complete invoice history from one dashboard.",
  },
  {
    icon: Send,
    title: "Email Delivery",
    description:
      "Send invoices directly to clients by email with professional invoice notifications and delivery tracking.",
  },
  {
    icon: CreditCard,
    title: "Payment Tracking",
    description:
      "Track paid, unpaid, and overdue invoices easily with real-time payment status and multiple payment methods.",
  },
  {
    icon: RefreshCw,
    title: "Recurring Invoices",
    description:
      "Automate monthly invoices for repeat clients and subscription-based services without manual work.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Monitor revenue, payment trends, top clients, and business performance with easy-to-read invoice reports.",
  },
]

const benefits = [
  { icon: Clock, text: "Save 5+ hours every week with automated invoicing tools" },
  { icon: Shield, text: "Create secure, bank-level encrypted online invoices" },
  { icon: Zap, text: "Get paid faster with professional invoice templates" },
  { icon: Download, text: "Download and send PDF invoices instantly" },
  { icon: RefreshCw, text: "Manage recurring invoices and client billing easily" },
  { icon: Smartphone, text: "Access your invoices anytime from desktop or mobile devices" },
]

const faqs = [
  {
    question: "How do I create an invoice online?",
    answer:
      "Simply add your business details, client information, services, and pricing. InvoiceFlow automatically generates a professional PDF invoice in seconds.",
  },
  {
    question: "Is InvoiceFlow free to use?",
    answer:
      "Yes, you can create free invoices online without entering credit card details. Premium features are available with paid plans.",
  },
  {
    question: "Can I download invoices as PDF?",
    answer:
      "Yes, all invoices can be downloaded instantly as professional PDF files for printing or sharing with clients.",
  },
  {
    question: "Does InvoiceFlow support recurring invoices?",
    answer:
      "Yes, you can automate recurring invoices for monthly billing, retainers, subscriptions, and repeat clients.",
  },
  {
    question: "Can freelancers use InvoiceFlow?",
    answer:
      "Absolutely. InvoiceFlow is designed for freelancers, agencies, consultants, contractors, and small businesses.",
  },
  {
    question: "Can I track paid and unpaid invoices?",
    answer:
      "Yes, you can monitor paid, unpaid, overdue, and partially paid invoices from your dashboard in real time.",
  },
]

const comparisonRows = [
  { feature: "Professional PDF invoices", invoiceflow: true, spreadsheet: false, manual: false },
  { feature: "Automatic tax calculations", invoiceflow: true, spreadsheet: false, manual: false },
  { feature: "Client management", invoiceflow: true, spreadsheet: false, manual: false },
  { feature: "Email invoice delivery", invoiceflow: true, spreadsheet: false, manual: false },
  { feature: "Payment status tracking", invoiceflow: true, spreadsheet: false, manual: false },
  { feature: "Recurring invoices", invoiceflow: true, spreadsheet: false, manual: false },
  { feature: "Revenue analytics", invoiceflow: true, spreadsheet: false, manual: false },
  { feature: "Mobile access", invoiceflow: true, spreadsheet: false, manual: false },
]

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        {/* subtle radial glow behind heading */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
          <div className="h-[400px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              <span>Create invoices in under 60 seconds</span>
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Free Online Invoice Generator for{" "}
              <span className="text-primary">Freelancers &amp; Small Businesses</span>
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Create professional PDF invoices in under 60 seconds. Manage clients, send invoices online, track
              payments, and automate recurring billing with one simple invoicing platform.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/free-invoice">
                <Button size="lg" className="w-full gap-2 sm:w-auto shadow-md shadow-primary/20">
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
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • Free invoice templates included • Instant PDF download
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
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

      {/* ── Features Grid ── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage invoicing online
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Create invoices, manage customers, track payments, and grow your business with powerful online invoicing
              tools built for freelancers and small businesses.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border/50 bg-card/50 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
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

      {/* ── Benefits Section ── */}
      <section className="border-y border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Why InvoiceFlow</Badge>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Why Businesses Choose InvoiceFlow
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Thousands of freelancers, agencies, consultants, and small businesses use InvoiceFlow to create
                professional invoices, manage payments, and simplify billing online.
              </p>
              <ul className="mt-8 space-y-4" aria-label="Key benefits of InvoiceFlow">
                {benefits.map((benefit) => (
                  <li key={benefit.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <benefit.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{benefit.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mock invoice preview card */}
            <div className="relative">
              <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Invoice Preview</span>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Professional</Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <div className="font-semibold">INV-001</div>
                      <div className="text-sm text-muted-foreground">Due: Dec 15, 2025</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">$2,500.00</div>
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">Paid</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Web Design Services</span>
                      <span className="font-medium">$2,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Logo Design</span>
                      <span className="font-medium">$500.00</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 font-semibold">
                      <span>Total</span>
                      <span>$2,500.00</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1 gap-1">
                      <Download className="h-3.5 w-3.5" />
                      Download PDF
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-1 bg-transparent">
                      <Send className="h-3.5 w-3.5" />
                      Send Email
                    </Button>
                  </div>
                </div>
              </div>
              {/* decorative floating card */}
              <div className="absolute -right-4 -top-4 hidden rounded-lg border border-border bg-card px-3 py-2 shadow-md lg:block">
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium">Payment received</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Comparison</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              InvoiceFlow vs manual invoicing
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              See why thousands of businesses switched from spreadsheets and manual billing to InvoiceFlow.
            </p>
          </div>
          <div className="mt-12 overflow-hidden rounded-xl border border-border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-primary">InvoiceFlow</th>
                  <th className="px-6 py-4 text-center font-semibold text-muted-foreground">Spreadsheets</th>
                  <th className="px-6 py-4 text-center font-semibold text-muted-foreground">Manual / Paper</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
                  >
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.invoiceflow ? (
                        <Check className="mx-auto h-5 w-5 text-green-500" aria-label="Supported" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-muted-foreground/40" aria-label="Not supported" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.spreadsheet ? (
                        <Check className="mx-auto h-5 w-5 text-green-500" aria-label="Supported" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-muted-foreground/40" aria-label="Not supported" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.manual ? (
                        <Check className="mx-auto h-5 w-5 text-green-500" aria-label="Supported" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-muted-foreground/40" aria-label="Not supported" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="border-y border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Everything you need to know about using InvoiceFlow for online invoicing and payment management.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-border bg-card open:border-primary/30 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-border px-6 py-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-16 text-center">
            <Badge variant="secondary" className="mb-6">Get Started Free</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Start creating professional invoices online for free
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
              Generate PDF invoices, manage clients, track payments, and automate billing with one easy-to-use online
              invoicing platform.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/free-invoice">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Create Free Invoice Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required • Free invoice generator • Trusted by freelancers and small businesses worldwide
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {[
                { icon: CheckCircle2, text: "Free invoice templates" },
                { icon: Shield, text: "Bank-level security" },
                { icon: Download, text: "Instant PDF download" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
