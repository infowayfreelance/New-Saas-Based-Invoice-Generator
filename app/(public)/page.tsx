import type { Metadata } from "next"
import { Suspense } from "react"
import { getSiteUrl } from "@/lib/utils/site-url"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmbeddedInvoiceGenerator } from "@/components/marketing/embedded-invoice-generator"
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
  Download,
  Check,
  X,
  Lock,
  Building2,
  Briefcase,
  Hammer,
  Code2,
  Palette,
  BadgeCheck,
} from "lucide-react"

const siteUrl = getSiteUrl()

/* ── Metadata ────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Free Invoice Generator Online – Create PDF Invoices | MakeInvo",
  description:
    "Create professional PDF invoices online for free. No signup, watermark or credit card required. Build and download your invoice with MakeInvo.",
  keywords: [
    "free invoice generator",
    "online invoice generator",
    "free online invoice generator",
    "invoice maker",
    "free invoice maker",
    "create invoice online",
    "PDF invoice generator",
    "professional invoice generator",
    "invoice generator without signup",
    "invoice generator without watermark",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Free Invoice Generator Online – Create PDF Invoices | MakeInvo",
    description:
      "Create professional PDF invoices online for free. No signup, watermark or credit card required. Build and download your invoice with MakeInvo.",
    url: siteUrl,
    siteName: "MakeInvo",
    type: "website",
    images: [
      {
        url: `${siteUrl}/make-invo-og.png`,
        width: 1200,
        height: 630,
        alt: "MakeInvo - Free Online Invoice Generator",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator Online – Create PDF Invoices | MakeInvo",
    description:
      "Create professional PDF invoices online for free. No signup, watermark or credit card required.",
    images: [`${siteUrl}/make-invo-og.png`],
  },
}

/* ── Data ────────────────────────────────────────────────────────── */

const trustBadges = [
  { icon: Lock, label: "Protected with HTTPS/TLS" },
  { icon: Shield, label: "Privacy-Focused Data Handling" },
  { icon: BadgeCheck, label: "No Credit Card Required" },
  { icon: Download, label: "Instant PDF Download" },
]

const audiences = [
  { icon: Code2, label: "Freelancers" },
  { icon: Palette, label: "Designers & Creatives" },
  { icon: Briefcase, label: "Consultants" },
  { icon: Hammer, label: "Contractors & Tradespeople" },
  { icon: Building2, label: "Agencies" },
  { icon: Users, label: "Small Businesses" },
]

const features = [
  {
    icon: FileText,
    title: "Free Invoice Generator",
    description:
      "Create a professional PDF invoice online in under a minute. Add your logo, business details, line items, tax rates, and discounts with a clean invoice template.",
  },
  {
    icon: Users,
    title: "Client Management",
    description:
      "Save client contact details once and reuse them on every future invoice. See a full billing history for each customer from one dashboard.",
  },
  {
    icon: Send,
    title: "Email & WhatsApp Delivery",
    description:
      "Send invoices straight to a client's inbox, or share a link via WhatsApp so they can view and download the invoice PDF instantly.",
  },
  {
    icon: CreditCard,
    title: "Payment Tracking",
    description:
      "Track paid, unpaid, partially paid, and overdue invoices in real time, and record payments as they come in so your books stay accurate.",
  },
  {
    icon: RefreshCw,
    title: "Recurring Invoices",
    description:
      "Automate billing for retainers, subscriptions, and repeat clients so a recurring invoice goes out on schedule without manual work.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Monitor revenue, outstanding balances, and top clients with clear, easy-to-read reports built for freelancers and small teams.",
  },
]

const howItWorks = [
  {
    step: "1",
    title: "Add your business & client details",
    description: "Enter your business details, then add your client's billing information or select a saved client.",
  },
  {
    step: "2",
    title: "List your services or products",
    description: "Add line items with a description, quantity, price, and tax - MakeInvo calculates the totals automatically.",
  },
  {
    step: "3",
    title: "Generate & download your invoice",
    description: "Click Generate Invoice to create a clean, professional PDF instantly, ready to download or share.",
  },
  {
    step: "4",
    title: "Track the payment",
    description: "Mark the invoice as sent, paid, or overdue, and keep a running record in your dashboard.",
  },
]

const whoUses = [
  {
    icon: Code2,
    title: "Freelancers",
    description: "Bill hourly or per-project work with a clean freelancer invoice.",
  },
  {
    icon: Palette,
    title: "Designers & Creatives",
    description: "Send a professional invoice for design work, revisions, and licensing fees.",
  },
  {
    icon: Briefcase,
    title: "Consultants & Agencies",
    description: "Bill retainers, milestones, and hourly consulting work in one place.",
  },
  {
    icon: Hammer,
    title: "Contractors & Tradespeople",
    description: "Itemize labor and materials, apply tax where required, and track job payments.",
  },
  {
    icon: Building2,
    title: "Small Business Owners",
    description: "Replace ad-hoc spreadsheets with a proper business invoice and payment tracking.",
  },
  {
    icon: Users,
    title: "Solo Entrepreneurs",
    description: "Look established from day one with a professional invoice template.",
  },
]

const invoiceTypes = [
  {
    title: "Freelancer Invoice",
    description: "A simple, itemized invoice for project-based or hourly freelance work.",
  },
  {
    title: "Contractor Invoice",
    description: "Separates labor and materials into clear line items, with tax applied where required.",
  },
  {
    title: "Tax, VAT or GST Invoice",
    description: "Displays the tax rate and amount separately from the subtotal.",
  },
  {
    title: "Recurring Invoice",
    description: "A repeatable invoice for retainers and subscriptions, generated on a set schedule.",
  },
  {
    title: "Agency / Retainer Invoice",
    description: "Bills a fixed monthly retainer or a set of project milestones.",
  },
  {
    title: "International Invoice",
    description: "Supports multiple currencies so you can bill clients abroad accurately.",
  },
]

const comparisonRows = [
  { feature: "Create a professional PDF", makeinvo: true, spreadsheet: false, manual: false },
  { feature: "Automatic calculations", makeinvo: true, spreadsheet: true, manual: false },
  { feature: "Sequential invoice numbers", makeinvo: true, spreadsheet: false, manual: false },
  { feature: "Save client details", makeinvo: true, spreadsheet: true, manual: false },
  { feature: "Payment tracking", makeinvo: true, spreadsheet: false, manual: false },
  { feature: "Recurring invoices", makeinvo: true, spreadsheet: false, manual: false },
  { feature: "Mobile-friendly access", makeinvo: true, spreadsheet: false, manual: false },
]

const faqs = [
  {
    question: "What is MakeInvo?",
    answer:
      "MakeInvo is a free online invoice generator that lets freelancers, contractors, agencies, and small businesses create, download, and send professional PDF invoices in minutes - no design skills or accounting background required.",
  },
  {
    question: "Is MakeInvo free to use?",
    answer:
      "Yes. You can create and download an invoice PDF with the free invoice generator without entering a credit card. Paid plans add features like unlimited invoices, email delivery, recurring billing, and analytics.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. The free invoice generator on this page works without signup for occasional use. Creating a free account lets you save clients, access invoice history, and unlock higher usage limits.",
  },
  {
    question: "How do I create an invoice online?",
    answer:
      "Fill in your business details, add your client's information, list your services or products with quantities and prices, then click Generate Invoice. MakeInvo builds a professional PDF invoice instantly.",
  },
  {
    question: "Can I download my invoice as a PDF?",
    answer:
      "Yes. Every invoice you create can be downloaded instantly as a clean, print-ready PDF invoice, suitable for emailing, printing, or archiving for your records.",
  },
  {
    question: "Can I add tax, VAT or GST?",
    answer:
      "Yes. MakeInvo calculates tax per line item and displays it separately from the subtotal, so you can produce a tax, VAT, or GST invoice depending on your country's requirements.",
  },
  {
    question: "Can I add my business logo?",
    answer:
      "Yes, paid plans support custom branding, including your logo, on the invoice template, so every invoice you send looks consistent with your business identity.",
  },
  {
    question: "Can I use different currencies?",
    answer:
      "Yes. You can select from a wide range of currencies when creating an invoice, making it straightforward to bill international clients in their local currency.",
  },
  {
    question: "Are my invoices stored?",
    answer:
      "Invoices created without an account are generated for that session and are not saved to a profile. Once you create a free account, your invoices, clients, and payment history are securely stored so you can access them anytime.",
  },
  {
    question: "Can I send an invoice directly to a client?",
    answer:
      "Yes. Registered users can email an invoice directly to a client, or share a secure, no-login invoice link via WhatsApp so the client can view and download the PDF themselves.",
  },
]

/* ── JSON-LD Schemas ─────────────────────────────────────────────── */

const homepageTitle = "Free Invoice Generator Online – Create PDF Invoices | MakeInvo"
const homepageDescription =
  "Create professional PDF invoices online for free. No signup, watermark or credit card required. Build and download your invoice with MakeInvo."

// Square mark for schema.org Organization.logo / primaryImageOfPage (Google
// recommends a roughly square logo, not the wide wordmark used in the header).
const brandImageUrl = `${siteUrl}/make-invo-site-icon.webp`

// All entities share one @graph so they reference each other by @id instead
// of duplicating the Organization/WebSite as separate, disconnected nodes.
const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "MakeInvo",
      url: siteUrl,
      logo: brandImageUrl,
      description:
        "MakeInvo builds a free online invoice generator and invoicing platform for freelancers, contractors, agencies, and small businesses.",
      email: "support@makeinvo.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@makeinvo.com",
      },
      // No verified social profile URLs, founding date, or legal entity name
      // are available yet - omitted rather than invented.
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "MakeInvo",
      alternateName: "MakeInvo Invoice Generator",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en",
      // No internal site search exists (no /search route), so no
      // potentialAction/SearchAction is included.
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: "MakeInvo",
      url: siteUrl,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Invoice Generator",
      operatingSystem: "Any",
      browserRequirements: "Works in any modern web browser, no installation required.",
      description: homepageDescription,
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      image: brandImageUrl,
      provider: { "@id": `${siteUrl}/#organization` },
      // Only features verified to exist in the current product.
      featureList: [
        "Create professional invoices online",
        "Add business and client information",
        "Add invoice line items with quantity and price",
        "Automatic subtotal and total calculations",
        "Per-item tax rate calculation",
        "Discounts",
        "Automatic invoice numbering",
        "Issue date and due date",
        "Payment terms and notes",
        "PDF invoice download",
        "Multiple currencies",
        "Client management and invoice history",
        "Recurring invoices",
        "Payment tracking and reminders",
        "Logo upload and branding",
        "Send invoices via email and WhatsApp",
      ],
      // No genuine ratings, review counts, download counts, or awards are
      // available - aggregateRating/review intentionally omitted.
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: homepageTitle,
      description: homepageDescription,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#software` },
      mainEntity: { "@id": `${siteUrl}/#software` },
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en",
      primaryImageOfPage: brandImageUrl,
      // No reliable last-modified timestamp is tracked for this page yet,
      // so dateModified is intentionally omitted rather than guessed.
    },
    // FAQPage schema mirrors the visible FAQ section rendered further down
    // this page (see the "FAQ Section" below) - same questions, same answers.
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      {/* JSON-LD: single connected graph (Organization, WebSite, SoftwareApplication, WebPage, FAQPage) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema).replace(/</g, "\\u003c") }}
      />

      {/* ── Hero + Embedded Generator ────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
          <div className="h-[400px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              <span>Create a professional invoice in minutes</span>
            </div>

            {/* H1 */}
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Free Online Invoice Generator
            </h1>

            {/* Sub Heading */}
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Create a professional PDF invoice in minutes with MakeInvo. Add your business and client details,
              calculate totals and download your invoice for free—no signup, watermark or credit card required.
            </p>

            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • No watermark • Instant PDF download
            </p>

            <div className="mt-8 flex justify-center">
              <Link href="#invoice-generator">
                <Button size="lg" className="gap-2 shadow-md shadow-primary/20">
                  Create Free Invoice
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* The actual, working invoice generator - above the fold. Wrapped
              in Suspense because it reads an optional ?layout= param (used
              by "Use Template" links from /invoice-templates and profession
              pages like /invoice-generator-for-freelancers) via
              useSearchParams, which requires a Suspense boundary to keep
              the rest of this page statically prerendered. */}
          <div className="mx-auto mt-12 max-w-6xl">
            <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
              <EmbeddedInvoiceGenerator />
            </Suspense>
          </div>

          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="w-full gap-2 sm:w-auto shadow-md shadow-primary/20">
                Create a Free Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                See Pricing Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ──────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center justify-center gap-2 text-center text-sm font-medium text-muted-foreground sm:justify-start">
                <badge.icon className="h-4 w-4 shrink-0 text-primary" />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Made For ──────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Made for people who bill for their work
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {audiences.map((audience) => (
              <div key={audience.label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <audience.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{audience.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose MakeInvo ───────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">Why MakeInvo</Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Why choose MakeInvo?</h2>
          <div className="mt-6 space-y-4 text-pretty leading-relaxed text-muted-foreground">
            <p>
              The invoice generator above works without registration - fill it in, calculate your totals, and
              download a professional PDF invoice in minutes, no account required.
            </p>
            <p>
              Create a free account to manage your clients and invoices from one dashboard. Paid plans add recurring
              invoices, payment tracking, and analytics for freelancers, agencies, and small businesses that bill
              regularly.
            </p>
          </div>
        </div>
      </section>

      {/* ── Complete Features ────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage invoicing online
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Create invoices, manage clients, track payments, and grow your business with a complete online
              invoicing toolkit built for freelancers, contractors, agencies, and small businesses.
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

          <p className="mt-10 text-center text-sm text-muted-foreground">
            See the full picture on our{" "}
            <Link href="/features" className="text-primary hover:underline">
              features page
            </Link>{" "}
            or compare{" "}
            <Link href="/pricing" className="text-primary hover:underline">
              pricing plans
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Create an invoice online in four simple steps
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              No accounting degree required. MakeInvo guides you through the exact fields a professional invoice
              needs, in order.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="#invoice-generator">
              <Button size="lg" className="gap-2">
                Try the Invoice Generator
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Who Should Use This Tool ──────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Who It's For</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Who should use this tool</h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              MakeInvo is built for anyone who bills for their time, services, or products - regardless of industry
              or business size.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whoUses.map((item) => (
              <Card key={item.title} className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Invoice Types ─────────────────────────────────── */}
      <section id="invoice-examples" className="scroll-mt-20 border-y border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Invoice Types</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Popular invoice types
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Every business needs a slightly different invoice. Here's how MakeInvo adapts to common invoice types.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {invoiceTypes.map((type) => (
              <Link key={type.title} href="#invoice-generator" className="block">
                <Card className="h-full border-border/50 bg-card/50 transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">{type.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ─────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Comparison</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              MakeInvo vs. manual invoice creation
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Spreadsheets and paper invoices work for a while - here's how a dedicated invoice generator compares.
            </p>
          </div>
          <div className="mt-12 overflow-x-auto rounded-xl border border-border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-primary">MakeInvo</th>
                  <th className="px-6 py-4 text-center font-semibold text-muted-foreground">Spreadsheets</th>
                  <th className="px-6 py-4 text-center font-semibold text-muted-foreground">Manual / Paper</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.makeinvo ? (
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

      {/* ── Security & Privacy ────────────────────────────────────── */}
      <section id="security" className="scroll-mt-20 border-y border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">Security &amp; Privacy</Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Your invoice data deserves proper protection
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Every connection to MakeInvo uses HTTPS/TLS encryption, and account information is protected behind
            authenticated access. Guest invoices created without an account are not saved to a user profile.
            Registered users can manage their saved invoices and clients from their dashboard at any time.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/privacy">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                Privacy Policy
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ──────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Everything you need to know about creating invoices online with MakeInvo.
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

      {/* ── Final CTA ──────────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-16 text-center">
            <Badge variant="secondary" className="mb-6">Get Started Free</Badge>

            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Create your professional invoice for free
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
              Build, download and share a professional PDF invoice in minutes. Start without creating an account or
              entering a credit card.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="#invoice-generator">
                <Button size="lg" className="w-full gap-2 sm:w-auto shadow-md shadow-primary/20">
                  Create Free Invoice
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Create a Free Account
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {[
                { icon: CheckCircle2, text: "No credit card required" },
                { icon: Shield, text: "Protected with HTTPS/TLS" },
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
