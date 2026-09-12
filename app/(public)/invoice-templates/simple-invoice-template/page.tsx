import type { Metadata } from "next"
import Link from "next/link"
import { getSiteUrl } from "@/lib/utils/site-url"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TemplateThumbnail } from "@/components/templates/template-thumbnail"
import { ArrowRight, ListChecks, Zap, Eye, Clock3, Users } from "lucide-react"

const siteUrl = getSiteUrl()
const pageUrl = `${siteUrl}/invoice-templates/simple-invoice-template`

export const metadata: Metadata = {
  title: "Simple Invoice Template | Create & Customize Online",
  description:
    "Use a simple invoice template to create clear, professional invoices online. Add your business, client and payment details, then customize and download your invoice.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Simple Invoice Template | Create & Customize Online | MakeInvo",
    description:
      "Use a simple invoice template to create clear, professional invoices online. Add your business, client and payment details, then customize and download your invoice.",
    url: pageUrl,
    type: "website",
  },
  robots: { index: true, follow: true },
}

// Data-driven so more Simple Invoice Template variations can be added
// later (e.g. "Simple Bold") without changing the page structure above.
interface SimpleTemplateVariant {
  name: string
  description: string
}

const variants: SimpleTemplateVariant[] = [
  {
    name: "Simple Classic",
    description: "A straightforward single-column layout with your details, line items and total, top to bottom.",
  },
  {
    name: "Simple Modern",
    description: "The same clean structure with a bit more spacing and a bolder header for extra clarity.",
  },
  {
    name: "Simple Minimal",
    description: "A pared-back version with only the essential fields, ideal for quick, no-frills invoices.",
  },
]

const invoiceFields = [
  "Business name and contact details",
  "Client name and contact details",
  "A unique invoice number",
  "Invoice date",
  "Payment due date",
  "Services or products provided",
  "Quantity or hours worked",
  "Rate per item, hour or unit",
  "Subtotal",
  "Tax, where applicable",
  "Total amount due",
  "Payment terms",
]

const bestForItems = [
  {
    title: "Freelancers",
    description: "Quick, clear invoices for project or hourly work.",
    href: "/invoice-generator-for-freelancers",
  },
  {
    title: "Self-employed",
    description: "Simple billing under your own name or a trading name.",
    href: "/invoice-generator-for-self-employed",
  },
  {
    title: "Contractors",
    description: "Straightforward invoices for completed jobs.",
    href: "/invoice-generator-for-contractors",
  },
  {
    title: "Small businesses",
    description: "Consistent invoices without unnecessary detail.",
    href: "/invoice-generator-for-small-businesses",
  },
  {
    title: "Service providers",
    description: "Clear billing for services rendered.",
    href: "/invoice-generator-for-small-businesses",
  },
]

const benefits = [
  {
    icon: Eye,
    title: "Easy to read",
    description: "A clean layout means clients can see what they owe and why, at a glance.",
  },
  {
    icon: Zap,
    title: "Faster to complete",
    description: "Fewer sections to fill in means less time spent creating each invoice.",
  },
  {
    icon: ListChecks,
    title: "Professional appearance",
    description: "A tidy, consistent structure looks professional without extra design work.",
  },
  {
    icon: Clock3,
    title: "Clear payment information",
    description: "Totals and payment terms are easy to find, reducing back-and-forth with clients.",
  },
  {
    icon: Users,
    title: "Suits many business types",
    description: "The same simple structure works whether you bill by the hour, the project or the item.",
  },
]

const faqs = [
  {
    question: "What is a simple invoice template?",
    answer:
      "A simple invoice template is a clean, no-frills invoice layout that includes only the essential billing fields - business and client details, line items, and the total due.",
  },
  {
    question: "Can I customize a simple invoice template?",
    answer:
      "Yes. You can add your own business details, client information, line items, tax and payment terms before creating your invoice with MakeInvo.",
  },
  {
    question: "Is a simple invoice suitable for freelancers?",
    answer:
      "Yes. A simple invoice works well for freelancers, contractors and self-employed workers who want a quick, professional invoice without extra detail.",
  },
  {
    question: "What details should I include on the invoice?",
    answer:
      "At minimum: your business and client details, an invoice number, dates, a description of the work, quantities or hours, rates, subtotal, tax where applicable, and the total due. Requirements can vary by country and business type.",
  },
  {
    question: "Can I download my completed invoice as PDF?",
    answer: "Yes. Once you've filled in your details, you can create the invoice and download it as a PDF directly from MakeInvo.",
  },
]

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Invoice Templates", item: `${siteUrl}/invoice-templates` },
        { "@type": "ListItem", position: 3, name: "Simple Invoice Template", item: pageUrl },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
}

export default function SimpleInvoiceTemplatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />

      {/* Breadcrumbs */}
      <div className="border-b border-border px-4 py-3 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/invoice-templates" className="hover:text-foreground hover:underline">
            Invoice Templates
          </Link>
          <span className="mx-2">/</span>
          <span aria-current="page">Simple Invoice Template</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Simple Invoice Template
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Create a clear, professional invoice with a simple invoice template. Add your business, client
            and payment details, then customize and download your invoice with MakeInvo.
          </p>
          <div className="mt-8">
            <Link href="/#invoice-generator">
              <Button size="lg" className="gap-2 shadow-md shadow-primary/20">
                Use Simple Invoice Template
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Template variations */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {variants.map((variant) => (
              <Card key={variant.name} className="flex flex-col overflow-hidden border-border/50 bg-card/50">
                <div className="p-4 pb-0">
                  <TemplateThumbnail name={variant.name} />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{variant.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <CardDescription className="flex-1 text-sm leading-relaxed">
                    {variant.description}
                  </CardDescription>
                  <Link href="/#invoice-generator" className="mt-4">
                    <Button className="w-full gap-2">
                      Use Template
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What is a simple invoice template */}
      <section className="border-y border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            What Is a Simple Invoice Template?
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            A simple invoice template is a clean invoice layout focused on the essential billing information -
            who's billing whom, for what, and how much is due - without extra sections you don't need.
          </p>
        </div>
      </section>

      {/* What should a simple invoice include */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            What Should a Simple Invoice Include?
          </h2>
          <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {invoiceFields.map((field) => (
              <li key={field} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{field}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
            Exact invoice requirements can vary by country, business type and tax status. MakeInvo provides
            invoice-creation software, not legal, tax or accounting advice.
          </p>
        </div>
      </section>

      {/* How to use */}
      <section className="border-y border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            How to Use a Simple Invoice Template
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { title: "Choose a template", description: "Pick the simple invoice variation you prefer." },
              { title: "Add your details", description: "Fill in your business, client and billing information." },
              {
                title: "Review and download",
                description: "Check the invoice, then create and download it as a PDF.",
              },
            ].map((step, index) => (
              <div key={step.title}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/#invoice-generator">
              <Button size="lg" className="gap-2">
                Create a Free Invoice
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who is it best for */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Who Is a Simple Invoice Template Best For?
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            A simple layout suits anyone who wants to invoice quickly without extra fields to fill in:
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {bestForItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose a simple layout */}
      <section className="border-y border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Why Choose a Simple Invoice Layout?
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <benefit.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-8 space-y-4">
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

      {/* Final CTA */}
      <section className="border-t border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-14 text-center">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Create your simple invoice
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
              Add your details and download a clear, professional PDF invoice in minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/#invoice-generator" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 shadow-md shadow-primary/20 sm:w-auto">
                  Use Simple Invoice Template
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/invoice-templates" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full bg-transparent sm:w-auto">
                  Browse All Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
