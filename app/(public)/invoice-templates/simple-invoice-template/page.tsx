import type { Metadata } from "next"
import Link from "next/link"
import { getSiteUrl } from "@/lib/utils/site-url"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoicePreview } from "@/components/invoice/invoice-preview"
import { SIMPLE_INVOICE_TEMPLATES } from "@/lib/utils/simple-invoice-templates"
import type { InvoiceFormData } from "@/lib/utils/invoice"
import { ArrowRight, ListChecks, Zap, Eye, Clock3, Users } from "lucide-react"

const siteUrl = getSiteUrl()
const pageUrl = `${siteUrl}/invoice-templates/simple-invoice-template`

export const metadata: Metadata = {
  title: "Simple Invoice Template UK: Free PDF Invoice",
  description:
    "Free simple invoice template for UK freelancers and sole traders. Pick a clean layout, add your details (and VAT if registered), then download a PDF.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Simple Invoice Template UK: Free PDF Invoice | MakeInvo",
    description:
      "Free simple invoice template for UK freelancers and sole traders. Pick a clean layout, add your details (and VAT if registered), then download a PDF.",
    url: pageUrl,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Simple Invoice Template UK: Free PDF Invoice | MakeInvo", description: "Free simple invoice template for UK freelancers and sole traders. Pick a clean layout, add your details (and VAT if registered), then download a PDF." },
  robots: { index: true, follow: true },
}

// Fictional sample data used only to render a realistic preview of each
// template. The actual invoice generator (linked via "Use Template") starts
// from the user's own default invoice data - this sample never reaches it.
const sampleInvoiceData: Omit<InvoiceFormData, "layoutStyle"> = {
  fromName: "Harper & Co Design Studio",
  fromEmail: "hello@harperco.example",
  fromAddress: "14 Ashford Lane\nLondon, UK",
  clientName: "Bloom Retail Ltd",
  clientEmail: "accounts@bloomretail.example",
  clientAddress: "Unit 4, Riverside Business Park\nManchester, UK",
  invoiceNumber: "INV-1042",
  issueDate: "2025-01-06",
  dueDate: "2025-01-20",
  currency: "GBP",
  items: [
    { id: "1", description: "Brand identity design", quantity: 1, unitPrice: 850, taxRate: 20 },
    { id: "2", description: "Website homepage design", quantity: 1, unitPrice: 650, taxRate: 20 },
  ],
  terms: "Payment due within 14 days.",
  taxRate: 0,
  discountAmount: 0,
  bankDetails: "",
}

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
  "Supply date (the date the work or goods were provided), if it's different from the invoice date",
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
    "question": "What is a simple invoice template?",
    "answer": "A simple invoice template is a clean, no-frills invoice layout that includes only the essential billing fields - business and client details, line items, and the total due."
  },
  {
    "question": "Can I customise a simple invoice template?",
    "answer": "Yes. You can add your own business details, client information, line items, tax and payment terms before creating your invoice with MakeInvo."
  },
  {
    "question": "Is a simple invoice suitable for freelancers?",
    "answer": "Yes. A simple invoice works well for freelancers, contractors and self-employed workers who want a quick, professional invoice without extra detail."
  },
  {
    "question": "What details should I include on the invoice?",
    "answer": "At minimum: your business and client details, an invoice number, dates, a description of the work, quantities or hours, rates, subtotal, tax where applicable, and the total due. Requirements can vary by country and business type."
  },
  {
    "question": "Can I download my completed invoice as PDF?",
    "answer": "Yes. Once you've filled in your details, you can create the invoice and download it as a PDF directly from MakeInvo."
  },
  {
    "question": "Do I need to add VAT to a simple invoice?",
    "answer": "Only if you're VAT-registered. If you aren't, leave the tax at zero and don't show a VAT amount. If you are, you must charge VAT on taxable sales and show your VAT number and the VAT separately on the invoice; GOV.UK explains what a VAT invoice needs."
  },
  {
    "question": "Can I use a simple invoice template as a sole trader?",
    "answer": "Yes. GOV.UK says a sole trader's invoice must also show your name and any business name you use, and, if you trade under a business name, an address where legal documents can be delivered to you. Add these in the business details section."
  },
  {
    "question": "What invoice number should I use?",
    "answer": "Each invoice needs a unique identification number. Many businesses simply number invoices in order, for example INV-001, INV-002, so that no number is used twice and gaps are easy to spot."
  },
  {
    "question": "What payment terms should I put on a simple invoice?",
    "answer": "You can set your own terms, such as 14 or 30 days. If you haven't agreed a payment date, GOV.UK says the customer must pay within 30 days of receiving your invoice or the goods or service. Showing the due date and how to pay helps you get paid on time."
  }
]

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {"@context": "https://schema.org", "@type": "WebApplication", "@id": "https://makeinvo.com/invoice-templates/simple-invoice-template#app", "name": "MakeInvo Simple Invoice Template", "url": "https://makeinvo.com/invoice-templates/simple-invoice-template", "description": "Free simple invoice template for UK freelancers and sole traders. Pick a clean layout, add your details (and VAT if registered), then download a PDF.", "applicationCategory": "BusinessApplication", "operatingSystem": "Web", "isAccessibleForFree": true, "featureList": ["Business, client and line-item details", "Tax per line where applicable", "Automatic subtotal, tax and total", "Payment terms", "PDF download"], "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"}, "provider": {"@id": "https://makeinvo.com/#organization"}},
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
      "@id": `${pageUrl}#faq`,
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
            and payment details, then customise and download your invoice as a PDF with MakeInvo.
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
            {SIMPLE_INVOICE_TEMPLATES.map((variant) => (
              <Card key={variant.id} className="flex flex-col overflow-hidden border-border/50 bg-card/50">
                <div
                  className="h-64 overflow-hidden border-b border-border bg-muted/20 p-3"
                  role="img"
                  aria-label={`${variant.label} Invoice Template Preview`}
                >
                  <div className="pointer-events-none">
                    <InvoicePreview data={{ ...sampleInvoiceData, layoutStyle: variant.id }} />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{variant.label}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <CardDescription className="flex-1 text-sm leading-relaxed">
                    {variant.description}
                  </CardDescription>
                  <Link href={`/?layout=${variant.id}#invoice-generator`} className="mt-4">
                    <Button className="w-full gap-2">
                      Use Template
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Use the free invoice generator to add your business, client and payment details, then download a PDF.
            Keep a copy of your invoice details before leaving the generator.
          </p>
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

<section className="px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl"><h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{"Simple Invoices in the UK: Sole Traders and Limited Companies"}</h2><p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{"GOV.UK lists what an invoice "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include">{"must include"}</a>{": a unique invoice number, your business name, address and contact details, your customer's name and address, a clear description of what you're charging for, the supply date, the invoice date, the amounts charged, VAT if applicable, and the total owed. A simple template covers all of these. Two extra rules depend on how you trade:"}</p><ul className="mt-6 space-y-2 text-sm leading-relaxed text-muted-foreground"><li><strong>{"Sole traders"}</strong>{" must also show their own name and any business name they use and, if trading under a business name, an address where legal documents can be delivered."}</li><li><strong>{"Limited companies"}</strong>{" must show the full company name as it appears on the certificate of incorporation. If you list directors' names on your invoices, you must list all of them."}</li></ul></div></section>
<section className="px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl"><h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{"A Simple Invoice With or Without VAT"}</h2><ul className="mt-6 space-y-2 text-sm leading-relaxed text-muted-foreground"><li><strong>{"Not VAT-registered?"}</strong>{" Don't add VAT. Leave the tax rate at zero so no VAT amount appears. Some businesses add a short note such as \"Not VAT registered\" to avoid questions, but it isn't required."}</li><li><strong>{"VAT-registered?"}</strong>{" You must "}<a href="https://www.gov.uk/charge-reclaim-record-vat">{"charge VAT"}</a>{" on taxable sales, and your invoices must show your VAT number and the VAT separately. MakeInvo lets you add a tax rate to each line, so standard-rated and other items can sit on the same invoice. Check the current rates on GOV.UK before you invoice."}</li><li><strong>{"Not sure whether you need to register?"}</strong>{" GOV.UK explains "}<a href="https://www.gov.uk/register-for-vat">{"when you must register for VAT"}</a>{"."}</li></ul></div></section>
<section className="px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl"><h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{"Payment Terms on a Simple Invoice"}</h2><p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{"You can "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/payment-obligations">{"set your own payment terms"}</a>{", such as 14 or 30 days, or payment upfront. If you haven't agreed a date, the customer must pay within 30 days of getting your invoice or the goods or service. Put the due date and how to pay (for example your bank details) on the invoice so the client doesn't have to ask. If a business customer pays late, you have the right to "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery">{"charge interest on late commercial payments"}</a>{", though you can choose not to."}</p></div></section>
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

<section className="px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl"><h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{"Simple Invoice Templates by Type of Work"}</h2><p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{"The simple layout suits most service work. If your invoices need trade-specific lines, such as hours and day rates, materials, or retainers, start from a generator built for your work:"}</p><p className="mt-4 text-pretty leading-relaxed text-muted-foreground"><Link href="/invoice-generator-for-freelancers">{"Freelancers"}</Link>{" · "}<Link href="/invoice-generator-for-self-employed">{"Self-employed"}</Link>{" · "}<Link href="/invoice-generator-for-contractors">{"Contractors"}</Link>{" · "}<Link href="/invoice-generator-for-consultants">{"Consultants"}</Link>{" · "}<Link href="/invoice-generator-for-tradespeople">{"Tradespeople"}</Link>{" · "}<Link href="/invoice-generator-for-small-businesses">{"Small businesses"}</Link>{". Prefer a different look? Browse all "}<Link href="/invoice-templates">{"invoice templates"}</Link>{", or read our step-by-step guide on "}<Link href="/blog/how-to-make-an-invoice-online">{"how to make an invoice online"}</Link>{"."}</p></div></section>
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
                  {faq.question === "Do I need to add VAT to a simple invoice?" ? <>Only if you're VAT-registered. If you aren't, leave the tax at zero and don't show a VAT amount. If you are, you must charge VAT on taxable sales and show your VAT number and the VAT separately on the invoice; GOV.UK explains <a href="https://www.gov.uk/charge-reclaim-record-vat">what a VAT invoice needs</a>.</> : faq.question === "What payment terms should I put on a simple invoice?" ? <>You can set your own terms, such as 14 or 30 days. If you haven't agreed a payment date, <a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/payment-obligations">GOV.UK</a> says the customer must pay within 30 days of receiving your invoice or the goods or service. Showing the due date and how to pay helps you get paid on time.</> : faq.answer}
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
              Add your details and download a clear, professional PDF invoice.
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
