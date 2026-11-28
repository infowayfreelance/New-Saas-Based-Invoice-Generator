import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import Link from "next/link"
import type { ProfessionPageData } from "@/components/profession/types"
import { Hammer, FileText, Percent, ClipboardList, CreditCard, Download } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-contractors"

export const metadata: Metadata = {
  title: { absolute: "Free Invoice Generator for Contractors | MakeInvo" },
  description:
    "Create contractor invoices with labour, materials, day rates, PO numbers and tax, then download a PDF. Plus agency, IR35 and stage-payment tips.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Free Invoice Generator for Contractors | MakeInvo",
    description:
      "Create contractor invoices with labour, materials, day rates, PO numbers and tax, then download a PDF. Plus agency, IR35 and stage-payment tips.",
    url: `${siteUrl}/${slug}`,
    type: "website",
    locale: "en_GB",
    siteName: "MakeInvo",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Contractor",
  seoTitle: "Free Invoice Generator for Contractors | MakeInvo",
  metaDescription: metadata.description as string,
  h1: "Invoice Generator for Contractors",
  heroParagraph:
    "Create an itemised contractor invoice that shows your client exactly what the job included. List labour, materials, call-out charges and additional work in one professional PDF.",
  heroSupportingLine:
    "Suitable for independent contractors, subcontractors, maintenance providers and project-based service businesses.",
  invoicePreview: {
    fromName: "Harlow Property Maintenance",
    fromLine: "General Contractor",
    clientName: "Mr & Mrs Whitfield",
    clientLine: "42 Birchwood Close",
    invoiceNumber: "INV-0087",
    dueLabel: "On receipt",
    items: [
      { description: "Labour", meta: "9 hours @ £38/hr", amount: "£342.00" },
      { description: "Replacement guttering", meta: "12m", amount: "£216.00" },
      { description: "Call-out fee", amount: "£45.00" },
      { description: "Additional repair - fascia board", amount: "£85.00" },
    ],
    subtotal: "£688.00",
    tax: "£137.60",
    total: "£825.60",
  },
  invoicePreviewAlt:
    "Example property maintenance contractor invoice showing labour hours, replacement materials, a call-out fee and an additional repair",

  problemsHeading: "Separate labour, materials and additional job costs",
  problems: [
    "Clients wanting to see exactly what they're being charged for",
    "Materials and labour needing different units and quantities",
    "Additional work agreed once the job was already underway",
    "Deposits already paid needing to come off the final total",
    "Job references or purchase orders that need to appear on the invoice",
    "Keeping invoices for several jobs organised at once",
  ],
  solutionsHeading: "Professional invoices for completed contract work",
  solutions: [
    "List labour as its own line item, separate from materials and parts.",
    "Add material quantities and unit prices so the breakdown is clear.",
    "Apply tax automatically once the rate is set on a line item.",
    "Add a purchase order or job reference so it's easy to match against the client's own records.",
    "Apply a discount where a deposit or agreed reduction needs to come off the total.",
    "Add payment instructions and notes so there's no ambiguity about how to pay.",
    "Write a clear job description instead of a single vague line.",
  ],

  infoHeading: "What to include on a contractor invoice",
  infoItems: [
    "Your contractor or trading name",
    "Your contact details",
    "The client or company's details",
    "The job location, where relevant",
    "A unique invoice number",
    "A purchase order or job reference, if one was given",
    "A description of the labour and hours",
    "Materials used and their quantities",
    "Any additional charges",
    "Tax, where applicable",
    "A deposit or discount, if one applies",
    "The payment due date and payment details",
  ],

  workflowHeading: "From completed job to professional invoice",
  workflowSteps: [
    { title: "Add the details", description: "Add your contractor details and the client's billing information." },
    { title: "Separate the costs", description: "Split labour, materials and additional charges into their own lines." },
    { title: "Add tax and terms", description: "Apply tax, discounts, notes and clear payment terms." },
    { title: "Share the PDF", description: "Generate and share the completed invoice as a PDF." },
  ],

  featuresHeading: "Built for labour-and-materials billing",
  features: [
    { icon: Hammer, title: "Labour and materials", description: "Keep labour and materials as separate, clearly priced line items on every invoice." },
    { icon: ClipboardList, title: "Job references", description: "Add a purchase order or job reference so invoices match the client's own paperwork." },
    { icon: Percent, title: "Automatic totals", description: "Tax, discounts and totals are calculated automatically as you add line items." },
    { icon: FileText, title: "Client records", description: "Standard and Pro users can save client details for repeat jobs and properties." },
    { icon: CreditCard, title: "Payment tracking", description: "On Standard or Pro, track payments and see which invoices are paid, unpaid or overdue.", paidPlan: true },
    { icon: Download, title: "Downloadable PDFs", description: "Every invoice can be downloaded as a clean, print-ready PDF." },
  ],

  bestPracticesHeading: "Contractor invoicing practices that prevent disputes",
  bestPractices: [
    "Match the invoice to the quotation the client already approved.",
    "Keep labour and materials as separate line items.",
    "Record any additional work that was authorised during the job.",
    "Add the job address or reference so the invoice is easy to identify.",
    "Include a clear due date rather than leaving it open-ended.",
    "Keep your own supporting receipts and records alongside the invoice.",
    "Avoid vague descriptions such as \"work completed\" - list what was actually done.",
  ],

  faqs: [
  {
    "question": "How do I invoice labour and materials?",
    "answer": "Add them as separate line items - for example, a labour line with hours and rate, and a materials line with quantity and unit price. MakeInvo totals them automatically."
  },
  {
    "question": "Can I add a purchase order number?",
    "answer": "Yes. There's a dedicated PO number field on every invoice, so it can match the client's own reference."
  },
  {
    "question": "Can I apply tax to contractor work?",
    "answer": "Yes. You can set a tax rate per line item, and MakeInvo calculates the tax amount automatically."
  },
  {
    "question": "Can I include a deposit or discount?",
    "answer": "Yes. You can apply a discount to the invoice total, useful when a deposit has already been paid."
  },
  {
    "question": "Can subcontractors use MakeInvo?",
    "answer": "Yes. Subcontractors can use the same invoice generator to bill the businesses or contractors they work for."
  },
  {
    "question": "Can I track whether a contractor invoice has been paid?",
    "answer": "Yes, on paid plans - your dashboard shows the status of every invoice, including paid, unpaid and overdue."
  },
  {
    "question": "How do I invoice a day rate?",
    "answer": "Add one line per period with the number of days as the quantity and your day rate as the unit price, and say which dates it covers, for example \"Site supervision, week ending 14 November, 5 days\". Keep the days the same as the timesheet the client or agency approved, so the invoice can be matched and paid without queries."
  },
  {
    "question": "Do I invoice the client or the agency?",
    "answer": "Whoever your contract is with. If you were placed through an agency, you normally invoice the agency, and some agencies use self-billing, where they raise the invoice for you from approved timesheets. If you're employed by an umbrella company, it is your employer, so ask the umbrella how billing and pay work."
  },
  {
    "question": "Does IR35 change what I put on my invoice?",
    "answer": "IR35 (the off-payroll working rules) can apply when you work through your own limited company. In most cases the client decides your employment status for tax; for a small private-sector client, your own company decides. If you're treated as employed for tax, the deemed employer (the party that pays your company) deducts Income Tax and employee National Insurance before paying your company, so what you receive can be less than the invoice total (GOV.UK). Check your status for each contract.",
    "answerLinks": [
      {
        "label": "GOV.UK",
        "href": "https://www.gov.uk/guidance/ir35-find-out-if-it-applies"
      }
    ]
  },
  {
    "question": "What does a limited company contractor need on the invoice?",
    "answer": "Use the company's full name exactly as it appears on the certificate of incorporation, and if you show any directors' names, show all of them (GOV.UK). Add the client's details, a unique invoice number, the supply date, the invoice date, a clear description of the work and the amounts. Our small business invoice generator covers the full list for sole traders and companies.",
    "answerLinks": [
      {
        "label": "GOV.UK",
        "href": "https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include"
      },
      {
        "label": "small business invoice generator",
        "href": "/invoice-generator-for-small-businesses"
      }
    ]
  },
  {
    "question": "How do I invoice stage payments or extra work?",
    "answer": "Raise a separate invoice for each agreed stage and name the stage and the quote or PO it belongs to. List any extra work the client approved during the job as its own line, with a short description and the date it was agreed, so it doesn't look like a surprise charge."
  },
  {
    "question": "Can I add expenses to a contractor invoice?",
    "answer": "Yes. Put each expense on its own line, separate from your labour or day rate, with a clear description such as travel to site or parking, and keep the receipts with your records. If you're VAT registered, ask your accountant how to treat recharged costs."
  },
  {
    "question": "What if I work under the Construction Industry Scheme (CIS)?",
    "answer": "See our invoice generator for tradespeople, which explains CIS deductions and the domestic reverse charge for construction work, and check your own position with HMRC or an accountant.",
    "answerLinks": [
      {
        "label": "invoice generator for tradespeople",
        "href": "/invoice-generator-for-tradespeople"
      }
    ]
  },
  {
    "question": "Does MakeInvo give legal, tax or accounting advice?",
    "answer": "Exact invoice requirements can vary by country, business type and tax status. MakeInvo provides invoice-creation software, not legal, tax or accounting advice. For advice on your own contracts and tax status, speak to a qualified accountant or HMRC."
  }
],

  finalCtaHeading: "Invoice your completed job with confidence",
  finalCtaText: "List labour, materials and additional charges, then download a clear PDF invoice your client can approve quickly.",

  relatedLinks: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#invoice-examples", label: "Invoice Examples" },
  ],
  crossLinks: [
    { href: "/invoice-generator-for-tradespeople", label: "Invoice generator for tradespeople" },
    { href: "/invoice-generator-for-small-businesses", label: "Invoice generator for small businesses" },
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
          "name": "Invoice Generator for Contractors",
          "item": "https://makeinvo.com/invoice-generator-for-contractors"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://makeinvo.com/invoice-generator-for-contractors#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I invoice labour and materials?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Add them as separate line items - for example, a labour line with hours and rate, and a materials line with quantity and unit price. MakeInvo totals them automatically."
          }
        },
        {
          "@type": "Question",
          "name": "Can I add a purchase order number?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. There's a dedicated PO number field on every invoice, so it can match the client's own reference."
          }
        },
        {
          "@type": "Question",
          "name": "Can I apply tax to contractor work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can set a tax rate per line item, and MakeInvo calculates the tax amount automatically."
          }
        },
        {
          "@type": "Question",
          "name": "Can I include a deposit or discount?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can apply a discount to the invoice total, useful when a deposit has already been paid."
          }
        },
        {
          "@type": "Question",
          "name": "Can subcontractors use MakeInvo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Subcontractors can use the same invoice generator to bill the businesses or contractors they work for."
          }
        },
        {
          "@type": "Question",
          "name": "Can I track whether a contractor invoice has been paid?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, on paid plans - your dashboard shows the status of every invoice, including paid, unpaid and overdue."
          }
        },
        {
          "@type": "Question",
          "name": "How do I invoice a day rate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Add one line per period with the number of days as the quantity and your day rate as the unit price, and say which dates it covers, for example \"Site supervision, week ending 14 November, 5 days\". Keep the days the same as the timesheet the client or agency approved, so the invoice can be matched and paid without queries."
          }
        },
        {
          "@type": "Question",
          "name": "Do I invoice the client or the agency?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Whoever your contract is with. If you were placed through an agency, you normally invoice the agency, and some agencies use self-billing, where they raise the invoice for you from approved timesheets. If you're employed by an umbrella company, it is your employer, so ask the umbrella how billing and pay work."
          }
        },
        {
          "@type": "Question",
          "name": "Does IR35 change what I put on my invoice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "IR35 (the off-payroll working rules) can apply when you work through your own limited company. In most cases the client decides your employment status for tax; for a small private-sector client, your own company decides. If you're treated as employed for tax, the deemed employer (the party that pays your company) deducts Income Tax and employee National Insurance before paying your company, so what you receive can be less than the invoice total (GOV.UK). Check your status for each contract."
          }
        },
        {
          "@type": "Question",
          "name": "What does a limited company contractor need on the invoice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use the company's full name exactly as it appears on the certificate of incorporation, and if you show any directors' names, show all of them (GOV.UK). Add the client's details, a unique invoice number, the supply date, the invoice date, a clear description of the work and the amounts. Our small business invoice generator covers the full list for sole traders and companies."
          }
        },
        {
          "@type": "Question",
          "name": "How do I invoice stage payments or extra work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Raise a separate invoice for each agreed stage and name the stage and the quote or PO it belongs to. List any extra work the client approved during the job as its own line, with a short description and the date it was agreed, so it doesn't look like a surprise charge."
          }
        },
        {
          "@type": "Question",
          "name": "Can I add expenses to a contractor invoice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Put each expense on its own line, separate from your labour or day rate, with a clear description such as travel to site or parking, and keep the receipts with your records. If you're VAT registered, ask your accountant how to treat recharged costs."
          }
        },
        {
          "@type": "Question",
          "name": "What if I work under the Construction Industry Scheme (CIS)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "See our invoice generator for tradespeople, which explains CIS deductions and the domestic reverse charge for construction work, and check your own position with HMRC or an accountant."
          }
        },
        {
          "@type": "Question",
          "name": "Does MakeInvo give legal, tax or accounting advice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Exact invoice requirements can vary by country, business type and tax status. MakeInvo provides invoice-creation software, not legal, tax or accounting advice. For advice on your own contracts and tax status, speak to a qualified accountant or HMRC."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": "https://makeinvo.com/invoice-generator-for-contractors#app",
      "name": "MakeInvo Invoice Generator for Contractors",
      "url": "https://makeinvo.com/invoice-generator-for-contractors",
      "description": "Create contractor invoices online with separate labour, materials and additional charges, purchase order or job references, tax and discounts, and download a PDF. Save clients and track payments with an eligible paid account.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript. Works in modern browsers.",
      "featureList": [
        "Separate labour, materials and additional charges as line items",
        "Purchase order or job reference field",
        "Tax per line item, discounts and automatic totals",
        "PDF download",
        "Saved client details with Standard or Pro",
        "Payment records with Standard or Pro"
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
        ukContractors
        afterInvoiceDetails={<section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">Day Rate, Hourly or Fixed Price: How to Show It on the Invoice</h2><ul className="mt-4 space-y-3"><li className="leading-relaxed text-muted-foreground"><strong>{"Day rate:"}</strong>{" one line per week or period, with the number of days as the quantity and your day rate as the unit price. Add the dates covered (for example \"week ending 14 November\") so it matches the timesheet."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"Hourly:"}</strong>{" hours as the quantity and your hourly rate as the unit price, as in the labour line on the sample invoice."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"Fixed price:"}</strong>{" one line for the agreed job or stage, named the same way as on the quote, plus separate lines for materials or extras that weren't in the fixed price."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"References:"}</strong>{" add the PO number, job reference or site address so the client's accounts team can match the invoice."}</li></ul></div></section>}
        afterFeatures={<section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">Contracting Through an Agency or Your Own Limited Company</h2><ul className="mt-4 space-y-3"><li className="leading-relaxed text-muted-foreground"><strong>{"Who you invoice:"}</strong>{" whoever your contract is with. Through an agency, that is usually the agency, not the end client. Some agencies self-bill: they raise the invoice for you from approved timesheets."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"Umbrella company:"}</strong>{" if an umbrella company employs you, it is your employer, so check with it how billing and pay work."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"Your own limited company:"}</strong>{" invoice in the company's full name as it appears on the certificate of incorporation; if you show directors' names, show all of them ("}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include" target="_blank" rel="noopener">{"GOV.UK"}</a>{"). Business letters, order forms and websites also need the registered number and registered office address ("}<a href="https://www.gov.uk/running-a-limited-company/signs-stationery-and-promotional-material" target="_blank" rel="noopener">{"GOV.UK"}</a>{")."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"IR35:"}</strong>{" the off-payroll working rules can apply when you work through your own company. In most cases the client decides your employment status for tax (for small private-sector clients, your company decides), and the rules apply contract by contract ("}<a href="https://www.gov.uk/guidance/ir35-find-out-if-it-applies" target="_blank" rel="noopener">{"GOV.UK"}</a>{"). If you're treated as employed for tax, deductions are made before your company is paid, so the amount received can be lower than the invoice total."}</li></ul><p className="mt-4 leading-relaxed text-muted-foreground">{"Exact invoice requirements can vary by country, business type and tax status. MakeInvo provides invoice-creation software, not legal, tax or accounting advice."}</p></div></section>}
        afterBestPractices={<section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">Stage Payments, Variations and Expenses</h2><ul className="mt-4 space-y-3"><li className="leading-relaxed text-muted-foreground"><strong>{"Stage payments:"}</strong>{" raise a separate invoice for each agreed stage, naming the stage and the quote or PO it belongs to."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"Variations:"}</strong>{" list extra work the client approved during the job as its own line, with what was done and when it was agreed."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"Deposits:"}</strong>{" show a deposit already paid as a discount on the final invoice, and mention the earlier invoice number in the notes."}</li><li className="leading-relaxed text-muted-foreground"><strong>{"Expenses:"}</strong>{" put each recharged cost (travel, parking, hire) on its own line, separate from your labour or day rate, and keep the receipts."}</li></ul><p className="mt-4 leading-relaxed text-muted-foreground">{"Working under the Construction Industry Scheme? Our "}<Link href="/invoice-generator-for-tradespeople">{"invoice generator for tradespeople"}</Link>{" explains CIS deductions and the domestic reverse charge. For the general UK invoice checklist, see the "}<Link href="/invoice-generator-for-small-businesses">{"small business invoice generator"}</Link>{"."}</p></div></section>}
        relatedCopy={<p className="mt-4 leading-relaxed text-muted-foreground">{"Billing for advice or a set project? See the "}<Link href="/invoice-generator-for-consultants">{"consultant"}</Link>{" and "}<Link href="/invoice-generator-for-freelancers">{"freelancer"}</Link>{" invoice generators, or browse "}<Link href="/invoice-templates">{"invoice templates"}</Link>{"."}</p>}
        faqNote={<p className="mt-4 text-muted-foreground">Exact invoice requirements can vary by country, business type and tax status. MakeInvo provides invoice-creation software, not legal, tax or accounting advice.</p>}
        heroImage={{
          src: "/invoice-generator-for-contractors.webp.webp",
          alt: "Contractor creating a professional invoice with MakeInvo invoice generator",
          title: "Invoice Generator for Contractors",
          objectPosition: "65% 20%",
        }}
      />
    </>
  )
}
