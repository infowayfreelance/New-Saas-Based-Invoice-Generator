import type { Metadata } from "next"
import Link from "next/link"
import { getSiteUrl } from "@/lib/utils/site-url"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ListChecks, FileText, LayoutTemplate, Sparkles, Clock } from "lucide-react"
import { TemplateThumbnail } from "@/components/templates/template-thumbnail"

const siteUrl = getSiteUrl()
const pageUrl = `${siteUrl}/invoice-templates`

export const metadata: Metadata = {
  title: "Free Invoice Templates | Professional Templates",
  description:
    "Choose free invoice templates for freelancers, contractors and businesses. Customize your invoice, add your details and create a professional invoice online.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Free Invoice Templates | Professional Templates | MakeInvo",
    description:
      "Choose free invoice templates for freelancers, contractors and businesses. Customize your invoice, add your details and create a professional invoice online.",
    url: pageUrl,
    type: "website",
  },
  robots: { index: true, follow: true },
}

interface TemplateCard {
  // A stable slug for each template category. Used as a link once a
  // dedicated /invoice-templates/<slug> page exists (see `href` below);
  // reserved on the rest so this grid doesn't need restructuring later.
  slug: string
  name: string
  description: string
  // Only set once a dedicated page for this template exists. Falls back
  // to the invoice generator so there's never a broken/premature link.
  href?: string
}

const templates: TemplateCard[] = [
  {
    slug: "free-invoice-template",
    name: "Free Invoice Template",
    description: "A no-cost invoice layout ready to fill in with your business and client details.",
  },
  {
    slug: "simple-invoice-template",
    name: "Simple Invoice Template",
    description: "A clean, minimal layout that keeps the focus on what matters: the details and the amount due.",
    href: "/invoice-templates/simple-invoice-template",
  },
  {
    slug: "blank-invoice-template",
    name: "Blank Invoice Template",
    description: "A blank starting point you build up field by field, for full control over every line.",
  },
  {
    slug: "professional-invoice-template",
    name: "Professional Invoice Template",
    description: "A polished, branded layout for businesses that want a more formal, corporate look.",
  },
  {
    slug: "freelance-invoice-template",
    name: "Freelance Invoice Template",
    description: "Built for freelancers billing by project or milestone, with space for clear payment terms.",
  },
  {
    slug: "self-employed-invoice-template",
    name: "Self-Employed Invoice Template",
    description: "Suited to sole traders and independent workers invoicing under their own or a trading name.",
  },
  {
    slug: "contractor-invoice-template",
    name: "Contractor Invoice Template",
    description: "Designed for labour and materials billing, with room for job details and call-out charges.",
  },
  {
    slug: "small-business-invoice-template",
    name: "Small Business Invoice Template",
    description: "A straightforward layout for small businesses billing regular or one-off customers.",
  },
  {
    slug: "service-invoice-template",
    name: "Service Invoice Template",
    description: "Focused on billing for services rendered, with clear space for descriptions, hours and rates.",
  },
  {
    slug: "consulting-invoice-template",
    name: "Consulting Invoice Template",
    description: "Set up for consultants billing by the hour, day rate or retainer, itemised by engagement.",
  },
]

const invoiceFields = [
  "Your business name and contact details",
  "Client name and contact details",
  "A unique invoice number",
  "Invoice date and payment due date",
  "A description of products or services",
  "Quantity or hours worked, and the rate",
  "Subtotal",
  "Tax, where applicable",
  "Discounts, where relevant",
  "Total amount due",
  "Payment terms and payment instructions",
]

const workUseCases = [
  {
    title: "Freelancers",
    description: "Billing clients per project, milestone or hour.",
    href: "/invoice-generator-for-freelancers",
  },
  {
    title: "Contractors",
    description: "Invoicing for labour, materials and completed jobs.",
    href: "/invoice-generator-for-contractors",
  },
  {
    title: "Consultants",
    description: "Billing by day rate, retainer or engagement.",
    href: "/invoice-generator-for-consultants",
  },
  {
    title: "Service businesses",
    description: "Invoicing for ongoing or one-off services provided.",
    href: "/invoice-generator-for-small-businesses",
  },
  {
    title: "Small businesses",
    description: "Consistent, repeatable invoices for regular customers.",
    href: "/invoice-generator-for-small-businesses",
  },
  {
    title: "Self-employed",
    description: "Invoicing under your own name or a trading name.",
    href: "/invoice-generator-for-self-employed",
  },
]

const benefits = [
  {
    icon: LayoutTemplate,
    title: "Easy customization",
    description: "Add your business details, client information and line items directly into the layout.",
  },
  {
    icon: Sparkles,
    title: "Professional presentation",
    description: "Every template keeps a clear, well-organised structure so your invoices look consistent.",
  },
  {
    icon: ListChecks,
    title: "Clear invoice structure",
    description: "Line items, tax, discounts and totals are laid out so clients can review them at a glance.",
  },
  {
    icon: Clock,
    title: "Saves time",
    description: "Start from a ready layout instead of building an invoice from scratch each time.",
  },
  {
    icon: FileText,
    title: "Connected to MakeInvo's invoice generator",
    description: "Every template opens straight into MakeInvo's invoice creation workflow, ready to fill in.",
  },
]

const faqs = [
  {
    question: "What is an invoice template?",
    answer:
      "An invoice template is a pre-built layout with the standard fields an invoice needs - business and client details, line items, and totals - so you don't have to design one from scratch.",
  },
  {
    question: "Are MakeInvo invoice templates free?",
    answer:
      "Yes. You can use MakeInvo's invoice templates to create and download an invoice for free, with no signup required for guest invoices.",
  },
  {
    question: "Can I customize an invoice template?",
    answer:
      "Yes. You can add your own business details, client information, line items, tax and payment terms to any template before creating your invoice.",
  },
  {
    question: "What information should an invoice contain?",
    answer:
      "Most invoices include your business and client details, a unique invoice number, dates, a description of the work, quantities and rates, subtotal, tax, and the total due. Exact requirements can vary by country and business type.",
  },
  {
    question: "Which invoice template should I use?",
    answer:
      "Choose one that matches how you work - for example a freelance or consulting template for project-based billing, or a contractor or service template if you bill for labour and materials.",
  },
  {
    question: "Can I create and download an invoice online?",
    answer: "Yes. Once you've filled in a template with your details, you can create the invoice and download it as a PDF directly from MakeInvo.",
  },
]

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Invoice Templates", item: pageUrl },
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

export default function InvoiceTemplatesPage() {
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
          <span aria-current="page">Invoice Templates</span>
        </nav>
      </div>

      {/* Hero / intro */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Free Invoice Templates for Businesses &amp; Freelancers
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Pick a professional invoice template below, then add your business and client details to create
            your invoice with MakeInvo.
          </p>
          <p className="mt-3 text-pretty text-sm text-muted-foreground">
            Every template opens directly into MakeInvo's free invoice generator - no design work needed.
          </p>
        </div>
      </section>

      {/* Template grid */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.slug} className="flex flex-col overflow-hidden border-border/50 bg-card/50">
                <div className="p-4 pb-0">
                  <TemplateThumbnail name={template.name} />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <CardDescription className="flex-1 text-sm leading-relaxed">
                    {template.description}
                  </CardDescription>
                  <Link href={template.href || "/#invoice-generator"} className="mt-4">
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

      {/* Choose a template that fits */}
      <section className="border-y border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Choose an Invoice Template That Fits Your Business
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Different businesses need different invoice layouts. A freelancer billing a single project has
            different needs than a contractor itemising labour and materials, or a consultant billing a
            monthly retainer.
          </p>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            The templates above give you a starting point for each of these cases, with the right fields
            already in place. You can still customize any of them once you're in the invoice generator.
          </p>
        </div>
      </section>

      {/* What should an invoice include */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            What Should a Professional Invoice Include?
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Most professional invoices share the same core fields, regardless of industry:
          </p>
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
            How to Use a MakeInvo Invoice Template
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { title: "Choose a template", description: "Pick the layout that matches how you invoice." },
              {
                title: "Add your details",
                description: "Fill in your business, client and billing information.",
              },
              {
                title: "Create your invoice",
                description: "Review the invoice, then create and download it as a PDF.",
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

      {/* Templates for different types of work */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Invoice Templates for Different Types of Work
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Some templates are a better fit depending on how you work. Here's where to start:
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {workUseCases.map((item) => (
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

      {/* Why use MakeInvo */}
      <section className="border-y border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Why Use MakeInvo Invoice Templates?
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
              Ready to create your invoice?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
              Pick a template above, add your details, and download a professional invoice in minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/#invoice-generator" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 shadow-md shadow-primary/20 sm:w-auto">
                  Create a Free Invoice
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full bg-transparent sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
