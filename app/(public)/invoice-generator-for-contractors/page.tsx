import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import { ProfessionSchema } from "@/components/profession/profession-schema"
import type { ProfessionPageData } from "@/components/profession/types"
import { Hammer, FileText, Percent, ClipboardList, CreditCard, Download } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-contractors"

export const metadata: Metadata = {
  title: "Invoice Generator for Contractors – Free PDF Invoices",
  description:
    "Create contractor invoices with clear labour, material and job charges. Generate and download a professional PDF invoice online with MakeInvo.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Invoice Generator for Contractors – Free PDF Invoices",
    description:
      "Create contractor invoices with clear labour, material and job charges. Generate and download a professional PDF invoice online with MakeInvo.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Contractor",
  seoTitle: metadata.title as string,
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
    { icon: FileText, title: "Client records", description: "Registered users can save client details for repeat jobs and properties." },
    { icon: CreditCard, title: "Payment tracking", description: "Registered users can mark invoices as paid, unpaid or overdue.", paidPlan: true },
    { icon: Download, title: "Downloadable PDFs", description: "Every invoice can be downloaded instantly as a clean, print-ready PDF." },
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
    { question: "How do I invoice labour and materials?", answer: "Add them as separate line items - for example, a labour line with hours and rate, and a materials line with quantity and unit price. MakeInvo totals them automatically." },
    { question: "Can I add a purchase order number?", answer: "Yes. There's a dedicated PO number field on every invoice, so it can match the client's own reference." },
    { question: "Can I apply tax to contractor work?", answer: "Yes. You can set a tax rate per line item, and MakeInvo calculates the tax amount automatically." },
    { question: "Can I include a deposit or discount?", answer: "Yes. You can apply a discount to the invoice total, useful when a deposit has already been paid." },
    { question: "Can subcontractors use MakeInvo?", answer: "Yes. Subcontractors can use the same invoice generator to bill the businesses or contractors they work for." },
    { question: "Can I track whether a contractor invoice has been paid?", answer: "Yes, once you're signed in - your dashboard shows the status of every invoice, including paid, unpaid and overdue." },
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

export default function Page() {
  return (
    <>
      <ProfessionSchema data={data} />
      <ProfessionEditorialLanding data={data} />
    </>
  )
}
