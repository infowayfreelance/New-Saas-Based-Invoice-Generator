import type { Metadata } from "next"
import Link from "next/link"
import { FeaturesFaqAccordion } from "./features-faq"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Users,
  BarChart3,
  RefreshCw,
  Send,
  CreditCard,
  Palette,
  Bell,
  Shield,
  Download,
  ArrowRight,
} from "lucide-react"

export const metadata: Metadata = {
  "title": "Invoice Generator Features: Templates, Payments",
  "description": "MakeInvo features: invoice builder, PDF export, saved clients, monthly recurring invoice rules, payment tracking and branding. Start with a free invoice.",
  "alternates": {
    "canonical": "https://makeinvo.com/features"
  },
  "openGraph": {
    "title": "Invoice Generator Features: Templates, Payments | MakeInvo",
    "description": "MakeInvo features: invoice builder, PDF export, saved clients, monthly recurring invoice rules, payment tracking and branding. Start with a free invoice.",
    "url": "https://makeinvo.com/features",
    "type": "website"
  },
  "twitter": {
    "card": "summary",
    "title": "Invoice Generator Features: Templates, Payments | MakeInvo",
    "description": "MakeInvo features: invoice builder, PDF export, saved clients, monthly recurring invoice rules, payment tracking and branding. Start with a free invoice."
  }
}

const faqs = [
  {
    "question": "Is MakeInvo free to use?",
    "answer": "You can start without a credit card. For what is included in each plan, see the pricing page, which always shows the current details."
  },
  {
    "question": "Can I create an invoice without signing up?",
    "answer": "Yes. You can build an invoice with the free invoice generator and download it as a PDF without creating an account. Create an account to save clients, keep an invoice history and manage recurring invoice rules."
  },
  {
    "question": "Can I add VAT to my invoices?",
    "answer": "Yes, you can add tax to your invoice lines. Only add VAT if you are VAT-registered; if you are not, leave it off. GOV.UK explains what a VAT invoice must show."
  },
  {
    "question": "Can I send invoices by email from MakeInvo?",
    "answer": "Download your invoice as a PDF and email it to your client yourself. Built-in email delivery is not currently available."
  },
  {
    "question": "How do recurring invoices work?",
    "answer": "For retainer clients you can create a monthly recurring invoice rule and choose a day of the month from 1 to 28. Download and send the resulting invoice yourself."
  },
  {
    "question": "Does MakeInvo send payment reminders?",
    "answer": "Automatic reminder sending is not currently available. Use invoice due dates and payment records to follow up with your clients yourself."
  },
  {
    "question": "Can I record part payments?",
    "answer": "Yes. You can record each payment with its amount, date and method, including part payments, so an invoice shows what has been paid and what is still owed."
  },
  {
    "question": "What should a UK invoice include?",
    "answer": "In general: your name or business name and address, your customer's name and address, a unique invoice number, the invoice date, a description of what you are charging for, the amount and any VAT. GOV.UK has the full list."
  }
]

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://makeinvo.com/features#app",
    "name": "MakeInvo Invoice Generator",
    "url": "https://makeinvo.com/",
    "description": "MakeInvo features: invoice builder, PDF export, saved clients, monthly recurring invoice rules, payment tracking and branding. Start with a free invoice.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "isAccessibleForFree": true,
    "featureList": [
      "Invoice generator with automatic totals",
      "Per-line tax",
      "PDF export",
      "Client database",
      "Recent invoice history by client",
      "Monthly recurring invoice rules",
      "Payment recording including part payments",
      "Templates, logo and brand colours"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GBP"
    },
    "provider": {
      "@id": "https://makeinvo.com/#organization"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://makeinvo.com/features#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is MakeInvo free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can start without a credit card. For what is included in each plan, see the pricing page, which always shows the current details."
        }
      },
      {
        "@type": "Question",
        "name": "Can I create an invoice without signing up?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You can build an invoice with the free invoice generator and download it as a PDF without creating an account. Create an account to save clients, keep an invoice history and manage recurring invoice rules."
        }
      },
      {
        "@type": "Question",
        "name": "Can I add VAT to my invoices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can add tax to your invoice lines. Only add VAT if you are VAT-registered; if you are not, leave it off. GOV.UK explains what a VAT invoice must show."
        }
      },
      {
        "@type": "Question",
        "name": "Can I send invoices by email from MakeInvo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Download your invoice as a PDF and email it to your client yourself. Built-in email delivery is not currently available."
        }
      },
      {
        "@type": "Question",
        "name": "How do recurring invoices work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For retainer clients you can create a monthly recurring invoice rule and choose a day of the month from 1 to 28. Download and send the resulting invoice yourself."
        }
      },
      {
        "@type": "Question",
        "name": "Does MakeInvo send payment reminders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Automatic reminder sending is not currently available. Use invoice due dates and payment records to follow up with your clients yourself."
        }
      },
      {
        "@type": "Question",
        "name": "Can I record part payments?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You can record each payment with its amount, date and method, including part payments, so an invoice shows what has been paid and what is still owed."
        }
      },
      {
        "@type": "Question",
        "name": "What should a UK invoice include?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In general: your name or business name and address, your customer's name and address, a unique invoice number, the invoice date, a description of what you are charging for, the amount and any VAT. GOV.UK has the full list."
        }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://makeinvo.com/features#breadcrumb",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://makeinvo.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Features",
        "item": "https://makeinvo.com/features"
      }
    ]
  }
]

const featureCategories = [
  {
    title: "Invoicing",
    description: "Create and manage professional invoices",
    features: [
      {
        icon: FileText,
        title: "Invoice Generator",
        description:
          "Create professional invoices with an intuitive builder. Add items, let MakeInvo calculate the totals, and customise the invoice to match your brand.",
      },
      {
        icon: Download,
        title: "PDF Export",
        description:
          "Download your invoices as high-quality PDF files ready to share with clients or keep for your records.",
      },
      {
        icon: Send,
        title: "Email Your PDF",
        description:
          "Download your invoice as a PDF and email it to your client yourself.",
      },
    ],
  },
  {
    title: "Client Management",
    description: "Keep your clients organised",
    features: [
      {
        icon: Users,
        title: "Client Database",
        description:
          "Store all your client information in one place. Quick access to contact details, addresses, and notes.",
      },
      {
        icon: FileText,
        title: "Invoice History",
        description: "View recent invoices for each client and check their status. Use dashboard date filters to review your activity.",
      },
    ],
  },
  {
    title: "Automation",
    description: "Save time with automated features",
    features: [
      {
        icon: RefreshCw,
        title: "Recurring Invoices",
        description:
          "Set up monthly invoice rules for retainer clients. Choose a day of the month from 1 to 28, then download and send the resulting invoices yourself.",
      },
      {
        icon: Bell,
        title: "Payment Follow-up",
        description:
          "Check invoice due dates and payment records, then follow up with clients yourself. Automatic reminder sending is not currently available.",
      },
    ],
  },
  {
    title: "Payment Tracking",
    description: "Track every payment",
    features: [
      {
        icon: CreditCard,
        title: "Payment Recording",
        description:
          "Record payments with amount, date, and method. Support for partial payments and multiple payment entries per invoice.",
      },
      {
        icon: BarChart3,
        title: "Financial Reports",
        description:
          "Review invoice counts, received payments and outstanding balances on your dashboard. Filter by date range and currency.",
      },
    ],
  },
  {
    title: "Customisation",
    description: "Make it yours",
    features: [
      {
        icon: Palette,
        title: "Templates & Branding",
        description:
          "Choose from multiple professional templates. Add your logo and signature image, set brand colours, and add watermark text.",
      },
      {
        icon: Shield,
        title: "Secure & Private",
        description:
          "Read how we protect your data on our Security page and in our Privacy Policy.",
      },
    ],
  },
]

const audiences = [["Freelancers", "freelancers"], ["Contractors", "contractors"], ["Consultants", "consultants"], ["Designers", "designers"], ["Photographers", "photographers"], ["Agencies", "agencies"], ["Small businesses", "small-businesses"], ["Tradespeople", "tradespeople"], ["Self-employed", "self-employed"]]

export default function FeaturesPage() {
  return (
    <>
      {schemas.map((schema) => <script key={schema["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />)}
      <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Invoicing Features for Freelancers and Small Businesses
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Create PDF invoices to send to clients, set up monthly invoice rules, and keep your clients and payment records in one place.
          </p>
        </div>
        <div className="mt-20 space-y-20">
          {featureCategories.map((category) => (
            <div key={category.title}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold">{category.title}</h2>
                <p className="mt-1 text-muted-foreground">{category.description}</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.features.map((feature) => (
                  <Card key={feature.title} className="border-border/50">
                    <CardHeader>
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">{feature.title === "Secure & Private" ? <>Read how we protect your data on our <Link href="/security">Security</Link> page and in our <Link href="/privacy">Privacy Policy</Link>.</> : feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 space-y-20">
          <section>
            <div className="mb-8"><h2 className="text-2xl font-bold">How MakeInvo Works</h2></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[{ title: "Build your invoice.", text: "Add your details, your client, your line items and any tax, then choose a template." }, { title: "Send it.", text: "Download the PDF and email the invoice to your client yourself." }, { title: "Get paid and track it.", text: "Record payments as they arrive, and use due dates and dashboard totals to keep on top of what is owed." }].map((step) => <Card key={step.title} className="border-border/50"><CardHeader><CardTitle className="text-lg">{step.title}</CardTitle></CardHeader><CardContent><p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p></CardContent></Card>)}
            </div>
          </section>
          <section>
            <div className="mb-8"><h2 className="text-2xl font-bold">Invoicing Features That Fit the UK</h2></div>
            <p className="text-sm leading-relaxed text-muted-foreground">A UK invoice has to show certain details, and VAT is only added if you're registered. MakeInvo's invoice builder has fields for the details clients expect, and you can add tax to each line. Check <a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include">what a UK invoice must include</a> and whether you need to <a href="https://www.gov.uk/vat-registration">register for VAT</a> before you start charging it. If a client pays late, GOV.UK explains your rights on <a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery">late commercial payments and interest</a>. Use your invoice due dates and payment records to plan your follow-up.</p>
          </section>
          <section>
            <div className="mb-8"><h2 className="text-2xl font-bold">Features for the Way You Work</h2><p className="mt-1 text-muted-foreground">Each type of business invoices a little differently. Explore invoicing guidance for the way you work.</p></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{audiences.map(([label, slug]) => <Card key={slug} className="border-border/50"><CardHeader><CardTitle className="text-lg"><Link href={`/invoice-generator-for-${slug}`}>{label}</Link></CardTitle></CardHeader></Card>)}</div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Prefer to start from a layout? Browse the <Link href="/invoice-templates">invoice templates</Link>.</p>
          </section>
          <section>
            <div className="mb-8"><h2 className="text-2xl font-bold">Invoicing Features FAQs</h2></div>
            <FeaturesFaqAccordion faqs={faqs} keepAnswersMounted />
          </section>
        </div>
        <div className="mt-20 rounded-2xl border border-border bg-muted/30 p-8 text-center md:p-12">
          <h2 className="text-balance text-2xl font-bold sm:text-3xl">Ready to get started?</h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Create your first invoice today. No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                Create Free Invoice
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
      </div>
    </div>
    </>
  )
}
