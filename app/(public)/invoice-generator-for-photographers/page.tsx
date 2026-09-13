import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import { ProfessionSchema } from "@/components/profession/profession-schema"
import type { ProfessionPageData } from "@/components/profession/types"
import { Camera, Image as ImageIcon, Car, Users, FileText, Download } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-photographers"

export const metadata: Metadata = {
  title: "Invoice Generator for Photographers – Create Free Invoices",
  description:
    "Create photography invoices for sessions, events, editing, prints and image licensing. Generate and download a professional PDF invoice online.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Invoice Generator for Photographers – Create Free Invoices",
    description:
      "Create photography invoices for sessions, events, editing, prints and image licensing. Generate and download a professional PDF invoice online.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Photographer",
  seoTitle: metadata.title as string,
  metaDescription: metadata.description as string,
  h1: "Invoice Generator for Photographers",
  heroParagraph:
    "Create clear invoices for sessions, events, editing, prints, travel and image licensing. Give every client a professional summary of what they booked and what they owe.",
  heroSupportingLine: "Suitable for portrait, wedding, event, product and commercial photographers.",
  invoicePreview: {
    fromName: "Isla Grant Photography",
    fromLine: "Event Photography",
    clientName: "Priya & Daniel",
    clientLine: "Event: 14 June",
    invoiceNumber: "INV-0198",
    dueLabel: "7 days",
    items: [
      { description: "Full day coverage", amount: "£1,100.00" },
      { description: "Editing and retouching", meta: "80 images", amount: "£240.00" },
      { description: "Travel", amount: "£45.00" },
      { description: "Printed album", amount: "£180.00" },
    ],
    subtotal: "£1,565.00",
    discount: "-£300.00",
    total: "£1,265.00",
  },
  invoicePreviewAlt:
    "Example event photography invoice showing full day coverage, editing, travel, a printed album and a booking deposit deducted",

  problemsHeading: "Photography invoices often cover several stages of work",
  problems: [
    "Session or coverage time that needs its own line item",
    "Editing and retouching billed separately from the shoot itself",
    "Prints, albums and products alongside photography services",
    "Travel to a venue or location",
    "A booking deposit that needs to come off the final balance",
    "Image usage or licensing for commercial clients",
  ],
  solutionsHeading: "Keep every photography charge in focus",
  solutions: [
    "Add your coverage package as one clear line item.",
    "Bill editing and retouching separately from shoot time.",
    "Add prints, albums or products with their own price.",
    "Include travel as its own charge when a shoot involves distance.",
    "Apply a discount to reflect a deposit already taken.",
    "Add image licensing fees separately for commercial usage.",
  ],

  infoHeading: "What to include on a photography invoice",
  infoItems: [
    "Your name or studio name",
    "The client's details",
    "The event or session date",
    "The venue or project reference",
    "The coverage package booked",
    "Editing charges",
    "Prints or products",
    "Travel charges",
    "Image licensing, where relevant",
    "A deposit, if one was taken",
    "The remaining balance and due date",
  ],

  workflowHeading: "Create your photography invoice in four steps",
  workflowSteps: [
    { title: "Add the booking", description: "Add your studio details, the client, and the event or session date." },
    { title: "Add the package", description: "Add coverage, editing, prints, travel or licensing as their own lines." },
    { title: "Apply the deposit", description: "Apply any deposit already paid so the balance is clear." },
    { title: "Download the PDF", description: "Generate and download the completed invoice as a PDF." },
  ],

  featuresHeading: "Built for photography billing",
  features: [
    { icon: Camera, title: "Package billing", description: "Bill a full coverage package as one clear line item on the invoice." },
    { icon: Car, title: "Travel expenses", description: "Add travel to a venue or location as its own charge." },
    { icon: ImageIcon, title: "Product line items", description: "Add prints, albums or other products separately from photography services." },
    { icon: FileText, title: "Licensing charges", description: "Show image usage or licensing fees as their own line item for commercial clients." },
    { icon: Users, title: "Client records", description: "Registered users can save repeat clients and past bookings." },
    { icon: Download, title: "PDF downloads", description: "Every invoice can be downloaded instantly as a print-ready PDF." },
  ],

  bestPracticesHeading: "Photography invoicing tips",
  bestPractices: [
    "Reference the session or event date on every invoice.",
    "Match the invoice to the package the client actually booked.",
    "Keep products separate from services on the invoice.",
    "Explain any additional hours charged beyond the booked package.",
    "State image usage or licensing terms separately where relevant.",
    "Show deposits and the remaining balance clearly.",
    "Avoid including sensitive client information you don't need on the invoice.",
  ],

  faqs: [
    { question: "Can I create an invoice for a photography package?", answer: "Yes. Add your coverage package as a line item, along with any add-ons like extra hours or a second shooter." },
    { question: "Can I add travel and editing charges?", answer: "Yes. Add travel and editing as their own separate line items alongside your coverage package." },
    { question: "How do I show a booking deposit?", answer: "Apply a discount to the invoice total to reflect a deposit already paid, so the client sees the remaining balance." },
    { question: "Can I invoice printed albums or products?", answer: "Yes. Add prints, albums or other products as their own line items, separate from your photography services." },
    { question: "Can I include image licensing fees?", answer: "Yes. Add a line item for image usage or licensing when a client needs commercial rights." },
    { question: "Can I download the invoice as a PDF?", answer: "Yes. Every invoice you create can be downloaded instantly as a PDF." },
  ],

  finalCtaHeading: "Create a professional photography invoice",
  finalCtaText: "Add your coverage, editing, prints and travel, then download a clear PDF invoice for your client.",

  relatedLinks: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#invoice-examples", label: "Invoice Examples" },
  ],
  crossLinks: [
    { href: "/invoice-generator-for-freelancers", label: "Invoice generator for freelancers" },
    { href: "/invoice-generator-for-designers", label: "Invoice generator for designers" },
    { href: "/invoice-generator-for-self-employed", label: "Invoice generator for self-employed people" },
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
