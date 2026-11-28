import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import Link from "next/link"
import type { ProfessionPageData } from "@/components/profession/types"
import { Building2, Users, Percent, CreditCard, Repeat, BarChart3 } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-small-businesses"

export const metadata: Metadata = {
  title: { absolute: "Free Invoice Generator for Small Businesses | MakeInvo" },
  description:
    "Create clear small-business invoices as PDFs: client details, line items, tax and totals. See what a UK invoice must include and what needs an account.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Free Invoice Generator for Small Businesses | MakeInvo",
    description:
      "Create clear small-business invoices as PDFs: client details, line items, tax and totals. See what a UK invoice must include and what needs an account.",
    url: `${siteUrl}/${slug}`,
    type: "website",
    locale: "en_GB",
    siteName: "MakeInvo",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Small business",
  seoTitle: "Free Invoice Generator for Small Businesses | MakeInvo",
  metaDescription: metadata.description as string,
  h1: "Invoice Generator for Small Businesses",
  heroParagraph:
    "Create consistent business invoices without managing complicated spreadsheets. MakeInvo helps small businesses bill clients, organise invoice records and keep track of outstanding payments.",
  heroSupportingLine: "Suitable for service businesses, local companies, small teams and growing operations.",
  invoicePreview: {
    fromName: "Greenway Office Services Ltd",
    fromLine: "Facilities & Support",
    clientName: "Camden Legal Partners",
    clientLine: "Account: CLP-11",
    invoiceNumber: "INV-0733",
    dueLabel: "30 days",
    items: [
      { description: "Monthly cleaning service", amount: "£480.00" },
      { description: "Additional service call", amount: "£75.00" },
      { description: "Supplies", meta: "Cleaning materials", amount: "£38.00" },
    ],
    subtotal: "£593.00",
    discount: "-£25.00",
    tax: "£113.60",
    total: "£681.60",
  },
  invoicePreviewAlt:
    "Example small business invoice showing a monthly service, an additional service call, supplies, a discount and tax",

  problemsHeading: "Small-business invoicing needs to stay simple as sales grow",
  problems: [
    "Re-entering the same client details on every invoice",
    "Invoice numbers that lose consistency over time",
    "Manual calculation errors on totals and tax",
    "Losing track of which invoices are paid and which aren't",
    "Repeat billing for the same customers",
    "Billing customers in different currencies",
    "Preparing clean records for bookkeeping",
  ],
  solutionsHeading: "Create consistent invoices from one place",
  solutions: [
    "Save client details with an eligible paid plan, so repeat customers don't need retyping.",
    "Keep invoice numbers sequential and consistent using your invoice records.",
    "Let totals, discounts and tax calculate themselves as you add line items.",
    "See which invoices are paid, unpaid or overdue from one dashboard.",
    "Set up recurring invoices for regular customers on paid plans.",
    "Bill in different currencies where a customer needs it.",
    "Keep a clear invoice history ready for your bookkeeping.",
  ],

  infoHeading: "What to include on a small-business invoice",
  infoItems: [
    "Your legal or trading name",
    "Your business contact details",
    "Registration or tax details, where required",
    "The client's details",
    "A unique invoice number",
    "The issue and due dates",
    "The date the goods or service were supplied",
    "Product or service descriptions",
    "Quantities and prices",
    "Tax, where applicable",
    "Any discounts",
    "The total due",
    "Payment instructions and terms",
  ],

  workflowHeading: "Create and organise business invoices",
  workflowSteps: [
    { title: "Add your business", description: "Add your business and customer details." },
    { title: "List the charges", description: "Add products or services, quantities and prices." },
    { title: "Check totals", description: "Review tax, discounts and the final total." },
    { title: "Download and track", description: "Download the PDF and track payment status." },
  ],

  featuresHeading: "Everything a growing business needs to invoice",
  features: [
    { icon: Building2, title: "Professional invoice creation", description: "Create clean, consistent invoices for every customer." },
    { icon: Users, title: "Client management", description: "Save customer details with an eligible paid plan and reuse them on future invoices." },
    { icon: Percent, title: "Automatic calculations", description: "Tax, discounts and totals are calculated automatically as you build the invoice." },
    { icon: Repeat, title: "Recurring billing", description: "Automate invoices for regular customers on a set schedule.", paidPlan: true },
    { icon: CreditCard, title: "Payment tracking", description: "See which invoices are paid, unpaid or overdue at a glance.", paidPlan: true },
    { icon: BarChart3, title: "Business reports", description: "Review revenue and outstanding balances across your customer base.", paidPlan: true },
  ],

  bestPracticesHeading: "Build a reliable invoicing routine",
  bestPractices: [
    "Invoice promptly rather than letting completed work pile up.",
    "Use sequential invoice numbers rather than reusing or skipping numbers.",
    "Keep your business details consistent across every invoice.",
    "Check your local tax requirements for the products or services you sell.",
    "Set clear payment terms so customers know exactly when payment is due.",
    "Reconcile recorded payments against your bank statements regularly.",
    "Keep invoice records and supporting documents for your accounts.",
    "Follow up on overdue invoices professionally and promptly.",
  ],

  faqs: [
  {
    "question": "Is MakeInvo suitable for a small business?",
    "answer": "Yes. MakeInvo covers the essentials most small businesses need - professional invoices, saved customers, tax and discounts, and payment tracking - without the overhead of full accounting software."
  },
  {
    "question": "Can I save customer details?",
    "answer": "Yes, with a Standard or Pro account - saved customers can be selected on future invoices instead of retyping their details."
  },
  {
    "question": "Can I track paid and unpaid invoices?",
    "answer": "Yes, once you're signed in - your dashboard shows the status of every invoice you've created."
  },
  {
    "question": "Can I create recurring invoices?",
    "answer": "Yes, on paid plans - useful for customers you bill on a regular schedule."
  },
  {
    "question": "Can I add my business logo?",
    "answer": "Yes. Click Add Logo in the generator and your logo appears on the invoice and the PDF."
  },
  {
    "question": "Does MakeInvo replace an accountant?",
    "answer": "No. MakeInvo is invoice-creation software, not an accounting or tax adviser - it does not replace professional accounting or tax advice for your business."
  },
  {
    "question": "What must a small-business invoice include in the UK?",
    "answer": "GOV.UK says an invoice must include a unique identification number, your company name, address and contact information, the company name and address of the customer you're invoicing, a clear description of what you're charging for, the date the goods or service were provided (supply date), the date of the invoice, the amount or amounts being charged, the VAT amount if applicable and the total amount owed (GOV.UK).",
    "answerLinks": [
      {
        "label": "GOV.UK",
        "href": "https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include"
      }
    ]
  },
  {
    "question": "What changes on the invoice for a sole trader or a limited company?",
    "answer": "A sole trader's invoice must also include their name and any business name being used, plus an address where legal documents can be delivered if they use a business name. A limited company must include its full company name as it appears on the certificate of incorporation, and if it puts directors' names on invoices it must include the names of all directors (GOV.UK).",
    "answerLinks": [
      {
        "label": "GOV.UK",
        "href": "https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include"
      }
    ]
  },
  {
    "question": "What is the supply date and why is it different from the invoice date?",
    "answer": "The supply date is the date the goods or service were provided; the invoice date is the date you issue the invoice. They can be the same day or different, and GOV.UK lists both as required details, so put both on the invoice."
  },
  {
    "question": "Do I have to charge VAT on a small-business invoice?",
    "answer": "Only if you are VAT registered. In the UK you must register if your taxable turnover for the last 12 months goes over £90,000, or you expect it to in the next 30 days (GOV.UK). If you're not registered, don't add VAT. If you and your customer are both VAT registered, you must use a VAT invoice, which includes more information.",
    "answerLinks": [
      {
        "label": "GOV.UK",
        "href": "https://www.gov.uk/vat-registration"
      }
    ]
  },
  {
    "question": "How long should a small business keep its invoices?",
    "answer": "Sole traders and partners must keep records of business income and expenses for their Self Assessment tax return (GOV.UK); limited companies follow different rules (GOV.UK). Check how long you must keep records for your situation, and keep a copy of every invoice you issue.",
    "answerLinks": [
      {
        "label": "GOV.UK",
        "href": "https://www.gov.uk/self-employed-records"
      },
      {
        "label": "GOV.UK",
        "href": "https://www.gov.uk/running-a-limited-company/company-and-accounting-records"
      }
    ]
  },
  {
    "question": "What happens if a customer pays late?",
    "answer": "If no payment date was agreed for a business sale, the law treats payment as late 30 days after the customer gets the invoice or you deliver the goods or service, whichever is later (GOV.UK). Agree clear payment terms before you start and put them on every invoice.",
    "answerLinks": [
      {
        "label": "GOV.UK",
        "href": "https://www.gov.uk/late-commercial-payments-interest-debt-recovery"
      }
    ]
  },
  {
    "question": "What is free in the invoice generator and what needs an account?",
    "answer": "You can create an invoice, add a logo, calculate tax and discounts, and download a PDF without signing up. An account gives you invoice history and a dashboard showing invoice status. Saved customers and payment tracking need Standard or Pro; recurring invoices and business reports need Pro. Download the PDF and email it yourself; built-in email delivery is not currently available. See pricing and features.",
    "answerLinks": [
      {
        "label": "pricing",
        "href": "/pricing"
      },
      {
        "label": "features",
        "href": "/features"
      }
    ]
  },
  {
    "question": "Does MakeInvo give legal, tax or accounting advice?",
    "answer": "Exact invoice requirements can vary by country, business type and tax status. MakeInvo provides invoice-creation software, not legal, tax or accounting advice. For advice on your own situation, speak to a qualified accountant or HMRC."
  }
],

  finalCtaHeading: "Start creating better business invoices",
  finalCtaText: "Add your products or services, then download a clear, professional PDF invoice for every customer.",

  relatedLinks: [
    { href: "/blog/how-to-make-an-invoice-online", label: "How to make an invoice online" },
    { href: "/invoice-templates", label: "Invoice templates" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#invoice-examples", label: "Invoice Examples" },
  ],
  crossLinks: [
    { href: "/invoice-generator-for-contractors", label: "Invoice generator for contractors" },
    { href: "/invoice-generator-for-agencies", label: "Invoice generator for agencies" },
    { href: "/invoice-generator-for-tradespeople", label: "Invoice generator for tradespeople" },
  ],
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://makeinvo.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Invoice Generator for Small Businesses",
          "item": "https://makeinvo.com/invoice-generator-for-small-businesses"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://makeinvo.com/invoice-generator-for-small-businesses#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is MakeInvo suitable for a small business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. MakeInvo covers the essentials most small businesses need - professional invoices, saved customers, tax and discounts, and payment tracking - without the overhead of full accounting software."
          }
        },
        {
          "@type": "Question",
          "name": "Can I save customer details?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, with a Standard or Pro account - saved customers can be selected on future invoices instead of retyping their details."
          }
        },
        {
          "@type": "Question",
          "name": "Can I track paid and unpaid invoices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, once you're signed in - your dashboard shows the status of every invoice you've created."
          }
        },
        {
          "@type": "Question",
          "name": "Can I create recurring invoices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, on paid plans - useful for customers you bill on a regular schedule."
          }
        },
        {
          "@type": "Question",
          "name": "Can I add my business logo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Click Add Logo in the generator and your logo appears on the invoice and the PDF."
          }
        },
        {
          "@type": "Question",
          "name": "Does MakeInvo replace an accountant?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. MakeInvo is invoice-creation software, not an accounting or tax adviser - it does not replace professional accounting or tax advice for your business."
          }
        },
        {
          "@type": "Question",
          "name": "What must a small-business invoice include in the UK?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GOV.UK says an invoice must include a unique identification number, your company name, address and contact information, the company name and address of the customer you're invoicing, a clear description of what you're charging for, the date the goods or service were provided (supply date), the date of the invoice, the amount or amounts being charged, the VAT amount if applicable and the total amount owed (GOV.UK)."
          }
        },
        {
          "@type": "Question",
          "name": "What changes on the invoice for a sole trader or a limited company?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A sole trader's invoice must also include their name and any business name being used, plus an address where legal documents can be delivered if they use a business name. A limited company must include its full company name as it appears on the certificate of incorporation, and if it puts directors' names on invoices it must include the names of all directors (GOV.UK)."
          }
        },
        {
          "@type": "Question",
          "name": "What is the supply date and why is it different from the invoice date?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The supply date is the date the goods or service were provided; the invoice date is the date you issue the invoice. They can be the same day or different, and GOV.UK lists both as required details, so put both on the invoice."
          }
        },
        {
          "@type": "Question",
          "name": "Do I have to charge VAT on a small-business invoice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Only if you are VAT registered. In the UK you must register if your taxable turnover for the last 12 months goes over £90,000, or you expect it to in the next 30 days (GOV.UK). If you're not registered, don't add VAT. If you and your customer are both VAT registered, you must use a VAT invoice, which includes more information."
          }
        },
        {
          "@type": "Question",
          "name": "How long should a small business keep its invoices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sole traders and partners must keep records of business income and expenses for their Self Assessment tax return (GOV.UK); limited companies follow different rules (GOV.UK). Check how long you must keep records for your situation, and keep a copy of every invoice you issue."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if a customer pays late?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If no payment date was agreed for a business sale, the law treats payment as late 30 days after the customer gets the invoice or you deliver the goods or service, whichever is later (GOV.UK). Agree clear payment terms before you start and put them on every invoice."
          }
        },
        {
          "@type": "Question",
          "name": "What is free in the invoice generator and what needs an account?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can create an invoice, add a logo, calculate tax and discounts, and download a PDF without signing up. An account gives you invoice history and a dashboard showing invoice status. Saved customers and payment tracking need Standard or Pro; recurring invoices and business reports need Pro. Download the PDF and email it yourself; built-in email delivery is not currently available. See pricing and features."
          }
        },
        {
          "@type": "Question",
          "name": "Does MakeInvo give legal, tax or accounting advice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Exact invoice requirements can vary by country, business type and tax status. MakeInvo provides invoice-creation software, not legal, tax or accounting advice. For advice on your own situation, speak to a qualified accountant or HMRC."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": "https://makeinvo.com/invoice-generator-for-small-businesses#app",
      "name": "MakeInvo Invoice Generator for Small Businesses",
      "url": "https://makeinvo.com/invoice-generator-for-small-businesses",
      "description": "Create small-business invoices online with business and client details, line items, tax and discounts, and download a PDF. Save clients and track payments with an eligible paid account.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript. Works in modern browsers.",
      "featureList": [
        "Create invoices with your business and client details",
        "Line items with quantities and prices",
        "Tax, discount and total calculations",
        "PDF download",
        "Saved clients with a Standard or Pro account",
        "Payment status tracking",
        "Recurring invoices on paid plans"
      ],
      "provider": {
        "@type": "Organization",
        "name": "MakeInvo",
        "url": "https://makeinvo.com"
      }
    }
  ]
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <ProfessionEditorialLanding
        data={data}
        ukSmallBusinesses
        afterInvoiceDetails={<><section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">Sole Trader or Limited Company: What Changes on the Invoice</h2><ul className="mt-4 space-y-3"><li className="leading-relaxed text-muted-foreground"><strong>{"Sole trader:"}</strong>{" put your own name and any business name you trade under. If you use a business name, also show an address where legal documents can be delivered to you."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"Limited company:"}</strong>{" use the full company name exactly as it appears on the certificate of incorporation. If you choose to show directors' names on invoices, you must show all of them."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"Everyone:"}</strong>{" a unique invoice number, your contact details, your customer's name and address, a clear description of what you're charging for, the supply date, the invoice date, the amounts charged, VAT if it applies and the total owed."}</li></ul><p className="mt-4 leading-relaxed text-muted-foreground">{"Source: "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include" target="_blank" rel="noopener">{"GOV.UK: what an invoice must include"}</a>{". Exact invoice requirements can vary by country, business type and tax status. MakeInvo provides invoice-creation software, not legal, tax or accounting advice."}</p></div></section><section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">Supply Date, Invoice Date and Payment Terms</h2><p className="mt-4 leading-relaxed text-muted-foreground">{"The "}<strong>{"supply date"}</strong>{" is when the goods or service were provided; the "}<strong>{"invoice date"}</strong>{" is when you issue the invoice. GOV.UK lists both as required details, so show both. Agree payment terms with the customer before you start and put them on the invoice. In the UK, if no payment date is agreed for a business sale, the law treats payment as late 30 days after the customer gets the invoice or you deliver the goods or service, whichever is later ("}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery" target="_blank" rel="noopener">{"GOV.UK"}</a>{")."}</p></div></section></>}
        afterBestPractices={<section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">VAT, Records and Your Accountant</h2><p className="mt-4 leading-relaxed text-muted-foreground">{"Only charge VAT if you are VAT registered: in the UK you must register if your taxable turnover for the last 12 months goes over £90,000 or you expect it to in the next 30 days ("}<a href="https://www.gov.uk/vat-registration" target="_blank" rel="noopener">{"GOV.UK"}</a>{"). Sole traders and partners must keep records of business income and expenses for their Self Assessment tax return ("}<a href="https://www.gov.uk/self-employed-records" target="_blank" rel="noopener">{"GOV.UK"}</a>{"), and limited companies follow different record-keeping rules ("}<a href="https://www.gov.uk/running-a-limited-company/company-and-accounting-records" target="_blank" rel="noopener">{"GOV.UK"}</a>{"). Keep a copy of every invoice you issue. For advice on your own situation, speak to an accountant. MakeInvo does not replace one. Our "}<Link href="/">{"free invoice generator"}</Link>{" and "}<Link href="/invoice-templates">{"invoice templates"}</Link>{" cover the basics for any business."}</p></div></section>}
        beforeFaq={<section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">What's Free and What Needs an Account</h2><ul className="mt-4 space-y-3"><li className="leading-relaxed text-muted-foreground"><strong>{"Without an account:"}</strong>{" create an invoice, add a logo, calculate tax and discounts, and download the PDF. Download the PDF and email it yourself; built-in email delivery is not currently available."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"With an account:"}</strong>{" save invoices and see their status on your dashboard."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"Paid plans:"}</strong>{" saved customers and payment tracking need Standard or Pro; recurring invoices and business reports need Pro. See "}<Link href="/pricing">{"pricing"}</Link>{" and "}<Link href="/features">{"features"}</Link>{"."}</li></ul></div></section>}
        checklistFootnote={<p className="mt-4 leading-relaxed text-muted-foreground">{"In the UK, "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include" target="_blank" rel="noopener">{"GOV.UK sets out what an invoice must include"}</a>{"; the sections below explain the details for sole traders and limited companies."}</p>}
        relatedCopy={<p className="mt-4 leading-relaxed text-muted-foreground">{"Working for yourself? See the "}<Link href="/invoice-generator-for-self-employed">{"self-employed"}</Link>{" and "}<Link href="/invoice-generator-for-freelancers">{"freelancer"}</Link>{" invoice generators, or the "}<Link href="/">{"free invoice generator"}</Link>{" for any business."}</p>}
        faqNote={<p className="mt-4 text-muted-foreground">Exact invoice requirements can vary by country, business type and tax status. MakeInvo provides invoice-creation software, not legal, tax or accounting advice.</p>}
        heroImage={{
          src: "/invoice-generator-for-small-businesses-webp.webp",
          alt: "Small business owner creating a professional invoice with MakeInvo invoice generator",
          title: "Invoice Generator for Small Businesses",
          objectPosition: "65% 20%",
        }}
      />
    </>
  )
}
