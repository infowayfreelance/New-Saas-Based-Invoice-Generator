import Link from "next/link"
import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import { ProfessionSchema } from "@/components/profession/profession-schema"
import type { ProfessionPageData } from "@/components/profession/types"
import { Camera, Image as ImageIcon, Car, Users, FileText, Download } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-photographers"

export const metadata: Metadata = {
  title: "Free Invoice Generator for Photographers UK",
  description:
    "Free invoice generator for UK photographers. Bill shoots, editing, prints, travel and image licences, show deposits, add VAT if registered, get a PDF.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Free Invoice Generator for Photographers UK | MakeInvo",
    description:
      "Free invoice generator for UK photographers. Bill shoots, editing, prints, travel and image licences, show deposits, add VAT if registered, get a PDF.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Photographer",
  seoTitle: metadata.title as string,
  metaDescription: metadata.description as string,
  h1: "Free Invoice Generator for Photographers",
  heroParagraph:
    "Create clear invoices for sessions, events, editing, prints, travel and image licensing. Give every client a professional summary of what they booked and what they owe.",
  heroSupportingLine: "Suitable for portrait, wedding, event, product and commercial photographers. Works for sole traders and studios, whether or not you're VAT-registered.",
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
    { icon: Download, title: "PDF downloads", description: "Every invoice can be downloaded as a print-ready PDF." },
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
  {
    "question": "Can I create an invoice for a photography package?",
    "answer": "Yes. Add your coverage package as a line item, along with any add-ons like extra hours or a second shooter."
  },
  {
    "question": "Can I add travel and editing charges?",
    "answer": "Yes. Add travel and editing as their own separate line items alongside your coverage package."
  },
  {
    "question": "How do I show a booking deposit?",
    "answer": "Apply a discount to the invoice total to reflect a deposit already paid, so the client sees the remaining balance."
  },
  {
    "question": "Can I invoice printed albums or products?",
    "answer": "Yes. Add prints, albums or other products as their own line items, separate from your photography services."
  },
  {
    "question": "Can I include image licensing fees?",
    "answer": "Yes. Add a line item for image usage or licensing when a client needs commercial rights."
  },
  {
    "question": "Can I download the invoice as a PDF?",
    "answer": "Yes. Every invoice you create can be downloaded as a PDF."
  },
  {
    "question": "Do photographers have to charge VAT?",
    "answer": "Only if you're VAT-registered. If you aren't, leave VAT off the invoice completely. If you are, show your VAT registration number and the VAT charged on the invoice, as GOV.UK requires."
  },
  {
    "question": "Should I put usage rights on a photography invoice?",
    "answer": "Yes, for commercial work it helps. Add the licence fee as its own line and describe what the client can do with the images, such as where they can be used and for how long. The full licence terms belong in your contract; the invoice should match them."
  },
  {
    "question": "When should I send a photography invoice?",
    "answer": "When your contract says payment is due. For weddings and events that is often a deposit invoice at booking and a final invoice for the balance before or after the date; for commercial shoots it's usually when the images are delivered."
  },
  {
    "question": "Can I invoice clients without a registered company?",
    "answer": "Yes. As a sole trader you can invoice in your own name or a trading name. GOV.UK sets out what a sole trader's invoice must show, including your name, any business name you use and, if you use one, an address where legal documents can be delivered to you."
  }
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
    { href: "/invoice-generator-for-small-businesses", label: "Invoice generator for small businesses" },
    { href: "/invoice-generator-for-designers", label: "Invoice generator for designers" },
    { href: "/invoice-generator-for-self-employed", label: "Invoice generator for self-employed people" },
  ],
}

export default function Page() {
  return (
    <>
      <ProfessionSchema data={data} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context": "https://schema.org", "@type": "WebApplication", "@id": "https://makeinvo.com/invoice-generator-for-photographers#app", "name": "MakeInvo Invoice Generator for Photographers", "url": "https://makeinvo.com/invoice-generator-for-photographers", "applicationCategory": "BusinessApplication", "operatingSystem": "Web", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"}, "provider": {"@id": "https://makeinvo.com/#organization"}}).replace(/</g, "\\u003c") }} />
      <ProfessionEditorialLanding
        data={data}
        ukPhotographers
        afterInvoiceDetails={<PhotographyDetails />}
        heroImage={{
          src: "/invoice-generator-for-photographers-webp.webp",
          alt: "Photographer creating a professional invoice with MakeInvo invoice generator",
          title: "Invoice Generator for Photographers",
          objectPosition: "65% 20%",
        }}
      />
    </>
  )
}

function PhotographyDetails() {
 return <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"What a UK Photography Invoice Must Include"}</h2><p className="mt-2 text-lg text-muted-foreground">{"GOV.UK says every invoice must show a unique invoice number, your business name, address and contact details, your client's name and address, a clear description of what you're charging for, the date the service was provided, the invoice date, the amount charged, VAT if applicable, and the total amount owed. Source: "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include">{"GOV.UK – Invoices: what they must include"}</a>{"."}</p><p className="mt-2 text-lg text-muted-foreground">{"For photography work it also helps to add:"}</p><ul className="mt-2 text-lg text-muted-foreground"><li>{"the session or event date and the venue;"}</li><li>{"the package booked, with editing, prints and travel on separate lines;"}</li><li>{"the image licence, if the client is paying for commercial use;"}</li><li>{"any deposit already paid and the balance due."}</li></ul><p className="mt-2 text-lg text-muted-foreground">{"For a full checklist, read "}<Link href="/blog/what-to-include-on-a-uk-invoice">{"what to include on a UK invoice"}</Link>{"."}</p></div><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"Image Licensing and Copyright on Your Invoice"}</h2><p className="mt-2 text-lg text-muted-foreground">{"In the UK, copyright protection is automatic for photographs: you don't have to apply or pay a fee ("}<a href="https://www.gov.uk/copyright">{"GOV.UK – How copyright protects your work"}</a>{"). The author of a work is usually its first owner, unless the photos were taken as an employee or your contract says otherwise ("}<a href="https://www.legislation.gov.uk/ukpga/1988/48/section/11">{"Copyright, Designs and Patents Act 1988, section 11"}</a>{"). So when a business client pays to use your images, they're usually paying for a "}<strong>{"licence"}</strong>{", not the copyright itself."}</p><p className="mt-2 text-lg text-muted-foreground">{"On the invoice, show the licence fee as its own line and describe the usage in a few words, for example \"Licence: website and social media use, 12 months\". Keep the full licence terms in your contract or terms and conditions, and make sure the invoice matches them. If you're asked to transfer the copyright itself, agree that in writing first."}</p></div><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"VAT on Photography Invoices"}</h2><p className="mt-2 text-lg text-muted-foreground">{"Only charge VAT if you're VAT-registered ("}<a href="https://www.gov.uk/vat-registration">{"GOV.UK – VAT registration"}</a>{"). If you are, your invoice must show your VAT registration number and the VAT charged; if you aren't, leave VAT off completely. In MakeInvo you set the tax rate per line, so you can add VAT where it's due and leave it off lines where it isn't."}</p></div><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"Deposits, Booking Fees and Final Balances"}</h2><ul className="mt-2 text-lg text-muted-foreground"><li><strong>{"Deposits:"}</strong>{" wedding and event photographers often take a booking fee or deposit. On the final invoice, list the full package, then apply the deposit already received as a discount and note \"Deposit paid\" in the notes, so the client sees the balance due."}</li><li><strong>{"Balance due date:"}</strong>{" put a specific date on the invoice, matching what your contract says."}</li><li><strong>{"Extra hours or add-ons:"}</strong>{" if coverage runs over or the client orders more prints, add them as their own lines with a short description."}</li><li><strong>{"Cancellations:"}</strong>{" keep cancellation and refund terms in your booking contract rather than on the invoice."}</li></ul><p className="mt-2 text-lg text-muted-foreground">{"Self-employed and invoicing smaller jobs? Use our "}<Link href="/invoice-generator-for-self-employed">{"invoice generator for self-employed people"}</Link>{"."}</p></div><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"Getting Paid on Time"}</h2><p className="mt-2 text-lg text-muted-foreground">{"Send the invoice as soon as the payment stage in your contract is reached, put a specific due date on it, and include your bank details. If a business client pays late, you can usually claim statutory interest and fixed compensation under the Late Payment of Commercial Debts (Interest) Act 1998. See "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery">{"GOV.UK – Late commercial payments"}</a>{". For couples and private clients, agree payment terms in your booking contract before the shoot."}</p></div></section>
}
