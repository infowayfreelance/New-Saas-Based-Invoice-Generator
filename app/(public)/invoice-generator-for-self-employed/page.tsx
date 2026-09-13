import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import { ProfessionSchema } from "@/components/profession/profession-schema"
import type { ProfessionPageData } from "@/components/profession/types"
import { UserCheck, Hash, Wallet, Download, Users, FileText } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-self-employed"

export const metadata: Metadata = {
  title: "Invoice Generator for Self-Employed People – Free Tool",
  description:
    "Create professional invoices for self-employed work. Add services, expenses, tax and payment terms, then download your invoice as a PDF.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Invoice Generator for Self-Employed People – Free Tool",
    description:
      "Create professional invoices for self-employed work. Add services, expenses, tax and payment terms, then download your invoice as a PDF.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Self-employed",
  seoTitle: metadata.title as string,
  metaDescription: metadata.description as string,
  h1: "Invoice Generator for Self-Employed People",
  heroParagraph:
    "Create a professional invoice even if you do not operate through a limited company. Add your name or trading name, services, expenses, payment terms and customer details in one clear document.",
  heroSupportingLine: "Useful for sole traders, independent workers, side businesses and people working for themselves.",
  invoicePreview: {
    fromName: "Marcus Webb",
    fromLine: "Trading as Webb Property Services",
    clientName: "Thornfield Estates",
    clientLine: "Ref: TE-0231",
    invoiceNumber: "INV-0059",
    dueLabel: "14 days",
    items: [
      { description: "Property inspection", meta: "4 hours @ £35/hr", amount: "£140.00" },
      { description: "Travel expense", amount: "£22.00" },
      { description: "Report materials", amount: "£15.00" },
    ],
    subtotal: "£177.00",
    discount: "-£10.00",
    total: "£167.00",
  },
  invoicePreviewAlt:
    "Example sole trader invoice showing hours worked, a travel expense, materials and a small discount",

  problemsHeading: "Working for yourself already involves enough administration",
  problems: [
    "Knowing which business details actually need to go on the invoice",
    "Keeping invoice numbers consistent",
    "Separating personal and business records",
    "Tracking different customers or clients",
    "Adding tax where it applies to your work",
    "Keeping clear records for your tax return",
    "Following up on payments that haven't arrived",
  ],
  solutionsHeading: "Simple invoicing without complicated accounting software",
  solutions: [
    "Use your name or a trading name - whichever applies to how you work.",
    "Let invoice numbers stay sequential and consistent automatically.",
    "Keep a dedicated record of every invoice you've sent, separate from personal paperwork.",
    "Save repeat customer details once you register, so you're not retyping them.",
    "Add tax to a line item where your work requires it.",
    "Keep a clear invoice history ready for your tax return.",
    "Set a due date so payment terms are never left vague.",
  ],

  infoHeading: "What should a self-employed invoice include?",
  infoItems: [
    "Your personal name or registered trading name",
    "Your business address or contact details",
    "The customer's details",
    "A unique invoice number",
    "The issue date",
    "The payment due date",
    "A description of the work",
    "Quantity, hours or a fixed price",
    "Any expenses",
    "Tax, where required",
    "The total amount",
    "Your payment details",
  ],
  infoNote:
    "The information required on an invoice can vary by country and business type. MakeInvo provides invoice-creation software, not legal, tax or accounting advice.",

  workflowHeading: "Create a self-employed invoice in four steps",
  workflowSteps: [
    { title: "Add your details", description: "Add your name or trading name and the customer's details." },
    { title: "Describe the work", description: "Add the work, hours or fixed price, and any expenses." },
    { title: "Check tax and terms", description: "Add tax where it applies and set a clear due date." },
    { title: "Download the PDF", description: "Generate and download your invoice as a PDF." },
  ],

  featuresHeading: "Built for working without a limited company",
  features: [
    { icon: UserCheck, title: "No-company invoicing", description: "Invoice under your own name or a trading name - no limited company required." },
    { icon: Wallet, title: "Hourly or fixed-price work", description: "Bill by the hour or a fixed price, whichever suits the job." },
    { icon: FileText, title: "Expense line items", description: "Add expenses as their own line item, separate from your fee." },
    { icon: Hash, title: "Invoice numbering", description: "Every invoice gets a sequential number automatically, so numbering stays consistent." },
    { icon: Users, title: "Client records", description: "Registered users can save repeat customer details for future invoices." },
    { icon: Download, title: "PDF downloads", description: "Every invoice can be downloaded instantly as a PDF." },
  ],

  bestPracticesHeading: "Keep your self-employed invoice records organised",
  bestPractices: [
    "Use a separate business email for invoicing where possible.",
    "Keep your invoice numbers consistent from one customer to the next.",
    "Keep a copy of every invoice you send.",
    "Record payments separately from your other personal finances.",
    "Review your local tax requirements for the work you do.",
    "Set clear payment terms on every invoice.",
    "Avoid including personal information you don't need to share.",
    "Consider professional accounting advice as your work grows.",
  ],

  faqs: [
    { question: "Can I send an invoice without having a limited company?", answer: "Yes. You can invoice as a sole trader or independent worker using your own name or a trading name - a limited company isn't required." },
    { question: "Should I use my personal name or trading name?", answer: "Either can work - use whichever name you operate under and that your customer will recognise. Check your local rules on what's required to appear on an invoice." },
    { question: "Do self-employed invoices need an invoice number?", answer: "It's good practice, and often required for tax records. MakeInvo assigns a sequential invoice number automatically." },
    { question: "Can I add expenses?", answer: "Yes. Add expenses as their own line item, separate from your service or hourly fee." },
    { question: "Should I charge tax?", answer: "That depends on your local tax rules and your business's tax status - MakeInvo lets you add a tax rate per line item, but you're responsible for checking what applies to you." },
    { question: "Can I keep an invoice history in MakeInvo?", answer: "Yes, once you register a free account - your invoices are saved and searchable from your dashboard." },
  ],

  finalCtaHeading: "Create a professional invoice for your work",
  finalCtaText: "Add your details, your work and any expenses, then download a clear PDF invoice in minutes.",

  relatedLinks: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#invoice-examples", label: "Invoice Examples" },
  ],
  crossLinks: [
    { href: "/invoice-generator-for-freelancers", label: "Invoice generator for freelancers" },
    { href: "/invoice-generator-for-consultants", label: "Invoice generator for consultants" },
    { href: "/invoice-generator-for-tradespeople", label: "Invoice generator for tradespeople" },
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
