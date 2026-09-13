import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import { ProfessionSchema } from "@/components/profession/profession-schema"
import type { ProfessionPageData } from "@/components/profession/types"
import { Briefcase, Repeat, Target, Wallet, Users, FileText } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-consultants"

export const metadata: Metadata = {
  title: "Invoice Generator for Consultants – Create Free Invoices",
  description:
    "Create clear consulting invoices for hourly work, retainers and project milestones. Generate a professional PDF invoice online with MakeInvo.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Invoice Generator for Consultants – Create Free Invoices",
    description:
      "Create clear consulting invoices for hourly work, retainers and project milestones. Generate a professional PDF invoice online with MakeInvo.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Consultant",
  seoTitle: metadata.title as string,
  metaDescription: metadata.description as string,
  h1: "Invoice Generator for Consultants",
  heroParagraph:
    "Bill clients clearly for advisory work, strategy sessions, retainers and project milestones. MakeInvo helps consultants turn professional services into organised, client-ready invoices.",
  heroSupportingLine: "Designed for business, marketing, IT, HR, management and independent consultants.",
  invoicePreview: {
    fromName: "Dalton Business Advisory",
    fromLine: "Independent Consultant",
    clientName: "Ferris & Cole Ltd",
    clientLine: "PO: FC-2291",
    invoiceNumber: "INV-0316",
    dueLabel: "30 days",
    items: [
      { description: "Strategy workshop", meta: "Half-day session", amount: "£950.00" },
      { description: "Research and analysis", meta: "12 hours @ £85/hr", amount: "£1,020.00" },
      { description: "Monthly retainer", meta: "April", amount: "£1,500.00" },
      { description: "Travel expense", amount: "£64.00" },
    ],
    subtotal: "£3,534.00",
    tax: "£0.00",
    total: "£3,534.00",
  },
  invoicePreviewAlt:
    "Example business consultant invoice showing a strategy workshop, research hours, a monthly retainer and a travel expense",

  problemsHeading: "Consulting work does not always fit one billing method",
  problems: [
    "Some sessions are hourly, others are fixed price",
    "Monthly retainers need to be billed on a predictable schedule",
    "Larger engagements are billed against agreed milestones",
    "Reimbursable expenses need to be shown separately from fees",
    "Different contacts at the same client need to be billed correctly",
    "Purchase order numbers need to appear on the invoice",
  ],
  solutionsHeading: "Make complex consulting fees easy to understand",
  solutions: [
    "List each service or deliverable as its own line item, instead of one lump sum.",
    "Record hours and your rate clearly for time-based work.",
    "Add a retainer period so the client can see exactly which month it covers.",
    "Identify project milestones by name so the invoice matches your proposal.",
    "Add reimbursable expenses as separate line items.",
    "Add a PO number where your client's finance team requires one.",
    "Set clear payment terms on every invoice, whether that's 14, 30 or 60 days.",
  ],

  infoHeading: "What a consulting invoice should show",
  infoItems: [
    "Your name or company details",
    "The client's billing information",
    "The engagement or project name",
    "The billing period, for retainers",
    "The services delivered",
    "Hours and rate, where relevant",
    "The retainer or milestone amount",
    "Any expenses",
    "Tax, where applicable",
    "The payment due date",
    "Payment instructions",
  ],

  workflowHeading: "Create a consulting invoice in minutes",
  workflowSteps: [
    { title: "Add the engagement", description: "Add your details, the client, and the engagement or project name." },
    { title: "Add the billing", description: "Add hours, a retainer period, or the milestone being billed." },
    { title: "Add expenses", description: "Add any reimbursable expenses as their own line items." },
    { title: "Download the PDF", description: "Generate and download a clear, client-ready PDF invoice." },
  ],

  featuresHeading: "Built for how consultants actually bill",
  features: [
    { icon: Target, title: "Hourly billing", description: "Bill advisory hours at your own rate, with a clear description of the work." },
    { icon: Repeat, title: "Retainer invoices", description: "Bill a monthly retainer with the billing period clearly stated on the invoice." },
    { icon: Briefcase, title: "Milestone billing", description: "Invoice project milestones separately so they match your proposal or contract." },
    { icon: Wallet, title: "Expense line items", description: "Show reimbursable expenses separately from your professional fees." },
    { icon: Users, title: "Client management", description: "Registered users can save client details and see a full billing history per client." },
    { icon: FileText, title: "Payment status tracking", description: "Registered users can see which invoices are paid, sent or overdue.", paidPlan: true },
  ],

  bestPracticesHeading: "Make consulting invoices easier to approve",
  bestPractices: [
    "Reference the signed agreement or proposal on the invoice.",
    "Use the same service names as the contract, not a generic description.",
    "State the billing period clearly for retainer work.",
    "Keep professional fees separate from reimbursable expenses.",
    "Include the relevant purchase order number where one was provided.",
    "Avoid revealing confidential project details in the invoice description.",
    "Send invoices according to the schedule agreed with the client.",
  ],

  faqs: [
    { question: "Can I create hourly consulting invoices?", answer: "Yes. Add a line item with your hours and rate, and MakeInvo calculates the amount automatically." },
    { question: "How do I invoice a monthly retainer?", answer: "Add the retainer as a line item and note the billing period in the description, for example \"Monthly retainer - April\"." },
    { question: "Can I bill project milestones?", answer: "Yes. Add each milestone as its own line item so the invoice matches your proposal or statement of work." },
    { question: "Can expenses be shown separately?", answer: "Yes. Add expenses as their own line items, separate from your professional fees." },
    { question: "Can I add a purchase order number?", answer: "Yes. There's a dedicated PO number field on every invoice." },
    { question: "Can I reuse saved client details?", answer: "Yes, once you register a free account - saved clients can be selected on future invoices instead of retyping their details." },
  ],

  finalCtaHeading: "Create a clear invoice for your consulting work",
  finalCtaText: "Add your fees, retainer or milestone, then download a professional PDF invoice your client can approve quickly.",

  relatedLinks: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#invoice-examples", label: "Invoice Examples" },
  ],
  crossLinks: [
    { href: "/invoice-generator-for-freelancers", label: "Invoice generator for freelancers" },
    { href: "/invoice-generator-for-agencies", label: "Invoice generator for agencies" },
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
          src: "/invoice-generator-for-consultants-webp.webp",
          alt: "Consultant creating a professional invoice with MakeInvo invoice generator",
          title: "Invoice Generator for Consultants",
          objectPosition: "65% 20%",
        }}
      />
    </>
  )
}
