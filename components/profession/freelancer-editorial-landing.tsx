"use client"

import { Suspense, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EmbeddedInvoiceGenerator } from "@/components/marketing/embedded-invoice-generator"
import {
  ArrowRight,
  Bolt,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Contact,
  CreditCard,
  Download,
  FileDown,
  FileText,
  Gavel,
  Globe2,
  History,
  IdCard,
  Layers,
  ReceiptText,
  ScrollText,
  ShieldCheck,
  Timer,
  UserX,
  Workflow,
} from "lucide-react"

const FREELANCER_GENERATOR_URL = "/invoice-generator-for-freelancers?mode=freelancer&layout=creative#invoice-generator"

const frictionCards = [
  {
    label: "01 — Friction",
    title: "Starting from scratch every time",
    body: "Re-formatting templates in Google Docs or Word with delicate table lines that shift unexpectedly whenever you paste notes.",
  },
  {
    label: "02 — Friction",
    title: "Missing critical client details",
    body: "Omitting mandatory PO numbers, registered legal addresses, or VAT identification, triggering instant rejection by corporate AP teams.",
  },
  {
    label: "03 — Friction",
    title: "Clashing rates & deliverables",
    body: "Conflating day rates with flat-fee project deliverables, confusing accounting departments and stalling your cash transfer.",
  },
  {
    label: "04 — Friction",
    title: "Scattered client accounts",
    body: "Hunting down scattered PDFs on personal laptops without a unified record of who has paid and whose balance is outstanding.",
  },
  {
    label: "05 — Friction",
    title: "Awkward post-due chaseups",
    body: "Having to craft delicate reminder emails without crisp date-stamped records or clear net-term penalty disclosures.",
  },
  {
    label: "06 — Friction",
    title: "Duplicate & broken numbering",
    body: "Accidentally sending two clients INV-004, causing bookkeeping confusion and audit compliance flags down the line.",
  },
]

const benefits = [
  {
    icon: Workflow,
    title: "Hourly & Fixed on One Bill",
    body: "Add hourly or fixed-price services on the same invoice, with quantities, hourly rates, and unit measures you control with total precision.",
    tag: "Flexible calculations",
  },
  {
    icon: Layers,
    title: "Discrete Line Items",
    body: "Separate multiple project deliverables into their own clear line items instead of burying your value under one ambiguous grand total.",
    tag: "Transparent breakdown",
  },
  {
    icon: ReceiptText,
    title: "Dedicated Expenses",
    body: "Add hardware, software passes, or transit as their own distinct line items, so a client can see exactly what they are reimbursing.",
    tag: "Reimbursable audit",
  },
  {
    icon: Timer,
    title: "Defined Due Dates",
    body: "Set unambiguous Net-7, Net-14, or Net-30 payment terms so settlement expectations are never left to guesswork.",
    tag: "Predictable cashflow",
  },
  {
    icon: Contact,
    title: "Repeat Client Memory",
    body: "Save recurring corporate tax identifiers, billing contacts, and banking routes once you register, avoiding manual re-entry.",
    tag: "Instant profile pull",
  },
  {
    icon: FileDown,
    title: "Direct Vector PDF Export",
    body: "Download a clean, crisp, print-ready vector PDF document the instant your draft is confirmed, compliant with document engines.",
    tag: "High-DPI typography",
  },
]

const checklist = [
  { title: "Your Freelance Brand Name", body: "Legal name or registered trading DBA." },
  { title: "Complete Contact Details", body: "Email, phone, and legal business address." },
  { title: "Client Billing Address", body: "Company legal entity and attention contact." },
  { title: "Unique Invoice Identifier", body: "Sequential numbering format (e.g. INV-1042)." },
  { title: "Issue Date", body: "The explicit day services were formalized." },
  { title: "Definite Due Date", body: "Clear target deadline for remittance." },
  { title: "Scope & Deliverable Spec", body: "Readable summary of tasks performed." },
  { title: "Quantity, Hours & Rate", body: "Standardized unit multiplication metrics." },
  { title: "Tax & VAT Disclosures", body: "Explicit statutory tax rate or 0% reverse charge." },
  { title: "Reimbursable Outlays", body: "Documented direct project expenses." },
  { title: "Gross & Net Totals", body: "Clear bottom-line figure in chosen currency." },
  { title: "Payment Instructions", body: "IBAN, BIC/SWIFT, ACH routing, or payment link." },
]

const steps = [
  { icon: IdCard, title: "Add your details", body: "Enter your professional details, contact information, and your client's billing coordinates with zero form overhead.", tag: "Fast auto-complete" },
  { icon: Layers, title: "List the work", body: "Add your project phases, log recorded hours, attach reimbursable expenses, or bill agreed milestone charges.", tag: "Dynamic itemization" },
  { icon: Calculator, title: "Check the totals", body: "Review automatically calculated sub-totals, applicable tax rates, discounts, and payment terms before dispatch.", tag: "Real-time computation" },
  { icon: Download, title: "Download the PDF", body: "Generate and instantly download a beautiful, crisp, print-standard client-ready PDF directly to your device.", tag: "Immediate output" },
]

const features = [
  { icon: Timer, title: "Hourly and Project Billing", body: "Easily combine billable timesheet hours with fixed deliverables without requiring two separate invoice documents.", tag: "Adaptive rate units" },
  { icon: IdCard, title: "Saved Client Details", body: "Store recurring client profiles securely. One tap loads their registered VAT registration, attention tags, and mailing address.", tag: "Zero duplicate entry" },
  { icon: FileText, title: "Professional PDF Invoices", body: "Flawlessly rendered vector PDFs ready to email or upload to accounts portals, retaining sharpness at any zoom level.", tag: "International standards" },
  { icon: Globe2, title: "Multiple Currencies", body: "Bill in USD, EUR, GBP, CAD, AUD, or dozens of worldwide denominations with proper localized currency symbols.", tag: "Global freelance ready" },
  { icon: Gavel, title: "Clear Payment Terms", body: "Pre-populate standard freelance late fee clauses, deposit release milestones, and remittance account coordinates.", tag: "Contractual safeguards" },
  { icon: History, title: "Central Invoice History", body: "Search, filter, and re-download any invoice you've ever produced. Never lose track of what you billed on past projects.", tag: "Searchable archive" },
]

const tips = [
  { title: "Invoice immediately on milestone completion", body: "Don't wait for month-end. Fresh deliverables get approved and settled far faster than aged requests." },
  { title: "Always specify the client's PO number", body: "Finance teams will quarantine any invoice that lacks an internal matching purchase order reference." },
  { title: "Clearly separate expenses from time", body: "Highlight software or transit purchases on distinct rows so company tax write-offs are instant for accounts." },
  { title: "Use precise dates rather than Net terms only", body: "Writing \"Due: 24 October 2026\" works significantly better than ambiguous \"Net 30\" wording." },
  { title: "Provide clear electronic payment links", body: "Include IBAN, sort codes, or instant payment links directly in the footer note to avoid remittance lag." },
  { title: "Send PDF format exclusively", body: "Never email editable spreadsheets or Docs that can be inadvertently altered during internal forwarding." },
]

const relatedSolutions = [
  { href: "/invoice-generator-for-designers", eyebrow: "Creative Services", title: "Invoice Generator for Designers", body: "Tailored for Figma mocks, revision rounds, brand identities, and commercial asset licensing." },
  { href: "/invoice-generator-for-photographers", eyebrow: "Visual Media", title: "Invoice Generator for Photographers", body: "Built for half-day rates, equipment rentals, studio fees, and image licensing rights." },
  { href: "/invoice-generator-for-self-employed", eyebrow: "Independent Operators", title: "Invoice Generator for Self-Employed", body: "Designed for sole traders who need straightforward billing without the complex accounting bloat." },
]

const faqs = [
  {
    q: "Can I create and download an invoice without creating an account?",
    a: "Yes. You can immediately create, format, and download a client-ready PDF as a guest with no signup, credit card, or email verification required. An account is only needed if you wish to securely save client details and archive your billing history.",
  },
  {
    q: "Are there any watermarks on the free downloaded PDF?",
    a: "None whatsoever. Every PDF generated by MakeInvo is 100% free of promotional watermarks, badges, or platform branding, presenting a pristine, professional impression directly to your clients.",
  },
  {
    q: "Can I bill in multiple currencies for international clients?",
    a: "Yes. MakeInvo supports all major global currencies including USD ($), GBP (£), EUR (€), CAD ($), AUD ($), and many others. Simply select the target currency before exporting.",
  },
  {
    q: "Can I mix fixed deliverables and hourly billable time?",
    a: "Absolutely. Each row in your invoice allows customized units: define one line as hourly rates (e.g. 15 hrs @ £80/hr) and another as a lump milestone or flat software expense pass. Totals are aggregated automatically.",
  },
  {
    q: "How does MakeInvo handle taxes like VAT or Sales Tax?",
    a: "You can toggle tax calculation per line item or specify a blanket rate across the entire invoice. You can also input 0% reverse-charge notes or VAT registration IDs to maintain cross-border compliance.",
  },
  {
    q: "What happens to my data if I don't sign up?",
    a: "Guest invoices are generated entirely client-side inside your browser session and are not stored permanently on our servers. Once you close the tab, your private billing details leave no residual footprint.",
  },
]

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.q} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left font-semibold text-foreground focus:outline-none"
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-primary transition-transform ${isOpen ? "rotate-180" : "text-muted-foreground"}`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 leading-relaxed text-muted-foreground">{item.a}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function FreelancerEditorialLanding() {
  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col items-start space-y-4 lg:col-span-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Editorial Studio Edition
            </div>
            <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Invoice Generator for <span className="font-normal italic text-primary">Freelancers</span>
            </h1>
            <p className="max-w-xl pt-1 text-lg leading-relaxed text-muted-foreground">
              Turn completed work into a clear, professional invoice without wasting time formatting documents.
              MakeInvo helps freelancers list projects, hours, rates, expenses and payment terms, then generate a
              client-ready PDF invoice.
            </p>
            <p className="text-sm italic text-muted-foreground/80">
              Useful for developers, writers, marketers, virtual assistants, creatives, and independent professionals
              worldwide.
            </p>
            <div className="flex w-full flex-wrap items-center gap-4 pt-2">
              <Link href={FREELANCER_GENERATOR_URL}>
                <Button size="lg" className="gap-2 rounded-full px-8 py-6 text-base shadow-md">
                  Create a Free Invoice
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center font-semibold text-foreground underline decoration-1 underline-offset-8 transition-all hover:text-primary hover:decoration-primary/40 hover:underline-offset-4"
              >
                Create a Free Account
              </Link>
            </div>
            <div className="grid w-full max-w-lg grid-cols-3 gap-4 pt-4">
              <div className="rounded-lg bg-card p-3 shadow-sm">
                <span className="block text-lg font-bold text-foreground">&lt; 90s</span>
                <span className="text-xs text-muted-foreground">Avg. build time</span>
              </div>
              <div className="rounded-lg bg-card p-3 shadow-sm">
                <span className="block text-lg font-bold text-primary">100%</span>
                <span className="text-xs text-muted-foreground">Fee transparent</span>
              </div>
              <div className="rounded-lg bg-card p-3 shadow-sm">
                <span className="block text-lg font-bold text-foreground">Zero</span>
                <span className="text-xs text-muted-foreground">Watermarks</span>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:col-span-6 lg:mt-0">
            <div className="relative mx-auto h-[420px] max-w-[540px] overflow-hidden rounded-2xl bg-muted shadow-xl sm:h-[480px]">
              <Image
                src="/freelancer-invoice-generator-hero.webp.webp"
                alt="Freelancer creating a professional invoice with MakeInvo invoice generator"
                title="Invoice Generator for Freelancers"
                fill
                priority
                unoptimized
                className="object-cover object-[65%_20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-white/90 drop-shadow-sm">
                <span>London Creative Studio • Independent Contractor</span>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-4 w-72 -rotate-3 rounded-xl bg-card p-4 shadow-2xl transition-transform duration-300 hover:rotate-0 sm:-left-8 sm:w-80">
              <div className="flex items-start justify-between pb-3">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">Draft Preview</span>
                  <span className="text-xl font-bold text-foreground">INV-1042</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                  <Check className="h-3.5 w-3.5" />
                  Approved
                </span>
              </div>
              <div className="space-y-1.5 py-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Frontend Architecture</span>
                  <span className="font-semibold text-foreground">£1,840.00</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>API Integration</span>
                  <span className="font-semibold text-foreground">£768.00</span>
                </div>
              </div>
              <div className="mt-1 flex items-baseline justify-between pt-3">
                <span className="text-xs text-muted-foreground">Amount Payable</span>
                <span className="text-xl font-bold text-primary">£2,608.00</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Net 14 Days
                </span>
                <span>Northbridge Retail Ltd</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 pb-16 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
          <EmbeddedInvoiceGenerator />
        </Suspense>
      </section>

      {/* TRUST STRIP */}
      <section className="w-full bg-muted/40 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-center text-sm font-medium text-muted-foreground sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-primary" /> No credit card required
          </span>
          <span className="text-border">/</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" /> No watermark
          </span>
          <span className="text-border">/</span>
          <span className="inline-flex items-center gap-1.5">
            <Download className="h-4 w-4 text-primary" /> Instant PDF download
          </span>
          <span className="text-border">/</span>
          <span className="inline-flex items-center gap-1.5">
            <UserX className="h-4 w-4 text-primary" /> No signup needed for guest invoices
          </span>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="my-4 w-full bg-slate-950 py-16 text-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">The Administrative Drag</span>
                <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Freelance invoicing should not take longer than the work
                </h2>
                <p className="leading-relaxed text-slate-300">
                  Most billing mistakes happen when you try to bend rigid word processors and generic spreadsheets
                  into fiscal ledgers. Every extra click is billable time lost.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-700/60 bg-slate-800/80 p-6 shadow-xl">
                <span className="block text-5xl font-bold leading-none text-primary">3.8 hrs</span>
                <span className="mt-2 block font-semibold text-white">
                  Average lost to manual administrative billing per month
                </span>
                <p className="mt-2 text-sm text-slate-400">
                  Independent contractors spend hours wrestling formatting bugs, calculating fractional VAT rates,
                  and combing sent mail folders to confirm payment terms.
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-slate-700/50 pt-4">
                  <Timer className="h-7 w-7 text-primary" />
                  <span className="text-sm font-medium text-slate-300">
                    Reclaim your weekend hours with zero-friction generation.
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2 lg:col-span-7">
              {frictionCards.map((card, i) => (
                <div
                  key={card.title}
                  className={`relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-md transition-all hover:shadow-lg ${
                    i % 2 === 1 ? "sm:translate-y-4" : ""
                  }`}
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                  <span className="mb-1 block font-mono text-xs text-primary/80">{card.label}</span>
                  <h3 className="mb-2 font-semibold text-white">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BILLING BENEFITS */}
      <section className="w-full bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Practical Principles</span>
            <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">
              Keep freelance billing clear and consistent
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              A structured framework designed specifically for independent contracts, agile retainers, and multi-tier
              deliverables.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item, i) => (
              <div key={item.title} className="flex flex-col justify-between rounded-2xl bg-card p-6 shadow-sm">
                <div>
                  <span className="mb-4 block select-none text-5xl font-extrabold leading-none text-primary/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
                <div className="mt-4 flex items-center pt-4 text-sm font-semibold text-primary">
                  <item.icon className="mr-1.5 h-4 w-4" /> {item.tag}
                </div>
              </div>
            ))}
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-card p-6 shadow-sm md:col-span-2 md:flex-row md:items-center lg:col-span-3">
              <div className="max-w-2xl">
                <span className="mb-2 block select-none text-5xl font-extrabold leading-none text-primary/25">07</span>
                <h3 className="mb-2 text-lg font-bold text-foreground">Complete Ledger History</h3>
                <p className="leading-relaxed text-muted-foreground">
                  Maintain an archived chronological trail when signed in, ensuring past engagements, historical
                  hourly rates, and proof-of-delivery are always one keystroke away.
                </p>
              </div>
              <Link href={FREELANCER_GENERATOR_URL} className="shrink-0">
                <Button className="gap-2 rounded-full px-6 py-5 shadow-sm">
                  Launch Invoicer
                  <Bolt className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INVOICE ANATOMY & CHECKLIST */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Standard Specification</span>
          <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">
            What to include on a freelance invoice
          </h2>
          <p className="mt-2 text-muted-foreground">
            A quick reference checklist of elements required by enterprise accounts teams and independent tax
            authorities.
          </p>
        </div>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {checklist.map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-lg bg-card p-3 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-md lg:col-span-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Document Anatomy</span>
              <span className="text-xs text-muted-foreground">Format: Standard A4 / Letter</span>
            </div>
            <div className="space-y-3 rounded-xl bg-muted/40 p-4">
              <div className="flex items-center justify-between rounded bg-card p-2.5 shadow-sm">
                <span className="text-[11px] font-bold text-primary">1. SENDER BRAND &amp; ADDRESS</span>
                <span className="text-[11px] text-muted-foreground">LOGO</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-card p-2 shadow-sm">
                  <span className="block text-[10px] text-muted-foreground">2. BILLED CLIENT</span>
                  <span className="text-[11px] font-semibold text-foreground">Client Org &amp; Tax ID</span>
                </div>
                <div className="rounded bg-card p-2 shadow-sm">
                  <span className="block text-[10px] text-muted-foreground">3. INVOICE META</span>
                  <span className="text-[11px] font-semibold text-foreground">ID, Issue, Due Date</span>
                </div>
              </div>
              <div className="space-y-1.5 rounded bg-card p-2.5 shadow-sm">
                <span className="block text-[10px] font-bold text-primary">4. ITEMIZED WORK SCHEDULE</span>
                <div className="h-2 w-full rounded-full bg-muted" />
                <div className="h-2 w-4/5 rounded-full bg-muted" />
                <div className="h-2 w-3/4 rounded-full bg-muted" />
              </div>
              <div className="flex items-center justify-between rounded bg-primary/10 p-2.5 shadow-sm">
                <span className="text-[11px] font-bold text-primary">5. SUB-TOTAL, TAX, GRAND SUM</span>
                <span className="text-sm font-bold text-primary">£2,608.00</span>
              </div>
              <div className="rounded bg-card p-2 shadow-sm">
                <span className="block text-[10px] text-muted-foreground">6. REMITTANCE DETAILS &amp; IBAN</span>
                <span className="font-mono text-[11px] text-foreground">GB82 MIDL 4005 1512 3456 78</span>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              MakeInvo automatically standardizes these structural blocks on export to eliminate human billing
              oversight.
            </p>
          </div>
        </div>
      </section>

      {/* FOUR-STEP PROCESS */}
      <section className="w-full bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Step-by-Step</span>
            <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">
              Create a freelance invoice in four steps
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              From contract milestone completion to downloadable PDF in under two minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col justify-between rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div>
                  <span className="mb-4 block text-5xl font-black leading-none text-primary/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
                <div className="mt-6 flex items-center pt-4 text-sm text-muted-foreground">
                  <step.icon className="mr-1.5 h-4 w-4 text-primary" /> {step.tag}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href={FREELANCER_GENERATOR_URL}>
              <Button size="lg" className="gap-2 rounded-full px-8 py-6 text-base shadow-md">
                Create a Free Invoice
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Platform Capabilities</span>
          <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">
            Built around real freelance workflows
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Engineered specifically to solve the real quirks of modern remote contracting and client billing.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col justify-between rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{feature.body}</p>
              </div>
              <span className="mt-4 flex items-center text-sm font-semibold text-primary">
                {feature.tag} <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* INVOICE EXAMPLE */}
      <section className="relative w-full overflow-hidden bg-slate-950 py-16 text-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Artisanal Document Sample</span>
            <h2 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
              What a freelancer invoice can look like
            </h2>
            <p className="mt-2 text-slate-400">
              An illustrative example — your invoice will reflect your own business, client, deliverables, and
              chosen currency.
            </p>
          </div>

          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200/40 bg-[#faf8f5] p-6 text-foreground shadow-2xl sm:p-10">
            <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-primary" />
            <div className="flex flex-col items-start justify-between gap-4 pb-6 sm:flex-row">
              <div>
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-primary">
                  Freelance Software Engineer
                </span>
                <h3 className="text-2xl font-bold text-foreground">Alex Morgan</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Studio 4B, The Old Granary
                  <br />
                  London, E2 8AA
                  <br />
                  alex@morgan-code.co.uk
                </p>
              </div>
              <div className="sm:text-right">
                <span className="block text-xl font-bold tracking-tight text-foreground">INVOICE</span>
                <span className="mt-0.5 block font-semibold text-primary">INV-1042</span>
                <div className="mt-2 space-y-0.5 text-sm text-muted-foreground">
                  <div>
                    Issue Date: <span className="font-medium text-foreground">12 Oct 2026</span>
                  </div>
                  <div>
                    Due Date: <span className="font-medium text-foreground">26 Oct 2026 (Net 14)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2">
              <div className="rounded-lg bg-card/70 p-3">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Billed To
                </span>
                <p className="text-sm font-semibold text-foreground">Northbridge Retail Ltd</p>
                <p className="text-sm text-muted-foreground">
                  Attn: Claire Henderson, Head of Digital
                  <br />
                  72 Commercial Road, Bristol, BS1 6TG
                  <br />
                  VAT ID: GB 984 2190 44
                </p>
              </div>
              <div className="flex flex-col justify-between rounded-lg bg-card/70 p-3">
                <div>
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Project Reference
                  </span>
                  <p className="text-sm font-semibold text-foreground">E-Commerce Checkout Redesign &amp; API Pass</p>
                  <p className="text-sm text-muted-foreground">PO Reference: PO-88914</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-primary">Payment Status: Approved for Remittance</span>
                </div>
              </div>
            </div>

            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="rounded-l py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Hours / Qty</th>
                    <th className="py-2.5 px-3 text-right">Rate</th>
                    <th className="rounded-r py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground">Frontend Architecture Sprint</div>
                      <div className="text-xs text-muted-foreground">Next.js 15 migration &amp; responsive checkout components</div>
                    </td>
                    <td className="py-3 px-3 text-right">23 hrs</td>
                    <td className="py-3 px-3 text-right">£80.00</td>
                    <td className="py-3 px-3 text-right font-semibold text-foreground">£1,840.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground">Payment Gateway API Webhooks</div>
                      <div className="text-xs text-muted-foreground">Stripe webhook idempotency handling and tax logic</div>
                    </td>
                    <td className="py-3 px-3 text-right">8 hrs</td>
                    <td className="py-3 px-3 text-right">£80.00</td>
                    <td className="py-3 px-3 text-right font-semibold text-foreground">£640.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground">Production SSL &amp; Staging Server Setup</div>
                      <div className="text-xs text-muted-foreground">Direct hosting outlay reimbursable</div>
                    </td>
                    <td className="py-3 px-3 text-right">1 fixed</td>
                    <td className="py-3 px-3 text-right">£128.00</td>
                    <td className="py-3 px-3 text-right font-semibold text-foreground">£128.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid grid-cols-1 items-end gap-6 pt-2 sm:grid-cols-2">
              <div className="space-y-1 rounded-lg bg-card/60 p-3 text-xs text-muted-foreground">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-foreground">
                  Bank Remittance Instructions
                </span>
                <div>Bank: NatWest Commercial London</div>
                <div>Account Name: Alex Morgan Freelance</div>
                <div>Account No: 44091823 • Sort Code: 60-14-12</div>
                <div>IBAN: GB82 NWBK 6014 1244 0918 23</div>
              </div>
              <div className="space-y-2 text-right">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>£2,608.00</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>VAT (0% - Reverse Charge / Exempt):</span>
                  <span>£0.00</span>
                </div>
                <div className="flex items-baseline justify-between pt-2">
                  <span className="font-bold text-foreground">Total Due:</span>
                  <span className="text-2xl font-extrabold text-primary">£2,608.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIPS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Best Practices</span>
          <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">
            Freelance invoicing tips that reduce confusion
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            A compact magazine-style guide to getting paid on time without awkward client friction.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <div key={tip.title} className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-sm">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
              <div>
                <h4 className="mb-1 font-semibold text-foreground">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.body}</p>
              </div>
            </div>
          ))}
          <div className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-sm md:col-span-2 lg:col-span-3">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
            <div>
              <h4 className="mb-1 font-semibold text-foreground">Establish sequential numbering from day one</h4>
              <p className="text-sm text-muted-foreground">
                Pick a structured cadence like INV-2026-001 so both you and tax authorities can audit completeness
                easily as your revenue accelerates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED SOLUTIONS */}
      <section className="w-full bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Ecosystem</span>
              <h2 className="mt-1 text-2xl font-bold text-foreground">Explore tailored billing solutions</h2>
            </div>
            <p className="mt-2 max-w-md text-sm text-muted-foreground md:mt-0">
              MakeInvo maintains specific configurations tailored to the nuances of every professional service
              discipline.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedSolutions.map((sol) => (
              <Link
                key={sol.href}
                href={sol.href}
                className="group flex items-start justify-between gap-4 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  <span className="mb-1 block text-sm font-semibold text-primary">{sol.eyebrow}</span>
                  <h3 className="font-bold text-foreground transition-colors group-hover:text-primary">
                    {sol.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{sol.body}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Helpful Resources:</span>
            <Link href="/features" className="hover:text-primary">Platform Features</Link>
            <span className="text-border">•</span>
            <Link href="/pricing" className="hover:text-primary">Transparent Pricing</Link>
            <span className="text-border">•</span>
            <Link href="/#invoice-examples" className="hover:text-primary">Curated Invoice Examples</Link>
            <span className="text-border">•</span>
            <Link href="/invoice-templates" className="hover:text-primary">Free Invoicing Templates</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Common Inquiries</span>
          <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-2 text-muted-foreground">
            Everything you need to know about generating freelance invoices on MakeInvo.
          </p>
        </div>
        <FaqAccordion />
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-center shadow-2xl md:flex-row md:p-12 md:text-left">
          <div className="absolute -bottom-12 -right-12 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Get Paid On Time</span>
            <h2 className="mt-1 text-3xl font-bold text-white sm:text-4xl">Create your next freelance invoice</h2>
            <p className="mt-2 leading-relaxed text-slate-300">
              Add your work, rates and client information, then download a professional PDF invoice in minutes. No
              credit card required.
            </p>
          </div>
          <div className="relative z-10 flex w-full shrink-0 flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <Link href={FREELANCER_GENERATOR_URL} className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2 rounded-full px-8 py-6 text-base shadow-lg sm:w-auto">
                Create a Free Invoice
                <Bolt className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full border-slate-700 bg-slate-800/80 px-8 py-6 text-base text-slate-200 hover:bg-slate-800 sm:w-auto"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
