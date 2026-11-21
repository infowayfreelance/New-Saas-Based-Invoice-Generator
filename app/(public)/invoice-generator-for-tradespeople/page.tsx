import Link from "next/link"
import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import { ProfessionSchema } from "@/components/profession/profession-schema"
import type { ProfessionPageData } from "@/components/profession/types"
import { Wrench, Smartphone, MapPin, Percent, Users, Send } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-tradespeople"

export const metadata: Metadata = {
  title: "Free Invoice Generator for Tradespeople UK",
  description:
    "Free invoice generator for UK tradespeople. List labour, materials, call-out fees and extra work, add VAT if registered, then download a PDF.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Free Invoice Generator for Tradespeople UK | MakeInvo",
    description:
      "Free invoice generator for UK tradespeople. List labour, materials, call-out fees and extra work, add VAT if registered, then download a PDF.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Tradesperson",
  seoTitle: metadata.title as string,
  metaDescription: metadata.description as string,
  h1: "Free Invoice Generator for Tradespeople",
  heroParagraph:
    "Create a professional job invoice from your phone, tablet or computer. List labour, materials, call-out charges and additional work so customers can understand the final amount.",
  heroSupportingLine:
    "Useful for builders, plumbers, electricians, decorators, joiners, roofers, mechanics and property maintenance professionals. Works for sole traders and small firms, whether or not you're VAT-registered.",
  invoicePreview: {
    fromName: "Barlow Plumbing & Heating",
    fromLine: "Registered Plumber",
    clientName: "Mrs J. Ackerman",
    clientLine: "16 Fenwick Road",
    invoiceNumber: "INV-0412",
    dueLabel: "On receipt",
    items: [
      { description: "Call-out charge", amount: "£40.00" },
      { description: "Labour", meta: "2.5 hours @ £42/hr", amount: "£105.00" },
      { description: "Replacement valve", amount: "£28.00" },
      { description: "Additional repair - pipe joint", amount: "£35.00" },
    ],
    subtotal: "£208.00",
    tax: "£41.60",
    total: "£249.60",
  },
  invoicePreviewAlt:
    "Example plumbing business invoice showing a call-out charge, labour hours, a replacement part and an additional repair",

  problemsHeading: "Turn completed jobs into clear, itemised invoices",
  problems: [
    "Customers wanting labour and materials shown separately",
    "Call-out charges that need to appear on the invoice",
    "Additional work agreed once you were already on site",
    "Multiple visits for the same job",
    "Job addresses that need to be on record",
    "Deposits already taken for bigger jobs",
    "Customers questioning how the total was worked out",
  ],
  solutionsHeading: "Invoice from the job site or back at the office",
  solutions: [
    "Add labour and materials as separate, clearly priced line items.",
    "Add a call-out charge as its own line where one applies.",
    "Record additional work agreed on site as a separate charge.",
    "Add the job address in Notes so the invoice is easy to identify later.",
    "Apply a discount where a deposit has already been paid.",
    "Create the invoice on your phone as soon as the job's done, or back at the office later.",
  ],

  infoHeading: "What to include on a trade invoice",
  infoItems: [
    "Your trading or business name",
    "Your contact information",
    "The customer's details",
    "The job address",
    "The job date",
    "Labour charges",
    "Materials used",
    "Call-out fees",
    "Any additional work",
    "Waste or delivery charges, where relevant",
    "Tax, where applicable",
    "A deposit, total and payment details",
  ],

  workflowHeading: "Create a trade invoice before moving to the next job",
  workflowSteps: [
    { title: "Add the job", description: "Add your business details, the customer, and the job address in Notes." },
    { title: "List the work", description: "Add labour, materials, call-out fees and any extra work." },
    { title: "Check the total", description: "Review tax, deposits and the amount due." },
    { title: "Send it over", description: "Download the PDF or share it with your customer." },
  ],

  featuresHeading: "Built for invoicing on the go",
  features: [
    { icon: Smartphone, title: "Mobile-friendly invoicing", description: "Create and download a job invoice from your phone, straight after finishing the work." },
    { icon: Wrench, title: "Labour and materials", description: "Keep labour and materials as separate line items, priced clearly." },
    { icon: MapPin, title: "Call-out charges", description: "Add a call-out fee as its own line item where one applies." },
    { icon: Percent, title: "Automatic totals", description: "Tax and totals are calculated automatically as you add each charge." },
    { icon: Users, title: "Customer records", description: "Registered users can save repeat customer details." },
    { icon: Send, title: "PDF sharing", description: "Download the finished invoice as a PDF to send however suits your customer." },
  ],

  bestPracticesHeading: "Trade invoicing tips that reduce customer questions",
  bestPractices: [
    "Match your charges to the quotation you originally gave.",
    "Separate labour and parts rather than combining them into one line.",
    "Include the job address so the invoice is easy to identify.",
    "Record any additional work that was approved on site.",
    "Avoid vague descriptions - list what was actually done.",
    "Show deposits clearly so the customer sees the remaining balance.",
    "Include warranty or service notes only where relevant to the job.",
    "Keep copies of every completed invoice for your own records.",
  ],

  faqs: [
  {
    "question": "Can I create an invoice from my phone?",
    "answer": "Yes. MakeInvo is fully responsive, so you can create and download a job invoice from your phone, tablet or computer."
  },
  {
    "question": "Can I separate labour and materials?",
    "answer": "Yes. Add labour and materials as separate line items so the customer can see exactly what they're paying for."
  },
  {
    "question": "Can I add a call-out charge?",
    "answer": "Yes. Add it as its own line item alongside labour and materials."
  },
  {
    "question": "How do I invoice additional work?",
    "answer": "Add a new line item describing the extra work agreed on site, priced separately from the original job."
  },
  {
    "question": "Can I include the job address?",
    "answer": "Yes. Add the job address in the Notes field, useful for customers with multiple properties."
  },
  {
    "question": "Can I send the completed invoice to my customer?",
    "answer": "Yes. Download the invoice as a PDF and send it however suits you and your customer."
  },
  {
    "question": "Do tradespeople have to charge VAT?",
    "answer": "Only if you're VAT-registered. If you aren't, leave VAT off the invoice completely. If you are, show your VAT registration number and the VAT charged, as GOV.UK requires. Building work for other VAT-registered contractors may fall under the domestic reverse charge instead."
  },
  {
    "question": "How do I show CIS on an invoice?",
    "answer": "Keep labour and materials on separate lines. Under the Construction Industry Scheme the contractor makes the deduction from the labour part of your bill, not from materials, at 20% if you're registered for CIS or 30% if you're not. MakeInvo doesn't calculate CIS deductions for you, so agree how the deduction will be shown with your contractor."
  },
  {
    "question": "Can I invoice the balance after taking a deposit?",
    "answer": "Yes. List the full job as normal, then show the deposit you've already received so the customer can see the remaining balance due."
  },
  {
    "question": "What's the difference between a quote and an invoice?",
    "answer": "A quote is the price you offer before the work starts. An invoice is the request for payment once the work, or an agreed stage of it, is done. Use the same job description and prices as your quote, and add any extra work agreed on site as separate lines."
  }
],

  finalCtaHeading: "Create your next job invoice in minutes",
  finalCtaText: "Add labour, materials and call-out charges, then download a clear PDF invoice before you leave the job.",

  relatedLinks: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#invoice-examples", label: "Invoice Examples" },
  ],
  crossLinks: [
    { href: "/invoice-generator-for-consultants", label: "Invoice generator for consultants" },
    { href: "/invoice-generator-for-contractors", label: "Invoice generator for contractors" },
    { href: "/invoice-generator-for-small-businesses", label: "Invoice generator for small businesses" },
    { href: "/invoice-generator-for-self-employed", label: "Invoice generator for self-employed people" },
  ],
}

export default function Page() {
  return (
    <>
      <ProfessionSchema data={data} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context": "https://schema.org", "@type": "WebApplication", "@id": "https://makeinvo.com/invoice-generator-for-tradespeople#app", "name": "MakeInvo Invoice Generator for Tradespeople", "url": "https://makeinvo.com/invoice-generator-for-tradespeople", "applicationCategory": "BusinessApplication", "operatingSystem": "Web", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"}, "provider": {"@id": "https://makeinvo.com/#organization"}}).replace(/</g, "\\u003c") }} />
      <ProfessionEditorialLanding
        data={data}
        ukTradespeople
        afterInvoiceDetails={<TradeDetails />}
        heroImage={{
          src: "/invoice-generator-for-tradespeople.webp.webp",
          alt: "Tradesperson creating a professional invoice with MakeInvo invoice generator",
          title: "Invoice Generator for Tradespeople",
          objectPosition: "65% 20%",
        }}
      />
    </>
  )
}

function TradeDetails() {
 return <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"What a UK Trade Invoice Must Include"}</h2><p className="mt-2 text-lg text-muted-foreground">{"GOV.UK says every invoice must show a unique invoice number, your business name, address and contact details, your customer's name and address, a clear description of what you're charging for, the date the goods or service were supplied, the invoice date, the amount charged, VAT if applicable, and the total amount owed. Source: "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include">{"GOV.UK – Invoices: what they must include"}</a>{"."}</p><p className="mt-2 text-lg text-muted-foreground">{"For trade jobs it also helps to add:"}</p><ul className="mt-2 text-lg text-muted-foreground"><li>{"the job address, if it's different from the customer's billing address;"}</li><li>{"the quote number or date, so the invoice matches what was agreed;"}</li><li>{"labour, materials and call-out charges on separate lines;"}</li><li>{"any deposit already paid and the balance due."}</li></ul><p className="mt-2 text-lg text-muted-foreground">{"For a full checklist, read "}<Link href="/blog/what-to-include-on-a-uk-invoice">{"what to include on a UK invoice"}</Link>{"."}</p></div><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"VAT and the Construction Reverse Charge"}</h2><p className="mt-2 text-lg text-muted-foreground">{"Only charge VAT if you're VAT-registered. If you are, your invoice must show your VAT registration number and the VAT charged; if you aren't, leave VAT off completely. Work for homeowners and other end customers is invoiced with VAT in the normal way when you're registered."}</p><p className="mt-2 text-lg text-muted-foreground">{"If you're VAT-registered and supply building or construction services to another VAT-registered contractor under the Construction Industry Scheme, the "}<strong>{"domestic reverse charge"}</strong>{" may apply. The customer then accounts for the VAT instead of you, and your invoice must say that the reverse charge applies. It doesn't apply when you invoice the end user. Check "}<a href="https://www.gov.uk/guidance/vat-domestic-reverse-charge-for-building-and-construction-services">{"HMRC's guidance on the domestic reverse charge"}</a>{" or ask your accountant. In MakeInvo you set the tax rate per line, so you can apply VAT only where it's due and add a note to the invoice."}</p></div><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"CIS Invoices for Subcontractors"}</h2><p className="mt-2 text-lg text-muted-foreground">{"If you work for a contractor in construction, they may have to make deductions from your payments under the Construction Industry Scheme (CIS). Deductions are taken from the labour part of your bill, not from materials, at 20% if you're registered for CIS, 30% if you're not, and none if you have gross payment status. That's why it matters to show labour and materials on separate lines. MakeInvo doesn't calculate CIS deductions, so agree with your contractor how the deduction will be shown, and keep the payment and deduction statements they send you. Source: "}<a href="https://www.gov.uk/what-you-must-do-as-a-cis-subcontractor">{"GOV.UK – What you must do as a CIS subcontractor"}</a>{"."}</p></div><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"Deposits, Stage Payments and Extra Work"}</h2><ul className="mt-2 text-lg text-muted-foreground"><li><strong>{"Deposits:"}</strong>{" list the full job, then show the deposit you've already received so the customer sees the balance due."}</li><li><strong>{"Stage payments:"}</strong>{" on longer jobs, invoice each agreed stage separately and describe the stage in the line (for example \"Stage 2 – first fix electrics\")."}</li><li><strong>{"Extra work:"}</strong>{" add anything agreed on site as its own line, with a short description, so it isn't mixed up with the original quote."}</li></ul><p className="mt-2 text-lg text-muted-foreground">{"Self-employed and doing smaller jobs? Use our "}<Link href="/invoice-generator-for-self-employed">{"invoice generator for self-employed people"}</Link>{"."}</p></div><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"Getting Paid on Time"}</h2><p className="mt-2 text-lg text-muted-foreground">{"Put a specific due date on the invoice, include your bank details, and send it as soon as the job is finished. If a business customer pays late, you can usually claim statutory interest and fixed compensation under the Late Payment of Commercial Debts (Interest) Act 1998. See "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery">{"GOV.UK – Late commercial payments"}</a>{". For homeowners, agree payment terms in your quote before you start."}</p></div></section>
}
