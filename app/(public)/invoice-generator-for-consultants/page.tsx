import Link from "next/link"
import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import { ProfessionSchema } from "@/components/profession/profession-schema"
import type { ProfessionPageData } from "@/components/profession/types"
import { Briefcase, Repeat, Target, Wallet, Users, FileText } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-consultants"

export const metadata: Metadata = {
  title: "Consulting Invoice Generator – Free PDF Invoices",
  description:
    "Free invoice generator for consultants. Bill day rates, hours, retainers or milestones, add a PO number and VAT if registered, then download a PDF.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Consulting Invoice Generator – Free PDF Invoices | MakeInvo",
    description:
      "Free invoice generator for consultants. Bill day rates, hours, retainers or milestones, add a PO number and VAT if registered, then download a PDF.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Consultant",
  seoTitle: metadata.title as string,
  metaDescription: metadata.description as string,
  h1: "Free Invoice Generator for Consultants",
  heroParagraph:
    "Bill clients clearly for advisory work, strategy sessions, retainers and project milestones. MakeInvo helps consultants turn professional services into organised, client-ready invoices.",
  heroSupportingLine: "Designed for business, marketing, IT, HR, management and independent consultants. Bill by the hour, the day, the month or the milestone, in GBP or your client's currency.",
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
  {
    "question": "Can I create hourly consulting invoices?",
    "answer": "Yes. Add a line item with your hours and rate, and MakeInvo calculates the amount automatically."
  },
  {
    "question": "How do I invoice a monthly retainer?",
    "answer": "Add the retainer as a line item and note the billing period in the description, for example \"Monthly retainer - April\"."
  },
  {
    "question": "Can I bill project milestones?",
    "answer": "Yes. Add each milestone as its own line item so the invoice matches your proposal or statement of work."
  },
  {
    "question": "Can expenses be shown separately?",
    "answer": "Yes. Add expenses as their own line items, separate from your professional fees."
  },
  {
    "question": "Can I add a purchase order number?",
    "answer": "Yes. There's a dedicated PO number field on every invoice."
  },
  {
    "question": "Can I reuse saved client details?",
    "answer": "Yes, once you register a free account - saved clients can be selected on future invoices instead of retyping their details."
  },
  {
    "question": "Can I invoice a day rate?",
    "answer": "Yes. Enter the number of days as the quantity and your day rate as the price, and describe the work and dates in the line, for example \"Strategy workshop – 3 days, 4–6 March\". MakeInvo calculates the total."
  },
  {
    "question": "Do consultants have to charge VAT?",
    "answer": "Only if you're VAT-registered. If you aren't, don't add VAT or a VAT number to the invoice. If you are, show your VAT registration number and the VAT on each line, as GOV.UK requires."
  },
  {
    "question": "How do I invoice a client outside the UK?",
    "answer": "Choose the currency you agreed with the client and describe the services clearly. Business-to-business services supplied to overseas clients are often outside the scope of UK VAT, but the rules depend on the service and where the client belongs, so check HMRC's place-of-supply guidance or ask your accountant."
  },
  {
    "question": "Should travel expenses go on the invoice?",
    "answer": "Yes, as separate lines from your fees, so the client can approve them against their expenses policy. If you're VAT-registered, expenses you recharge are usually part of your supply and VAT applies; only true disbursements paid as the client's agent are treated differently."
  }
],

  finalCtaHeading: "Create a clear invoice for your consulting work",
  finalCtaText: "Add your fees, retainer or milestone, then download a professional PDF invoice your client can approve quickly.",

  relatedLinks: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#invoice-examples", label: "Invoice Examples" },
  ],
  crossLinks: [
    { href: "/invoice-generator-for-contractors", label: "Invoice generator for contractors" },
    { href: "/invoice-generator-for-freelancers", label: "Invoice generator for freelancers" },
    { href: "/invoice-generator-for-agencies", label: "Invoice generator for agencies" },
    { href: "/invoice-generator-for-self-employed", label: "Invoice generator for self-employed people" },
  ],
}

export default function Page() {
  return (
    <>
      <ProfessionSchema data={data} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context": "https://schema.org", "@type": "WebApplication", "@id": "https://makeinvo.com/invoice-generator-for-consultants#app", "name": "MakeInvo Consulting Invoice Generator", "url": "https://makeinvo.com/invoice-generator-for-consultants", "applicationCategory": "BusinessApplication", "operatingSystem": "Web", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"}, "provider": {"@id": "https://makeinvo.com/#organization"}}).replace(/</g, "\\u003c") }} />
      <ProfessionEditorialLanding
        data={data}
        ukConsulting
        afterInvoiceDetails={<ConsultingDetails />}
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

function ConsultingDetails() {
  return <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"What a UK Consultancy Invoice Must Include"}</h2><p className="mt-2 text-lg text-muted-foreground">{"GOV.UK says every invoice must show a unique invoice number, your business name, address and contact details, your client's name and address, a clear description of what you're charging for, the date the service was supplied, the invoice date, the amount charged, VAT if applicable and the total owed. Source: "}<a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include">{"GOV.UK – Invoices: what they must include"}</a>{"."}</p><p className="mt-2 text-lg text-muted-foreground">{"Consultancy clients usually need a few more details before their accounts team will approve payment: - the engagement, project or statement-of-work reference from your proposal; - the client's purchase order (PO) number, if they gave you one; - the service period or milestone the invoice covers; - the fee basis (hourly, day rate, fixed fee, retainer or milestone)."}</p><p className="mt-2 text-lg text-muted-foreground">{"For a full checklist, read "}<Link href="/blog/what-to-include-on-a-uk-invoice">{"what to include on a UK invoice"}</Link>{"."}</p></div><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"Day Rate, Hourly, Retainer or Fixed Fee"}</h2><ul className="mt-2 text-lg text-muted-foreground"><li><strong>{"Day rate:"}</strong>{" enter the number of days as the quantity and your day rate as the price. Put the dates or the workshop name in the description."}</li><li><strong>{"Hourly:"}</strong>{" enter the hours and your hourly rate; MakeInvo calculates the line total."}</li><li><strong>{"Monthly retainer:"}</strong>{" one line per month, with the period in the description (for example \"Advisory retainer – April\")."}</li><li><strong>{"Fixed fee or milestone:"}</strong>{" one line per milestone, using the same name as your proposal so the client can match it."}</li></ul><p className="mt-2 text-lg text-muted-foreground">{"Keep any reimbursable expenses on their own lines."}</p><p className="mt-2 text-lg text-muted-foreground">{" Freelancing rather than consulting? Use our "}<Link href="/invoice-generator-for-freelancers">{"freelance invoice generator"}</Link>{"."}</p></div><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"VAT on Consulting Invoices"}</h2><p className="mt-2 text-lg text-muted-foreground">{"Only charge VAT if you're VAT-registered. If you are, your invoice must show your VAT registration number and the VAT charged; if you aren't, leave VAT off completely. Consultancy supplied to UK clients is normally standard-rated when you're registered. Work for business clients overseas is often outside the scope of UK VAT, but it depends on the service and where your client belongs. See "}<a href="https://www.gov.uk/guidance/vat-place-of-supply-of-services-notice-741a">{"HMRC: place of supply of services"}</a>{" or ask your accountant. In MakeInvo you set the tax rate per line, so you can apply it only where it's due."}</p></div><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"Recharged Expenses vs Disbursements"}</h2><p className="mt-2 text-lg text-muted-foreground">{"Travel, accommodation and other costs you incur while doing the work are usually "}<strong>{"recharged expenses"}</strong>{". They're part of your supply, so if you're VAT-registered, VAT is normally charged on them too. A "}<strong>{"disbursement"}</strong>{" is different: a cost you pay purely as your client's agent (for example a filing fee in the client's name), which can be passed on without VAT if HMRC's conditions are met. Show both on separate lines from your fees. HMRC's rules are in "}<a href="https://www.gov.uk/guidance/vat-guide-notice-700">{"VAT Notice 700"}</a>{"."}</p></div><div className="mb-12 max-w-3xl"><h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{"Getting Paid on Time"}</h2><p className="mt-2 text-lg text-muted-foreground">{"Agree payment terms in your proposal, put a specific due date on the invoice rather than only \"30 days\", and quote the PO number your client gave you; invoices without one are often sent back. If a business client pays late, you can claim statutory interest and fixed compensation under the Late Payment of Commercial Debts (Interest) Act 1998. See "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery">{"GOV.UK – Late commercial payments"}</a>{"."}</p></div></section>
}
