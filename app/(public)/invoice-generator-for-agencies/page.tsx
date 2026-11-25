import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import { ProfessionEditorialLanding } from "@/components/profession/profession-editorial-landing"
import Link from "next/link"
import type { ReactNode } from "react"
import type { ProfessionPageData } from "@/components/profession/types"
import { Repeat, BarChart3, Users, CreditCard, Building2, FileText } from "lucide-react"

const siteUrl = getSiteUrl()
const slug = "invoice-generator-for-agencies"

export const metadata: Metadata = {
  title: { absolute: "Invoice Generator for Agencies UK: Retainers & Projects" },
  description:
    "Free invoice generator for agencies: bill retainers, project milestones, approved extras and expenses, then download a PDF invoice. No watermark.",
  alternates: { canonical: `${siteUrl}/${slug}` },
  openGraph: {
    title: "Invoice Generator for Agencies UK: Retainers & Projects",
    description:
      "Free invoice generator for agencies: bill retainers, project milestones, approved extras and expenses, then download a PDF invoice. No watermark.",
    url: `${siteUrl}/${slug}`,
    type: "website",
  },
}

const data: ProfessionPageData = {
  slug,
  audienceLabel: "Agency",
  seoTitle: "Invoice Generator for Agencies UK: Retainers & Projects",
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
    { title: "Send the invoice", description: "Download the PDF and email it to your client yourself. Sign in to review saved invoice status." },
  ],

  featuresHeading: "Built for ongoing client billing",
  features: [
    { icon: Repeat, title: "Recurring invoices", description: "Set up monthly retainer invoice rules on the Pro plan. Download and email each invoice yourself.", paidPlan: true },
    { icon: Building2, title: "Retainer billing", description: "Bill a fixed monthly retainer with the billing period stated clearly." },
    { icon: FileText, title: "Project milestones", description: "Invoice milestones separately from retainers so each charge is easy to trace." },
    { icon: Users, title: "Client history", description: "Signed-in users on eligible paid plans can save clients and review their billing history." },
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
    { question: "Can agencies create recurring invoices?", answer: "Yes, on the Pro plan you can set up monthly recurring invoice rules for retainer billing. Download and email each invoice to your client yourself; automatic email delivery is not currently available." },
    { question: "How should a monthly retainer appear?", answer: "Add it as a line item and note the billing period in the description, for example \"Monthly marketing retainer - May\"." },
    { question: "Can project milestones be invoiced separately?", answer: "Yes. Add each milestone as its own line item, separate from any retainer, so it's easy to trace against your proposal." },
    { question: "Can I track unpaid agency invoices?", answer: "Yes, once you're signed in - your dashboard shows the status of every invoice across all your clients." },
    { question: "Can I manage multiple clients?", answer: "Yes. Signed-in users on eligible paid plans can save multiple client accounts and review each one's billing history separately." },
    { question: "Can I add approved expenses and purchase orders?", answer: "Yes. Add expenses as their own line items and include a PO number where your client's process requires one." },
    {"question": "What should a UK agency invoice include?", "answer": "At a minimum: a unique invoice number, the invoice date, your business name and address, the client's name and address, a description of what you're billing for, the amount, and any VAT. For agencies it also helps to show the billing period, a PO or project reference, and your payment terms and bank details. GOV.UK lists what an invoice must include. Exact invoice requirements can vary by country, business type and tax status. MakeInvo provides invoice-creation software, not legal, tax or accounting advice.", "answerLinks": [{"label": "GOV.UK lists what an invoice must include", "href": "https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include"}]},
    {"question": "How do I invoice ad spend separately from my agency fee?", "answer": "Add the agency fee and the ad spend (or other third-party costs) as separate line items, and name the platform and period in the description, for example \"Google Ads spend - May\". Keeping them apart shows the client exactly what is your fee and what is passed through. How VAT applies to pass-through costs depends on your contract and how you're set up, so check GOV.UK's VAT guidance or ask your accountant.", "answerLinks": [{"label": "GOV.UK's VAT guidance", "href": "https://www.gov.uk/vat-record-keeping/vat-invoices"}]},
    {"question": "Do I need to charge VAT on agency invoices?", "answer": "If your business is VAT registered, you generally add VAT to taxable services and show your VAT number on the invoice. If you're not registered, you don't charge VAT. GOV.UK explains what a VAT invoice must show. This is general information, not tax advice.", "answerLinks": [{"label": "GOV.UK explains what a VAT invoice must show", "href": "https://www.gov.uk/vat-record-keeping/vat-invoices"}]},
    {"question": "How do I show hours used against a retainer?", "answer": "Describe the retainer allowance in the line item, for example the number of hours included for the month, then add any extra hours as a separate line so the client can see what was covered and what was additional. Agree in your contract how unused or extra hours are treated before you invoice."},
    {"question": "What payment terms should I put on an agency invoice?", "answer": "State the due date or payment period clearly and use the same terms across clients where you can. Your contract or agreement with the client takes priority. For businesses billing other businesses, GOV.UK explains interest and debt recovery on late commercial payments.", "answerLinks": [{"label": "GOV.UK explains interest and debt recovery on late commercial payments", "href": "https://www.gov.uk/late-commercial-payments-interest-debt-recovery"}]},
    {"question": "Can I create an agency invoice without signing up?", "answer": "Yes. You can create a guest invoice and download it as a PDF without an account. Sign in to see saved invoice history. Saving clients and using recurring invoices or payment tracking also require an eligible paid plan."},
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

const disclaimer = "Exact invoice requirements can vary by country, business type and tax status. MakeInvo provides invoice-creation software, not legal, tax or accounting advice."

function AgencySection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 max-w-3xl">
        <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{heading}</h2>
      </div>
      {children}
    </section>
  )
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: data.h1, item: `${siteUrl}/${slug}` },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/${slug}#faq`,
      mainEntity: data.faqs.map((faq) => ({
        "@type": "Question", name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/${slug}#app`,
      name: "MakeInvo Invoice Generator for Agencies",
      url: `${siteUrl}/${slug}`,
      description: "Create agency invoices for monthly retainers, project milestones, approved additional work and reimbursable expenses, then download a PDF invoice.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript. Works in modern browsers.",
      featureList: [
        "Retainer line items with the billing period stated",
        "Project milestones invoiced as separate charges",
        "Expenses and PO or account references on each invoice",
        "PDF invoice download",
        "Guest invoices without signing up",
        "Client history and payment tracking (eligible paid plans)",
        "Monthly recurring invoice rules (Pro plan; email invoices yourself)",
      ],
      provider: { "@type": "Organization", name: "MakeInvo", url: siteUrl },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <ProfessionEditorialLanding
        data={data}
        ukAgencies
        invoiceIntro={<p className="mt-2 text-muted-foreground">For UK invoices, <a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include" target="_blank" rel="noopener" className="text-primary underline">GOV.UK explains what an invoice must include</a>.</p>}
        afterWorkflow={<><AgencySection heading="How to Lay Out Retainers, Projects and Extra Work"><p className="leading-relaxed text-muted-foreground">{"Agency work mixes recurring and one-off charges, and clients find invoices easier to approve when each one has its own line. A clear layout looks like this:"}</p><ul className="mt-4 space-y-3"><li className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-sm"><p className="text-sm font-medium text-foreground"><strong>{"Retainer:"}</strong>{" one line for the monthly fee, with the billing period in the description (for example \"Monthly marketing retainer - May\")."}</p></li><li className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-sm"><p className="text-sm font-medium text-foreground"><strong>{"Projects and milestones:"}</strong>{" one line per milestone, named as it appears in your proposal."}</p></li><li className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-sm"><p className="text-sm font-medium text-foreground"><strong>{"Approved additional work:"}</strong>{" its own line once the client has signed it off, rather than adding it to the retainer."}</p></li><li className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-sm"><p className="text-sm font-medium text-foreground"><strong>{"Expenses:"}</strong>{" one line for each reimbursable cost, with the supplier or platform named."}</p></li><li className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-sm"><p className="text-sm font-medium text-foreground"><strong>{"References:"}</strong>{" the client's PO number or account reference, and your invoice number, so their finance team can match it quickly."}</p></li></ul></AgencySection><AgencySection heading="Invoicing Ad Spend and Other Pass-Through Costs"><p className="leading-relaxed text-muted-foreground">{"If you buy media or software on a client's behalf, keep your own fee and the pass-through cost on separate lines. Name the platform and the period (\"Google Ads spend - May\"), so the client can see what you charged for your work and what went to the platform. How VAT applies to costs you pass on depends on your contract and how you're set up, so check "}<a href="https://www.gov.uk/vat-record-keeping/vat-invoices" target="_blank" rel="noopener" className="text-primary underline">{"GOV.UK's guidance on VAT invoices"}</a>{" or ask your accountant before you send."}</p></AgencySection></>}
        afterBestPractices={<><AgencySection heading="Retainer Hours, Extra Hours and Unused Time"><p className="leading-relaxed text-muted-foreground">{"Many agencies include a set number of hours in the retainer. If yours does, say so in the line description and show any extra hours separately, so the client can see what the retainer covered and what was additional. Decide in your contract how unused hours are treated (carried over or not) and invoice in line with that agreement; the invoice should never be the first place a client reads it."}</p></AgencySection><AgencySection heading="Payment Terms and Late Payment for Agency Invoices"><p className="leading-relaxed text-muted-foreground">{"State the due date or payment period on every invoice and keep the terms consistent across clients where you can. Your agreement with the client comes first. For payments between businesses, "}<a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery" target="_blank" rel="noopener" className="text-primary underline">{"GOV.UK explains interest and debt recovery on late commercial payments"}</a>{". Checking your outstanding invoices regularly, rather than waiting for a client to query one, is the easiest habit to build, and the MakeInvo dashboard shows paid, sent and overdue status once you're signed in."}</p></AgencySection></>}
        faqNote={<p className="mb-8 text-sm text-muted-foreground">{disclaimer}</p>}
        relatedCopy={<p className="mt-6 text-sm text-muted-foreground">Working on your own? See the invoice generators for <Link href="/invoice-generator-for-freelancers" className="text-primary underline">freelancers</Link>, <Link href="/invoice-generator-for-consultants" className="text-primary underline">consultants</Link>, <Link href="/invoice-generator-for-designers" className="text-primary underline">designers</Link> and <Link href="/invoice-generator-for-small-businesses" className="text-primary underline">small businesses</Link>, or browse our <Link href="/invoice-templates" className="text-primary underline">invoice templates</Link>.</p>}
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
