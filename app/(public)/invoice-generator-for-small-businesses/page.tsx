import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionLandingTemplate } from "@/components/profession/profession-landing-template"
import { ProfessionSchema } from "@/components/profession/profession-schema"
import type { ProfessionPageData } from "@/components/profession/types"
import { Building2, Users, Percent, CreditCard, Repeat, BarChart3 } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-small-businesses"

export const metadata: Metadata = {
  title: "Invoice Generator for Small Businesses – Free PDF Tool",
  description:
    "Create professional small-business invoices online. Save clients, calculate totals and download clear PDF invoices with MakeInvo.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Invoice Generator for Small Businesses – Free PDF Tool",
    description:
      "Create professional small-business invoices online. Save clients, calculate totals and download clear PDF invoices with MakeInvo.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Small business",
  seoTitle: metadata.title as string,
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
    "Save client details once you register, so repeat customers don't need retyping.",
    "Keep invoice numbers sequential and consistent automatically.",
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
    { icon: Building2, title: "Professional invoice creation", description: "Create clean, consistent invoices for every customer, in minutes." },
    { icon: Users, title: "Client management", description: "Save customer details once and reuse them on every future invoice." },
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
    { question: "Is MakeInvo suitable for a small business?", answer: "Yes. MakeInvo covers the essentials most small businesses need - professional invoices, saved customers, tax and discounts, and payment tracking - without the overhead of full accounting software." },
    { question: "Can I save customer details?", answer: "Yes, once you register a free account - saved customers can be selected on future invoices instead of retyping their details." },
    { question: "Can I track paid and unpaid invoices?", answer: "Yes, once you're signed in - your dashboard shows the real-time status of every invoice you've created." },
    { question: "Can I create recurring invoices?", answer: "Yes, on paid plans - useful for customers you bill on a regular schedule." },
    { question: "Can I add my business logo?", answer: "Yes, on paid plans - you can add your logo and branding to your invoice template." },
    { question: "Does MakeInvo replace an accountant?", answer: "No. MakeInvo is invoice-creation software, not an accounting or tax adviser - it does not replace professional accounting or tax advice for your business." },
  ],

  finalCtaHeading: "Start creating better business invoices",
  finalCtaText: "Add your products or services, then download a clear, professional PDF invoice for every customer.",

  relatedLinks: [
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

export default function Page() {
  return (
    <>
      <ProfessionSchema data={data} />
      <ProfessionLandingTemplate data={data} />
    </>
  )
}
