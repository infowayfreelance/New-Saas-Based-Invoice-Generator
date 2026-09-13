import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import { ProfessionSchema } from "@/components/profession/profession-schema"
import type { ProfessionPageData } from "@/components/profession/types"
import { Palette, Repeat, Image as ImageIcon, Users, FileText, Download } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-designers"

export const metadata: Metadata = {
  title: "Invoice Generator for Designers – Free Design Invoices",
  description:
    "Create professional invoices for graphic, web, branding and creative design work. Add projects, revisions and licence fees, then download a PDF.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Invoice Generator for Designers – Free Design Invoices",
    description:
      "Create professional invoices for graphic, web, branding and creative design work. Add projects, revisions and licence fees, then download a PDF.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Designer",
  seoTitle: metadata.title as string,
  metaDescription: metadata.description as string,
  h1: "Invoice Generator for Designers",
  heroParagraph:
    "Present your creative fees as professionally as you present your work. Create clear invoices for design projects, revisions, licensing, retainers and production expenses.",
  heroSupportingLine:
    "Useful for graphic designers, web designers, brand designers, illustrators and independent creative professionals.",
  invoicePreview: {
    fromName: "Willow & Co Studio",
    fromLine: "Brand Design",
    clientName: "Ember Coffee Roasters",
    clientLine: "Project: Rebrand",
    invoiceNumber: "INV-0524",
    dueLabel: "50% on delivery",
    items: [
      { description: "Brand discovery", amount: "£450.00" },
      { description: "Logo design", meta: "3 concepts", amount: "£900.00" },
      { description: "Brand guidelines document", amount: "£380.00" },
      { description: "Additional revision round", amount: "£150.00" },
      { description: "Font licensing", amount: "£90.00" },
    ],
    subtotal: "£1,970.00",
    discount: "-£200.00",
    total: "£1,770.00",
  },
  invoicePreviewAlt:
    "Example brand design studio invoice showing brand discovery, logo design, brand guidelines, an additional revision and font licensing",

  problemsHeading: "Creative projects include more than one final design",
  problems: [
    "Discovery and research stages that happen before any visuals",
    "Multiple design concepts and revision rounds",
    "Licensing or usage fees separate from the design fee itself",
    "Production expenses like stock imagery or fonts",
    "Deposits taken up front, with a balance due later",
    "Scope changes that add work beyond the original brief",
  ],
  solutionsHeading: "Show every creative service clearly",
  solutions: [
    "List discovery, concepts, revisions and guidelines as separate line items.",
    "Add extra revision rounds as their own charge, once included rounds are used up.",
    "Show licensing or usage fees separately from your design fee.",
    "Add production expenses such as stock imagery or fonts as their own line items.",
    "Apply a discount where a deposit has already been paid.",
    "Set a due date so the final balance has a clear deadline.",
  ],

  infoHeading: "What to include on a design invoice",
  infoItems: [
    "Your name or studio name",
    "The client's details",
    "The project name",
    "The design services provided",
    "Included and additional revisions",
    "Licensing or usage fees",
    "Any production expenses",
    "A deposit or discount, if one applies",
    "Tax, where applicable",
    "The final total",
    "The payment due date and details",
  ],

  workflowHeading: "Turn approved design work into a finished invoice",
  workflowSteps: [
    { title: "Add the project", description: "Add your studio details, the client, and the project name." },
    { title: "List the work", description: "Add each design stage, revision or licence fee as its own line." },
    { title: "Apply deposits", description: "Apply any deposit already paid as a discount on the total." },
    { title: "Download the PDF", description: "Generate and download the finished invoice as a PDF." },
  ],

  featuresHeading: "Built for creative billing",
  features: [
    { icon: Palette, title: "Project-based billing", description: "Break a design project into discovery, concepts and delivery stages on one invoice." },
    { icon: Repeat, title: "Revision charges", description: "Add extra revision rounds as their own line item once included rounds are used." },
    { icon: ImageIcon, title: "Licensing line items", description: "Show licensing or usage fees separately from your core design fee." },
    { icon: FileText, title: "Brand logo on invoices", description: "Add your studio logo to your invoice template so it matches your own branding.", paidPlan: true },
    { icon: Users, title: "Saved clients", description: "Registered users can save repeat clients instead of re-entering their details." },
    { icon: Download, title: "PDF downloads", description: "Every invoice can be downloaded instantly as a clean, print-ready PDF." },
  ],

  bestPracticesHeading: "Invoicing tips for designers",
  bestPractices: [
    "Define revision limits in the contract before work begins.",
    "Keep licensing fees separate from your core design fee.",
    "Reference the project name on every invoice.",
    "Show deposits clearly so the remaining balance is obvious.",
    "Avoid unclear line items such as \"design work\" - name the actual deliverable.",
    "State when final files or licences will be delivered once paid.",
    "Keep the invoice itself clean and easy to read, just like your design work.",
  ],

  faqs: [
    { question: "How should I invoice a design project?", answer: "Break it into stages - discovery, concepts, revisions and delivery - and add each as its own line item so the client can see exactly what they're paying for." },
    { question: "Can I charge for additional revisions?", answer: "Yes. Add a separate line item for extra revision rounds once the revisions included in your original quote have been used." },
    { question: "Can I add licensing fees?", answer: "Yes. Add licensing or usage fees as their own line item, separate from your design fee." },
    { question: "Can I show a deposit on the invoice?", answer: "Yes. You can apply a discount to reflect a deposit already paid, so the invoice shows the remaining balance." },
    { question: "Can I upload my design studio logo?", answer: "Yes, on paid plans - you can add your logo to your invoice template so every invoice matches your brand." },
    { question: "Can I invoice ongoing creative retainers?", answer: "Yes. Add the retainer as a line item and note the period it covers, the same way you would a one-off project." },
  ],

  finalCtaHeading: "Create an invoice that matches your professional work",
  finalCtaText: "Add your design stages, revisions and licensing fees, then download a polished PDF invoice.",

  relatedLinks: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#invoice-examples", label: "Invoice Examples" },
  ],
  crossLinks: [
    { href: "/invoice-generator-for-freelancers", label: "Invoice generator for freelancers" },
    { href: "/invoice-generator-for-photographers", label: "Invoice generator for photographers" },
    { href: "/invoice-generator-for-agencies", label: "Invoice generator for agencies" },
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
