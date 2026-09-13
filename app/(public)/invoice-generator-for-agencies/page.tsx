import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import { ProfessionSchema } from "@/components/profession/profession-schema"
import type { ProfessionPageData } from "@/components/profession/types"
import { Repeat, BarChart3, Users, CreditCard, Building2, FileText } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-agencies"

export const metadata: Metadata = {
  title: "Invoice Generator for Agencies – Retainers and Projects",
  description:
    "Create agency invoices for retainers, campaigns, projects and expenses. Manage client billing and download professional PDF invoices with MakeInvo.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Invoice Generator for Agencies – Retainers and Projects",
    description:
      "Create agency invoices for retainers, campaigns, projects and expenses. Manage client billing and download professional PDF invoices with MakeInvo.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Agency",
  seoTitle: metadata.title as string,
  metaDescription: metadata.description as string,
  h1: "Invoice Generator for Agencies",
  heroParagraph:
    "Create organised invoices for retainers, campaigns, project milestones, media costs and additional work. Make client billing clearer without relying on scattered spreadsheets.",
  heroSupportingLine: "Built for marketing, web, creative, development and consulting agencies.",
  invoicePreview: {
    fromName: "Northfield Digital",
    fromLine: "Marketing Agency",
    clientName: "Solace Wellness Group",
    clientLine: "Account: SWG-04",
    invoiceNumber: "INV-1187",
    dueLabel: "30 days",
    items: [
      { description: "Monthly marketing retainer", meta: "May", amount: "£3,200.00" },
      { description: "Website maintenance", amount: "£250.00" },
      { description: "Campaign setup - summer promotion", amount: "£600.00" },
      { description: "Additional landing page", amount: "£420.00" },
      { description: "Approved ad spend software", amount: "£90.00" },
    ],
    subtotal: "£4,560.00",
    tax: "£912.00",
    total: "£5,472.00",
  },
  invoicePreviewAlt:
    "Example digital marketing agency invoice showing a monthly retainer, website maintenance, campaign setup, an additional landing page and an approved expense",

  problemsHeading: "Agency billing becomes complicated as client work grows",
  problems: [
    "Monthly retainers that need to be billed on a predictable date",
    "One-off projects running alongside ongoing retainers",
    "Milestones that need to be invoiced separately from the retainer",
    "Additional requests approved mid-month",
    "Reimbursable expenses like ad spend or software",
    "Several client contacts and accounts to keep straight",
    "Tracking which invoices are still outstanding",
  ],
  solutionsHeading: "Keep every client's billing organised",
  solutions: [
    "Bill retainers on a consistent monthly line item, with the period stated clearly.",
    "Add one-off projects and milestones as their own separate charges.",
    "Add approved additional work once it's signed off, rather than folding it into the retainer.",
    "Add reimbursable expenses as their own line items.",
    "Add a PO or account reference so invoices match the client's own systems.",
    "Set consistent payment terms across every client.",
    "See invoice status at a glance once you're signed in, so nothing slips through unnoticed.",
  ],

  infoHeading: "What an agency invoice should include",
  infoItems: [
    "Your agency details",
    "The client's billing entity",
    "The billing period",
    "Retainer services included",
    "Projects and milestones",
    "Approved additional work",
    "Reimbursable expenses",
    "A PO number, where required",
    "Tax, where applicable",
    "Payment terms",
    "An account or project reference",
  ],

  workflowHeading: "A repeatable billing process for agency clients",
  workflowSteps: [
    { title: "Add the account", description: "Add your agency details and the client's account information." },
    { title: "Add the billing", description: "Add the retainer, project milestones and any approved extra work." },
    { title: "Add expenses", description: "Add reimbursable expenses and a PO reference where needed." },
    { title: "Send the invoice", description: "Generate the PDF and track it through to payment." },
  ],

  featuresHeading: "Built for ongoing client billing",
  features: [
    { icon: Repeat, title: "Recurring invoices", description: "Automate retainer billing so an invoice goes out on the same date each month.", paidPlan: true },
    { icon: Building2, title: "Retainer billing", description: "Bill a fixed monthly retainer with the billing period stated clearly." },
    { icon: FileText, title: "Project milestones", description: "Invoice milestones separately from retainers so each charge is easy to trace." },
    { icon: Users, title: "Client history", description: "Registered users can see every past invoice for each client account." },
    { icon: CreditCard, title: "Payment tracking", description: "See which client invoices are paid, sent or overdue from one dashboard.", paidPlan: true },
    { icon: BarChart3, title: "Revenue analytics", description: "Review revenue and outstanding balances across all your agency's clients.", paidPlan: true },
  ],

  bestPracticesHeading: "Agency invoicing practices that support healthy cash flow",
  bestPractices: [
    "Use a consistent billing date for retainer clients.",
    "Match invoices to the contract or scope of work agreed.",
    "Keep retainers separate from additional, approved work.",
    "State the billing period clearly on every retainer invoice.",
    "Get sign-off on expenses before adding them to an invoice.",
    "Use the client's own purchase order or account reference.",
    "Review outstanding accounts regularly rather than waiting for clients to chase you.",
  ],

  faqs: [
    { question: "Can agencies create recurring invoices?", answer: "Yes, on paid plans - recurring invoices let you automate retainer billing so an invoice goes out on the same schedule each month." },
    { question: "How should a monthly retainer appear?", answer: "Add it as a line item and note the billing period in the description, for example \"Monthly marketing retainer - May\"." },
    { question: "Can project milestones be invoiced separately?", answer: "Yes. Add each milestone as its own line item, separate from any retainer, so it's easy to trace against your proposal." },
    { question: "Can I track unpaid agency invoices?", answer: "Yes, once you're signed in - your dashboard shows the status of every invoice across all your clients." },
    { question: "Can I manage multiple clients?", answer: "Yes. Registered users can save multiple client accounts and see each one's billing history separately." },
    { question: "Can I add approved expenses and purchase orders?", answer: "Yes. Add expenses as their own line items and include a PO number where your client's process requires one." },
  ],

  finalCtaHeading: "Bring your agency billing into one clear workflow",
  finalCtaText: "Add retainers, projects and approved expenses, then download a professional PDF invoice for every client.",

  relatedLinks: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#invoice-examples", label: "Invoice Examples" },
  ],
  crossLinks: [
    { href: "/invoice-generator-for-consultants", label: "Invoice generator for consultants" },
    { href: "/invoice-generator-for-designers", label: "Invoice generator for designers" },
    { href: "/invoice-generator-for-small-businesses", label: "Invoice generator for small businesses" },
  ],
}

export default function Page() {
  return (
    <>
      <ProfessionSchema data={data} />
      <ProfessionEditorialLanding
        data={data}
        heroImage={{
          src: "/invoice-generator-for-agencies-webp.webp",
          alt: "Agency team creating a professional invoice with MakeInvo invoice generator",
          title: "Invoice Generator for Agencies",
          objectPosition: "65% 20%",
        }}
      />
    </>
  )
}
