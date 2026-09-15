import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionSchema } from "@/components/profession/profession-schema"
import { FreelancerEditorialLanding } from "@/components/profession/freelancer-editorial-landing"
import type { ProfessionPageData } from "@/components/profession/types"
import { FileText, Users, Clock3, Repeat, Wallet, History } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-freelancers"

export const metadata: Metadata = {
  title: "Invoice Generator for Freelancers – Create Free Invoices",
  description:
    "Create professional freelance invoices online for free. Add projects, hours, rates and payment terms, then download a clear PDF invoice in minutes.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Invoice Generator for Freelancers – Create Free Invoices",
    description:
      "Create professional freelance invoices online for free. Add projects, hours, rates and payment terms, then download a clear PDF invoice in minutes.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Freelancer",
  seoTitle: metadata.title as string,
  metaDescription: metadata.description as string,
  h1: "Invoice Generator for Freelancers",
  heroParagraph:
    "Turn completed work into a clear, professional invoice without wasting time formatting documents. MakeInvo helps freelancers list projects, hours, rates, expenses and payment terms, then generate a client-ready PDF invoice.",
  heroSupportingLine:
    "Useful for developers, writers, marketers, virtual assistants, creatives and independent professionals.",
  invoicePreview: {
    fromName: "Alex Morgan Web Development",
    fromLine: "Freelance Developer",
    clientName: "Northbridge Retail Ltd",
    clientLine: "Client since March",
    invoiceNumber: "INV-1042",
    dueLabel: "14 days",
    items: [
      { description: "Website development", meta: "40 hours @ £45/hr", amount: "£1,800.00" },
      { description: "Additional revisions", meta: "6 hours @ £45/hr", amount: "£270.00" },
      { description: "Software licence expense", amount: "£38.00" },
      { description: "Project milestone 2 of 3", amount: "£500.00" },
    ],
    subtotal: "£2,608.00",
    tax: "£0.00",
    total: "£2,608.00",
  },
  invoicePreviewAlt:
    "Example freelance web development invoice showing website development hours, revisions, a software expense and a project milestone",

  problemsHeading: "Freelance invoicing should not take longer than the work",
  problems: [
    "Creating a new invoice from scratch for every project",
    "Forgetting to include important client details",
    "Mixing hourly work with fixed-price deliverables on the same invoice",
    "Tracking payments across several different clients",
    "Following up on invoices that go quiet after the due date",
    "Keeping invoice numbers consistent as work picks up",
  ],
  solutionsHeading: "Keep freelance billing clear and consistent",
  solutions: [
    "Add hourly or fixed-price services on the same invoice, with quantities and rates you control.",
    "Separate multiple project deliverables into their own line items instead of one vague total.",
    "Add expenses as their own line item, so a client can see exactly what they're reimbursing.",
    "Set a clear due date so payment terms aren't left to guesswork.",
    "Save repeat-client details once you register, so you're not retyping the same information.",
    "Download a clean, professional PDF the moment the invoice is ready.",
    "Keep an invoice history when you're signed in, so past work is never more than a search away.",
  ],

  infoHeading: "What to include on a freelance invoice",
  infoItems: [
    "Your name or freelance business name",
    "Your contact details",
    "The client's name and billing details",
    "A unique invoice number",
    "The issue date",
    "The payment due date",
    "A description of the project or service",
    "Hours, quantity, or the agreed project fee",
    "Tax, where applicable",
    "Any expenses",
    "The total amount due",
    "Payment instructions and terms",
  ],

  workflowHeading: "Create a freelance invoice in four steps",
  workflowSteps: [
    { title: "Add your details", description: "Enter your details and the client's billing information." },
    { title: "List the work", description: "Add your project, hours, expenses or milestone charges." },
    { title: "Check the totals", description: "Review the totals, tax and payment terms before sending." },
    { title: "Download the PDF", description: "Generate and download the invoice as a client-ready PDF." },
  ],

  featuresHeading: "Built around real freelance workflows",
  features: [
    { icon: Clock3, title: "Hourly and project billing", description: "Bill by the hour or by the project, and mix both on the same invoice when a job calls for it." },
    { icon: Users, title: "Saved client details", description: "Register a free account to save repeat clients so you're not retyping the same details every time." },
    { icon: FileText, title: "Professional PDF invoices", description: "Download a clean, print-ready PDF the moment an invoice is generated - no design work needed." },
    { icon: Wallet, title: "Multiple currencies", description: "Bill international clients in their own currency when a project calls for it." },
    { icon: Repeat, title: "Clear payment terms", description: "Set a due date and terms on every invoice so clients know exactly when payment is expected." },
    { icon: History, title: "Invoice history", description: "Registered users can look back at every past invoice from one dashboard.", paidPlan: false },
  ],

  bestPracticesHeading: "Freelance invoicing tips that reduce confusion",
  bestPractices: [
    "Agree rates with the client before starting work, not after.",
    "Invoice project milestones instead of waiting until the entire project is finished.",
    "Describe each piece of work clearly rather than using a single vague line item.",
    "Keep your invoice numbering consistent from one client to the next.",
    "Include a specific due date rather than leaving payment terms open-ended.",
    "Send the invoice as soon as the agreed work is completed.",
    "Keep a copy of every invoice for your own tax and accounting records.",
  ],

  faqs: [
    { question: "Can I create a freelance invoice without registering?", answer: "Yes. The free invoice generator on the MakeInvo homepage can be used without an account for occasional invoices. Registering is only needed if you want to save clients or keep an invoice history." },
    { question: "Can I invoice both hourly and fixed-price work?", answer: "Yes. You can add separate line items for hourly work and fixed-price deliverables on the same invoice, each with its own description and amount." },
    { question: "Can I add project expenses to my invoice?", answer: "Yes. Add an expense as its own line item so your client can see it separately from your billed hours or project fee." },
    { question: "What payment terms should a freelancer use?", answer: "That's up to you and your client's agreement - MakeInvo lets you set any due date and add payment terms in the notes, whether that's due on receipt or a longer window." },
    { question: "Can I save information for repeat clients?", answer: "Yes, once you create a free account. Saved clients can be selected on future invoices instead of re-entering their details each time." },
    { question: "Can I download my freelance invoice as a PDF?", answer: "Yes. Every invoice you create, with or without an account, can be downloaded instantly as a PDF." },
  ],

  finalCtaHeading: "Create your next freelance invoice",
  finalCtaText: "Add your work, rates and client information, then download a professional PDF invoice in minutes.",

  relatedLinks: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#invoice-examples", label: "Invoice Examples" },
  ],
  crossLinks: [
    { href: "/invoice-generator-for-designers", label: "Invoice generator for designers" },
    { href: "/invoice-generator-for-photographers", label: "Invoice generator for photographers" },
    { href: "/invoice-generator-for-self-employed", label: "Invoice generator for self-employed people" },
  ],
}

export default function Page() {
  return (
    <>
      <ProfessionSchema data={data} />
      <FreelancerEditorialLanding />
    </>
  )
}
