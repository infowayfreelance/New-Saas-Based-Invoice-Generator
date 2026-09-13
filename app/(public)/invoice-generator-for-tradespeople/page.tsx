import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import { ProfessionSchema } from "@/components/profession/profession-schema"
import type { ProfessionPageData } from "@/components/profession/types"
import { Wrench, Smartphone, MapPin, Percent, Users, Send } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-tradespeople"

export const metadata: Metadata = {
  title: "Invoice Generator for Tradespeople – Labour and Materials",
  description:
    "Create clear trade invoices for labour, materials, call-outs and completed jobs. Generate and download a professional PDF invoice online.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Invoice Generator for Tradespeople – Labour and Materials",
    description:
      "Create clear trade invoices for labour, materials, call-outs and completed jobs. Generate and download a professional PDF invoice online.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Tradesperson",
  seoTitle: metadata.title as string,
  metaDescription: metadata.description as string,
  h1: "Invoice Generator for Tradespeople",
  heroParagraph:
    "Create a professional job invoice from your phone, tablet or computer. List labour, materials, call-out charges and additional work so customers can understand the final amount.",
  heroSupportingLine:
    "Useful for builders, plumbers, electricians, decorators, joiners, roofers, mechanics and property maintenance professionals.",
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
    "Add the job address so the invoice is easy to identify later.",
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
    { title: "Add the job", description: "Add your business details, the customer, and the job address." },
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
    { icon: Users, title: "Customer records", description: "Registered users can save repeat customers and previous job addresses." },
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
    { question: "Can I create an invoice from my phone?", answer: "Yes. MakeInvo is fully responsive, so you can create and download a job invoice from your phone, tablet or computer." },
    { question: "Can I separate labour and materials?", answer: "Yes. Add labour and materials as separate line items so the customer can see exactly what they're paying for." },
    { question: "Can I add a call-out charge?", answer: "Yes. Add it as its own line item alongside labour and materials." },
    { question: "How do I invoice additional work?", answer: "Add a new line item describing the extra work agreed on site, priced separately from the original job." },
    { question: "Can I include the job address?", answer: "Yes. You can add the job address to the invoice, useful for customers with multiple properties." },
    { question: "Can I send the completed invoice to my customer?", answer: "Yes. Download the invoice as a PDF and send it however suits you and your customer." },
  ],

  finalCtaHeading: "Create your next job invoice in minutes",
  finalCtaText: "Add labour, materials and call-out charges, then download a clear PDF invoice before you leave the job.",

  relatedLinks: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#invoice-examples", label: "Invoice Examples" },
  ],
  crossLinks: [
    { href: "/invoice-generator-for-contractors", label: "Invoice generator for contractors" },
    { href: "/invoice-generator-for-small-businesses", label: "Invoice generator for small businesses" },
    { href: "/invoice-generator-for-self-employed", label: "Invoice generator for self-employed people" },
  ],
}

export default function Page() {
  return (
    <>
      <ProfessionSchema data={data} />
      <ProfessionEditorialLanding
        data={data}
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
