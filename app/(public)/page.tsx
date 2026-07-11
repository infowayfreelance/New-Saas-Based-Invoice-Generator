import type { Metadata } from "next"
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
  Clock,
  Download,
  Smartphone,
  Check,
  X,
  Lock,
  Database,
  Globe,
  Building2,
  Briefcase,
  Hammer,
  Code2,
  Palette,
  Mail,
  Phone,
  MessageCircle,
  ListChecks,
  Layers,
  BadgeCheck,
  Hash,
  CalendarDays,
  CalendarClock,
  ScrollText,
  Receipt,
  Percent,
  StickyNote,
} from "lucide-react"

const siteUrl = getSiteUrl()

/* ── Metadata ────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Free Invoice Generator Online - Create Professional PDF Invoices | MakeInvo",
  description:
    "MakeInvo is a free online invoice generator and invoice maker for freelancers, contractors, and small businesses. Create a professional PDF invoice in under 60 seconds - no signup, no watermark.",
  keywords: [
    "free invoice generator",
    "invoice generator",
    "online invoice generator",
    "invoice maker",
    "free invoice maker",
    "invoice creator",
    "create invoice online",
    "PDF invoice generator",
    "invoice template",
    "tax invoice",
    "VAT invoice",
    "GST invoice",
    "freelancer invoice",
    "contractor invoice",
    "small business invoicing",
    "billing software",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Free Invoice Generator Online - Create Professional PDF Invoices | MakeInvo",
    description:
      "Create a professional PDF invoice in under 60 seconds with MakeInvo's free online invoice generator. No signup, no watermark, no credit card required.",
    url: siteUrl,
    siteName: "MakeInvo",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "MakeInvo - Free Online Invoice Generator",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator Online - Create Professional PDF Invoices | MakeInvo",
    description:
      "Create a professional PDF invoice in under 60 seconds with MakeInvo's free online invoice generator.",
    images: [`${siteUrl}/og-image.png`],
  },
}

/* ── Data ────────────────────────────────────────────────────────── */

const trustBadges = [
  { icon: Lock, label: "SSL Encrypted" },
  { icon: Shield, label: "GDPR-Minded Data Handling" },
  { icon: BadgeCheck, label: "No Credit Card Required" },
  { icon: Download, label: "Instant PDF Download" },
]

const audiences = [
  { icon: Code2, label: "Freelance Developers" },
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
    description:
      "Enter your business name, address, and contact information, then add your client's billing details - or select a saved client in seconds.",
  },
  {
    step: "2",
    title: "List your services or products",
    description:
      "Add line items with a description, quantity, unit price, and tax rate. MakeInvo calculates the subtotal, tax, discount, and total automatically.",
  },
  {
    step: "3",
    title: "Generate & download your invoice",
    description:
      "Click Generate Invoice to create a clean, professional invoice PDF instantly - ready to download, email, or share via a WhatsApp link.",
  },
  {
    step: "4",
    title: "Track the payment",
    description:
      "Mark the invoice as sent, paid, or overdue, and keep a running record of every invoice and payment in your dashboard.",
  },
]

const invoiceComponents = [
  {
    icon: Hash,
    title: "Invoice Number",
    description:
      "A unique invoice number (e.g. INV-2026-001) is the reference every accountant, client, and tax authority uses to track a specific transaction. MakeInvo generates a sequential invoice number automatically so numbering stays consistent and audit-ready.",
  },
  {
    icon: CalendarDays,
    title: "Issue Date",
    description:
      "The issue date records exactly when the invoice was created. It anchors your payment terms and is required for accurate bookkeeping and tax reporting in most jurisdictions.",
  },
  {
    icon: CalendarClock,
    title: "Due Date & Payment Terms",
    description:
      "The due date tells a client exactly when payment is expected. Common payment terms include Due on Receipt, Net 15, Net 30, and Net 60 - shorter terms tend to get paid faster.",
  },
  {
    icon: Building2,
    title: "Business & Client Information",
    description:
      "A complete invoice lists both parties in full: your business name, address, email, and (where applicable) tax ID, alongside your client's name, billing address, and contact details.",
  },
  {
    icon: ScrollText,
    title: "Line Items",
    description:
      "Each line item describes a service or product, its quantity, and unit price. Clear, itemized descriptions reduce payment disputes and make an invoice easy for a client to approve quickly.",
  },
  {
    icon: Percent,
    title: "Tax, VAT & GST",
    description:
      "Depending on your country, a tax invoice, VAT invoice, or GST invoice must show the applicable tax rate and amount separately from the subtotal. MakeInvo calculates this automatically per line item.",
  },
  {
    icon: Receipt,
    title: "Subtotal, Discount & Total",
    description:
      "The subtotal is the sum of all line items before tax. Any discount is applied next, and the total is the final amount a client owes - the number that matters most at a glance.",
  },
  {
    icon: StickyNote,
    title: "Notes & Terms",
    description:
      "Notes are a place for a thank-you message or delivery details; terms typically cover late fees, accepted payment methods, and your cancellation or refund policy.",
  },
]

const bestPractices = [
  "Use a sequential invoice number for every invoice - never reuse or skip numbers, since consistent numbering makes bookkeeping and tax filing far easier.",
  "Set a clear due date and payment terms on every invoice. Net 15 typically gets paid faster than Net 30 or Net 60.",
  "Itemize your services or products instead of billing a single lump sum - clients approve itemized invoices faster and dispute them less.",
  "Include your tax ID, VAT number, or GST number on every business invoice where your local tax rules require it.",
  "Send the invoice the same day work is completed. The longer you wait, the longer you typically wait to get paid.",
  "Always keep a PDF copy of every invoice you send, even after the client has paid - you'll need it for taxes and accounting.",
  "Use a professional invoice template with your logo and consistent branding - it signals credibility and speeds up trust with new clients.",
  "Follow up politely on overdue invoices as soon as the due date passes, rather than waiting weeks to send a reminder.",
]

const digitalBenefits = [
  { icon: Clock, text: "Save hours every week compared to manually formatting invoices in a spreadsheet or word processor." },
  { icon: Zap, text: "Get paid faster with a professional invoice template and a clear due date and payment terms." },
  { icon: Download, text: "Generate a polished invoice PDF instantly, ready to print, email, or share as a link." },
  { icon: RefreshCw, text: "Automate recurring invoices for retainers and subscriptions instead of recreating them by hand." },
  { icon: Smartphone, text: "Create or check an invoice from your phone, tablet, or laptop - MakeInvo works on any device." },
  { icon: BarChart3, text: "See exactly what's paid, pending, and overdue without digging through email threads or folders." },
]

const comparisonRows = [
  { feature: "Professional PDF invoice in seconds", makeinvo: true, spreadsheet: false, manual: false },
  { feature: "Automatic tax, VAT & GST calculations", makeinvo: true, spreadsheet: false, manual: false },
  { feature: "Sequential invoice numbering", makeinvo: true, spreadsheet: true, manual: false },
  { feature: "Client database & billing history", makeinvo: true, spreadsheet: false, manual: false },
  { feature: "Email & WhatsApp invoice delivery", makeinvo: true, spreadsheet: false, manual: false },
  { feature: "Real-time payment status tracking", makeinvo: true, spreadsheet: false, manual: false },
  { feature: "Recurring invoice automation", makeinvo: true, spreadsheet: false, manual: false },
  { feature: "Revenue & client analytics", makeinvo: true, spreadsheet: false, manual: false },
  { feature: "Consistent, professional invoice design", makeinvo: true, spreadsheet: false, manual: false },
  { feature: "Mobile-friendly access", makeinvo: true, spreadsheet: false, manual: false },
]

const faqs = [
  {
    question: "What is MakeInvo?",
    answer:
      "MakeInvo is a free online invoice generator that lets freelancers, contractors, agencies, and small businesses create, download, and send professional PDF invoices in under a minute - no design skills or accounting background required.",
  },
  {
    question: "Is MakeInvo really free to use?",
    answer:
      "Yes. You can create and download an invoice PDF with the free invoice generator without entering a credit card. Paid plans add features like unlimited invoices, email delivery, recurring billing, and analytics.",
  },
  {
    question: "Do I need to create an account to make an invoice?",
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
    question: "What is an invoice number and why does it matter?",
    answer:
      "An invoice number is a unique identifier assigned to each invoice, used to track payments and simplify accounting. MakeInvo assigns a sequential invoice number automatically so you never have to track it manually.",
  },
  {
    question: "What's the difference between the issue date and the due date?",
    answer:
      "The issue date is when the invoice is created; the due date is when payment is expected. Payment terms like Net 15 or Net 30 define the gap between the two dates.",
  },
  {
    question: "What payment terms should I use on an invoice?",
    answer:
      "Common payment terms include Due on Receipt, Net 15, Net 30, and Net 60. Shorter terms generally lead to faster payment, so many freelancers and small businesses default to Net 15 or Due on Receipt.",
  },
  {
    question: "Can I create a tax invoice, VAT invoice, or GST invoice?",
    answer:
      "Yes. MakeInvo calculates tax per line item and displays it separately from the subtotal, so you can produce a compliant tax invoice, VAT invoice, or GST invoice depending on your country's requirements.",
  },
  {
    question: "Is MakeInvo suitable for freelancer invoices?",
    answer:
      "Absolutely. MakeInvo was built with freelancers in mind - it covers everything a freelancer invoice needs: your business details, client information, itemized services, tax, and a clear due date.",
  },
  {
    question: "Can contractors use MakeInvo for invoicing?",
    answer:
      "Yes. Contractors can itemize labor, materials, and any additional charges on a single contractor invoice, apply tax where required, and track whether each job has been paid.",
  },
  {
    question: "Can agencies and consultants use this invoice generator?",
    answer:
      "Yes. Agencies and consultants use MakeInvo to bill retainers, project milestones, and hourly work, and to manage multiple clients' billing information from a single dashboard.",
  },
  {
    question: "What is the difference between an invoice generator, invoice maker, and invoice creator?",
    answer:
      "These terms are generally used interchangeably to describe a tool that creates invoices. MakeInvo functions as an invoice generator, invoice maker, and invoice creator all at once - one tool that builds a complete, professional invoice.",
  },
  {
    question: "Does MakeInvo support recurring invoices?",
    answer:
      "Yes, on paid plans. You can automate recurring invoices for monthly retainers, subscriptions, and repeat clients so invoices go out on schedule without manual re-entry.",
  },
  {
    question: "Can I track which invoices are paid or unpaid?",
    answer:
      "Yes. Your dashboard shows the real-time status of every invoice - draft, sent, paid, partially paid, or overdue - so you always know exactly where your billing stands.",
  },
  {
    question: "Are my invoices stored, or generated only in my browser?",
    answer:
      "Invoices created without an account are generated for that session and are not saved to your profile. Once you create a free account, your invoices, clients, and payment history are securely stored so you can access them anytime.",
  },
  {
    question: "How is my data protected?",
    answer:
      "All data is transmitted over encrypted HTTPS connections, and account data is stored with a reputable, security-audited database provider. We never sell your business or client information to third parties.",
  },
  {
    question: "Can I add my logo and brand colors to an invoice?",
    answer:
      "Yes, paid plans support custom branding, including your logo, on the invoice template, so every invoice you send looks consistent with your business identity.",
  },
  {
    question: "Does MakeInvo work on mobile devices?",
    answer:
      "Yes. MakeInvo is fully responsive and works on phones, tablets, and desktops, so you can create or check an invoice from anywhere, on any device.",
  },
  {
    question: "Do I need to install any software?",
    answer:
      "No. MakeInvo is entirely browser-based - there is nothing to download or install. You create and download your invoice PDF directly from any modern web browser.",
  },
  {
    question: "Can I use MakeInvo for international clients and multiple currencies?",
    answer:
      "Yes. You can select from a wide range of currencies when creating an invoice, making it straightforward to bill international clients in their local currency.",
  },
  {
    question: "Can I edit an invoice after it has been created?",
    answer:
      "Yes, if you're signed in. You can edit invoice details, line items, and client information at any time from your invoices dashboard before or after sending.",
  },
  {
    question: "What is the difference between an invoice and a receipt?",
    answer:
      "An invoice requests payment for goods or services before or after delivery, while a receipt confirms that payment has already been received. Invoices come first in the billing process; receipts come after.",
  },
  {
    question: "What is the difference between a quote and an invoice?",
    answer:
      "A quote (or estimate) proposes a price before work begins and is not a request for payment. An invoice is issued once work is delivered and formally requests payment by the due date.",
  },
  {
    question: "How many invoices can I create for free?",
    answer:
      "Guest users can create a limited number of invoices per day and per month without an account. Free registered accounts and paid plans include higher or unlimited invoice limits.",
  },
  {
    question: "Can I send an invoice directly to a client from MakeInvo?",
    answer:
      "Yes. Registered users can email an invoice directly to a client, or share a secure, no-login invoice link via WhatsApp so the client can view and download the PDF themselves.",
  },
  {
    question: "Is there a limit to how many line items I can add?",
    answer:
      "No. You can add as many line items as your invoice needs - MakeInvo automatically recalculates the subtotal, tax, and total as you add or remove items.",
  },
  {
    question: "Can I apply a discount to an invoice?",
    answer:
      "Yes. You can apply a flat discount amount to any invoice, and MakeInvo will recalculate the final total automatically before you generate the PDF.",
  },
  {
    question: "Does MakeInvo support recurring billing for subscriptions?",
    answer:
      "Yes. Paid plans let you set up recurring invoices on a monthly schedule, ideal for retainers, maintenance contracts, and subscription-based services.",
  },
  {
    question: "What invoice template does MakeInvo use?",
    answer:
      "MakeInvo uses a clean, modern invoice template designed for readability and professionalism, with clear sections for business details, client information, line items, totals, and notes.",
  },
  {
    question: "Can small businesses manage all their invoicing in MakeInvo?",
    answer:
      "Yes. Beyond generating invoices, small businesses can manage clients, track payments, automate recurring billing, and review revenue analytics from a single, centralized dashboard.",
  },
  {
    question: "Is my payment and billing data private?",
    answer:
      "Yes. Your invoices, client details, and payment records are only visible to your account and are never shared with other users or made public without your action, such as sharing an invoice link.",
  },
  {
    question: "Can I cancel or downgrade my plan at any time?",
    answer:
      "Yes. You can upgrade, downgrade, or cancel your MakeInvo subscription at any time from your account's subscription settings, with no long-term contract required.",
  },
]

/* ── JSON-LD Schemas ─────────────────────────────────────────────── */

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MakeInvo",
  url: siteUrl,
  description:
    "Free online invoice generator for freelancers, contractors, agencies, and small businesses. Create professional PDF invoices, manage clients, and track payments.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MakeInvo",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    "MakeInvo builds free, easy-to-use invoicing software for freelancers, contractors, agencies, and small businesses.",
  // TODO: add sameAs social profile URLs once available, e.g.
  // sameAs: ["https://twitter.com/makeinvo", "https://www.linkedin.com/company/makeinvo"],
}

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MakeInvo",
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
    "Free Invoice Generator",
    "PDF Invoice Download",
    "Client Management",
    "Email & WhatsApp Delivery",
    "Payment Tracking",
    "Recurring Invoices",
    "Analytics Dashboard",
  ],
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
              <span>Create a professional invoice in under 60 seconds</span>
            </div>

            {/* H1 */}
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              The Free Invoice Generator for{" "}
              <span className="text-primary">Freelancers &amp; Small Businesses</span>
            </h1>

            {/* Sub Heading */}
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              MakeInvo is a free online invoice generator, invoice maker, and invoice creator in one. Build a
              professional PDF invoice below right now - no signup, no watermark, no credit card required.
            </p>

            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • Free invoice templates included • Instant PDF download
            </p>
          </div>

          {/* The actual, working invoice generator - above the fold */}
          <div className="mx-auto mt-12 max-w-6xl">
            <EmbeddedInvoiceGenerator />
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

      {/* ── Trusted By ────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Trusted by professionals who bill for a living
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
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Why Choose MakeInvo</h2>
          <div className="mt-6 space-y-4 text-pretty leading-relaxed text-muted-foreground">
            <p>
              Most invoice generators either bury the actual tool behind a signup wall, or hand you a generic
              template with no way to manage clients, track payments, or automate recurring billing. MakeInvo does
              both: a genuinely free invoice generator you can use right now on this page, plus a complete invoicing
              platform to grow into once you're ready for client management, payment tracking, and analytics.
            </p>
            <p>
              Whether you need a one-off freelancer invoice for a single project, a recurring contractor invoice for
              an ongoing job, or a fully itemized business invoice with tax, VAT, or GST calculated automatically,
              MakeInvo produces a clean, professional invoice PDF every time - built on a modern, mobile-friendly
              invoice template that looks the same whether your client opens it on a laptop or a phone.
            </p>
            <p>
              We built MakeInvo around three principles: speed (create an invoice in under a minute), clarity (an
              invoice design that's easy for your client to read and approve), and control (your data belongs to you
              - see our <a href="#security" className="text-primary hover:underline">Security &amp; Privacy</a>{" "}
              section below for exactly how it's handled).
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
            {[
              {
                icon: Code2,
                title: "Freelance Developers & Writers",
                description:
                  "Bill hourly or per-project work with a clean freelancer invoice that lists deliverables, hours, and rates clearly.",
              },
              {
                icon: Palette,
                title: "Designers & Creatives",
                description:
                  "Send a professional invoice for design work, revisions, and licensing fees with an invoice design that reflects your brand.",
              },
              {
                icon: Briefcase,
                title: "Consultants & Agencies",
                description:
                  "Bill retainers, milestones, and hourly consulting work, and manage every client's billing history in one place.",
              },
              {
                icon: Hammer,
                title: "Contractors & Tradespeople",
                description:
                  "Itemize labor and materials on a contractor invoice, apply tax where required, and track job payments to completion.",
              },
              {
                icon: Building2,
                title: "Small Business Owners",
                description:
                  "Replace ad-hoc spreadsheets with a proper business invoice, recurring billing, and a real payment tracking system.",
              },
              {
                icon: Users,
                title: "Solo Entrepreneurs",
                description:
                  "Look established from day one with a professional invoice template - no design software or accountant required.",
              },
            ].map((item) => (
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

      {/* ── Professional Invoice Examples ─────────────────────────── */}
      <section id="invoice-examples" className="scroll-mt-20 border-y border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Invoice Examples</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Professional invoice examples
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Every business needs a slightly different invoice. Here's how MakeInvo adapts to common invoice types.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Freelancer Invoice",
                description:
                  "A simple, itemized invoice for project-based or hourly freelance work, with your business details, a due date, and payment terms.",
              },
              {
                title: "Contractor Invoice",
                description:
                  "Separates labor and materials into clear line items, with tax applied per line where required by local regulations.",
              },
              {
                title: "Tax / VAT / GST Invoice",
                description:
                  "Displays the tax rate and tax amount separately from the subtotal, meeting the formatting most tax authorities expect.",
              },
              {
                title: "Recurring Invoice",
                description:
                  "A repeatable invoice template for retainers and subscriptions, generated automatically on a monthly schedule.",
              },
              {
                title: "Agency / Retainer Invoice",
                description:
                  "Bills a fixed monthly retainer or a set of project milestones, with an itemized breakdown of deliverables.",
              },
              {
                title: "International Invoice",
                description:
                  "Supports multiple currencies so you can bill clients abroad in their local currency with an accurate, clear total.",
              },
            ].map((example) => (
              <Card key={example.title} className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{example.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Professional Invoices Matter ──────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">Why It Matters</Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Why professional invoices matter
          </h2>
          <div className="mt-6 space-y-4 text-pretty leading-relaxed text-muted-foreground">
            <p>
              An invoice is more than a request for payment - it's a legal and financial record. A well-formatted
              business invoice protects you if a payment dispute ever arises, gives your client everything they
              need to pay you without asking follow-up questions, and creates the paper trail your accountant or tax
              authority will eventually ask for.
            </p>
            <p>
              First impressions matter too. A generic, inconsistent, or hand-written invoice can make even excellent
              work look unprofessional. A clean invoice design - consistent fonts, clear totals, your logo, and
              organized line items - signals that you run a serious business, which tends to translate directly into
              faster approvals and faster payments.
            </p>
            <p>
              Finally, professional invoicing is a habit that compounds. Consistent invoice numbering, predictable
              due dates, and a searchable invoice history make tax season, financial reporting, and cash-flow
              planning dramatically easier as your client list grows.
            </p>
          </div>
        </div>
      </section>

      {/* ── Complete Invoice Component Guide ──────────────────────── */}
      <section className="border-y border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Invoice Guide</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Complete invoice component guide
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Every field on a MakeInvo invoice template exists for a reason. Here's what each one means and why it
              belongs on a professional invoice.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {invoiceComponents.map((component) => (
              <div key={component.title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <component.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{component.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{component.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Want a deeper walkthrough? Read our guide on{" "}
            <Link href="/blog/how-to-write-an-invoice" className="text-primary hover:underline">
              how to write an invoice
            </Link>{" "}
            or our{" "}
            <Link href="/blog/vat-invoice-guide" className="text-primary hover:underline">
              VAT invoice guide
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── Best Practices ────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">Best Practices</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Best practices for creating invoices
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Small habits that lead to faster payments and cleaner books.
            </p>
          </div>
          <ul className="mt-12 space-y-4">
            {bestPractices.map((practice) => (
              <li key={practice} className="flex items-start gap-3">
                <ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-pretty leading-relaxed text-muted-foreground">{practice}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Benefits of Digital Invoicing ─────────────────────────── */}
      <section className="border-y border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Digital Invoicing</Badge>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Benefits of digital invoicing
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Moving from paper or word-processor invoices to a dedicated online invoice generator pays off almost
                immediately.
              </p>
              <ul className="mt-8 space-y-4">
                {digitalBenefits.map((benefit) => (
                  <li key={benefit.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <benefit.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <span className="font-semibold">From paper to platform</span>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Manual invoicing - a spreadsheet template, a word processor, or handwritten paper invoices - works
                  for a handful of clients. It breaks down fast once you're juggling recurring billing, partial
                  payments, and a growing client list.
                </p>
                <p>
                  Digital invoicing centralizes everything: every invoice, every client, and every payment in one
                  searchable place, with automatic calculations that remove the risk of manual math errors on a
                  tax invoice or a multi-item business invoice.
                </p>
                <p>
                  The result is fewer late payments, less time spent on admin, and a clear financial picture whenever
                  you need one - for a client question, a loan application, or tax season.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Security & Privacy ────────────────────────────────────── */}
      <section id="security" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">Security &amp; Privacy</Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Security &amp; privacy</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Invoices contain sensitive business and client information. Here's exactly how MakeInvo handles it.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Encrypted in transit</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Every connection to MakeInvo is secured with HTTPS/TLS encryption, so your business and client
                  data can't be intercepted while it travels between your browser and our servers.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Local vs. stored invoices</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Invoices created with the free generator without an account are processed for that session only
                  and are not saved to any profile. Once you register, your invoices, clients, and payment records
                  are securely stored in your account so you can return to them anytime.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Access controls</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Your invoices and client data are only accessible from your authenticated account. A shared
                  invoice link only exposes that one specific invoice - never your client list or dashboard.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">No selling of your data</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  We do not sell your business or client information to third parties. Full details are available in
                  our{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison Table ─────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Comparison</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              MakeInvo vs. manual invoice creation
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Spreadsheets and paper invoices work for a while - until they don't. Here's how a dedicated invoice
              generator compares.
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

      {/* ── About MakeInvo ────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">About Us</Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">About MakeInvo</h2>
          <div className="mt-6 space-y-4 text-pretty leading-relaxed text-muted-foreground">
            <p>
              MakeInvo was built to solve a specific problem: freelancers, contractors, and small business owners
              needed a fast, free way to create a professional invoice without learning accounting software or
              paying for tools they'd use a few times a month.
            </p>
            <p>
              What started as a simple free invoice generator has grown into a complete invoicing platform - client
              management, payment tracking, recurring billing, and analytics - while keeping the core promise
              intact: you can still create and download an invoice PDF on this page right now, for free, with no
              account required.
            </p>
            <p>
              We continue to build MakeInvo around real invoicing workflows, informed by feedback from the
              freelancers, agencies, and small businesses who use it every day to get paid.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact & Support ─────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">Contact &amp; Support</Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Questions? We're here to help
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Have a question about invoicing, billing, or your MakeInvo account? Reach out any time.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <Card className="border-border/50 bg-card/50 text-center">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">support@makeinvo.com</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 text-center">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Help Center</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">Browse guides on invoicing and billing</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 text-center">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Priority Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">Included with Standard &amp; Pro plans</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-16 text-center">
            <Badge variant="secondary" className="mb-6">Get Started Free</Badge>

            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Start creating professional invoices online for free
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
              Generate PDF invoices, manage clients, track payments, and automate billing with one simple online
              invoicing platform.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="#invoice-generator">
                <Button size="lg" className="w-full gap-2 sm:w-auto shadow-md shadow-primary/20">
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
              No credit card required • Free invoice generator • Trusted by freelancers and small businesses
              worldwide
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {[
                { icon: CheckCircle2, text: "Free invoice templates" },
                { icon: Shield, text: "Encrypted & secure" },
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
