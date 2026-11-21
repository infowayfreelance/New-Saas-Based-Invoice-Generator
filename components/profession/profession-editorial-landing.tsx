import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Bolt,
  Calculator,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  FileDown,
  FileText,
  IdCard,
  Layers,
  ShieldCheck,
  Timer,
  UserX,
} from "lucide-react"
import type { ProfessionPageData } from "./types"
import { ProfessionFaqAccordion } from "./profession-faq-accordion"

const stepIcons = [IdCard, Layers, Calculator, Download]
const benefitIcons = [Layers, FileDown, Timer, CheckCircle2, IdCard, Bolt, Calculator]

export function ProfessionEditorialLanding({
  data,
  heroImage,
  ukConsulting = false,
  ukTradespeople = false,
  afterInvoiceDetails,
}: {
  ukConsulting?: boolean
  ukTradespeople?: boolean
  afterInvoiceDetails?: ReactNode
  data: ProfessionPageData
  heroImage?: { src: string; alt: string; title?: string; objectPosition?: string }
}) {
  const ukInvoiceCopy = ukConsulting || ukTradespeople
  const previewItems = data.invoicePreview.items.slice(0, 2)

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
              {data.h1}
            </h1>
            <p className="max-w-xl pt-1 text-lg leading-relaxed text-muted-foreground">{data.heroParagraph}</p>
            <p className="text-sm italic text-muted-foreground/80">{data.heroSupportingLine}</p>
            <div className="flex w-full flex-wrap items-center gap-4 pt-2">
              <Link href="/#invoice-generator">
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
                <span className="block text-lg font-bold text-foreground">{ukInvoiceCopy ? "No signup" : "< 90s"}</span>
                <span className="text-xs text-muted-foreground">{ukInvoiceCopy ? "for guest invoices" : "Avg. build time"}</span>
              </div>
              <div className="rounded-lg bg-card p-3 shadow-sm">
                <span className="block text-lg font-bold text-primary">{ukInvoiceCopy ? "PDF" : "100%"}</span>
                <span className="text-xs text-muted-foreground">{ukInvoiceCopy ? "in one click" : "Fee transparent"}</span>
              </div>
              <div className="rounded-lg bg-card p-3 shadow-sm">
                <span className="block text-lg font-bold text-foreground">Zero</span>
                <span className="text-xs text-muted-foreground">Watermarks</span>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:col-span-6 lg:mt-0">
            <div className="relative mx-auto h-[420px] max-w-[540px] overflow-hidden rounded-2xl bg-muted shadow-xl sm:h-[480px]">
              {heroImage ? (
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  title={heroImage.title}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                  style={{ objectPosition: heroImage.objectPosition ?? "center" }}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 via-muted to-primary/5">
                  <FileText className="h-24 w-24 text-primary/40" aria-hidden="true" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-white/90 drop-shadow-sm">
                <span>{data.audienceLabel} • Independent Professional</span>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-4 w-72 -rotate-3 rounded-xl bg-card p-4 shadow-2xl transition-transform duration-300 hover:rotate-0 sm:-left-8 sm:w-80">
              <div className="flex items-start justify-between pb-3">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">Draft Preview</span>
                  <span className="text-xl font-bold text-foreground">{data.invoicePreview.invoiceNumber}</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                  <Check className="h-3.5 w-3.5" />
                  Approved
                </span>
              </div>
              <div className="space-y-1.5 py-2">
                {previewItems.map((item) => (
                  <div key={item.description} className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.description}</span>
                    <span className="font-semibold text-foreground">{item.amount}</span>
                  </div>
                ))}
              </div>
              <div className="mt-1 flex items-baseline justify-between pt-3">
                <span className="text-xs text-muted-foreground">Amount Payable</span>
                <span className="text-xl font-bold text-primary">{data.invoicePreview.total}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary" /> {data.invoicePreview.dueLabel}
                </span>
                <span>{data.invoicePreview.clientName}</span>
              </div>
            </div>
          </div>
        </div>
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

      {/* PROBLEMS */}
      <section className="my-4 w-full bg-slate-950 py-16 text-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">The Administrative Drag</span>
                <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">{data.problemsHeading}</h2>
                <p className="leading-relaxed text-slate-300">
                  Most billing mistakes happen when rigid word processors and generic spreadsheets get bent into
                  fiscal ledgers. Every extra click is billable time lost.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-700/60 bg-slate-800/80 p-6 shadow-xl">
                <span className="block text-5xl font-bold leading-none text-primary">{ukInvoiceCopy ? "Every hour" : "3.8 hrs"}</span>
                <span className="mt-2 block font-semibold text-white">
                  {ukInvoiceCopy ? (ukTradespeople ? "spent formatting invoices is an hour you can't spend on the next job." : "spent formatting invoices is an hour you can't bill.") : "Average lost to manual administrative billing per month"}
                </span>
                <div className="mt-4 flex items-center gap-3 border-t border-slate-700/50 pt-4">
                  <Timer className="h-7 w-7 text-primary" />
                  <span className="text-sm font-medium text-slate-300">
                    Reclaim your time with zero-friction generation.
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2 lg:col-span-7">
              {data.problems.map((problem, i) => (
                <div
                  key={problem}
                  className={`relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-md transition-all hover:shadow-lg ${
                    i % 2 === 1 ? "sm:translate-y-4" : ""
                  }`}
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                  <span className="mb-1 block font-mono text-xs text-primary/80">
                    {String(i + 1).padStart(2, "0")} — Friction
                  </span>
                  <p className="leading-relaxed text-slate-200">{problem}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS / BENEFITS */}
      <section className="w-full bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Practical Principles</span>
            <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{data.solutionsHeading}</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.solutions.map((solution, i) => {
              const Icon = benefitIcons[i % benefitIcons.length]
              return (
                <div key={solution} className="flex flex-col justify-between rounded-2xl bg-card p-6 shadow-sm">
                  <div>
                    <span className="mb-4 block select-none text-5xl font-extrabold leading-none text-primary/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="leading-relaxed text-foreground">{solution}</p>
                  </div>
                  <div className="mt-4 flex items-center pt-4 text-sm font-semibold text-primary">
                    <Icon className="mr-1.5 h-4 w-4" /> Built in
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 text-center">
            <Link href="/#invoice-generator">
              <Button className="gap-2 rounded-full px-6 py-5 shadow-sm">
                Launch Invoicer
                <Bolt className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CHECKLIST */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Standard Specification</span>
          <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{data.infoHeading}</h2>
          {data.infoNote && <p className="mt-2 text-muted-foreground">{data.infoNote}</p>}
        </div>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {data.infoItems.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg bg-card p-3 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="font-medium text-foreground">{item}</p>
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
                  <span className="text-[11px] font-semibold text-foreground">{data.invoicePreview.clientName}</span>
                </div>
                <div className="rounded bg-card p-2 shadow-sm">
                  <span className="block text-[10px] text-muted-foreground">3. INVOICE META</span>
                  <span className="text-[11px] font-semibold text-foreground">ID, Issue, Due Date</span>
                </div>
              </div>
              <div className="space-y-1.5 rounded bg-card p-2.5 shadow-sm">
                <span className="block text-[10px] font-bold text-primary">{ukInvoiceCopy ? "4. ITEMISED WORK SCHEDULE" : "4. ITEMIZED WORK SCHEDULE"}</span>
                <div className="h-2 w-full rounded-full bg-muted" />
                <div className="h-2 w-4/5 rounded-full bg-muted" />
                <div className="h-2 w-3/4 rounded-full bg-muted" />
              </div>
              <div className="flex items-center justify-between rounded bg-primary/10 p-2.5 shadow-sm">
                <span className="text-[11px] font-bold text-primary">5. SUB-TOTAL, TAX, GRAND SUM</span>
                <span className="text-sm font-bold text-primary">{data.invoicePreview.total}</span>
              </div>
              <div className="rounded bg-card p-2 shadow-sm">
                <span className="block text-[10px] text-muted-foreground">6. REMITTANCE DETAILS</span>
                <span className="text-[11px] text-foreground">Bank transfer, card or payment link</span>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {ukInvoiceCopy ? "MakeInvo automatically standardises these structural blocks on export." : "MakeInvo automatically standardizes these structural blocks on export."}
            </p>
          </div>
        </div>
      </section>

      {afterInvoiceDetails}

      {/* WORKFLOW STEPS */}
      <section className="w-full bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Step-by-Step</span>
            <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{data.workflowHeading}</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.workflowSteps.map((step, i) => {
              const Icon = stepIcons[i % stepIcons.length]
              return (
                <div key={step.title} className="flex flex-col justify-between rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
                  <div>
                    <span className="mb-4 block text-5xl font-black leading-none text-primary/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                  <div className="mt-6 flex items-center pt-4 text-sm text-muted-foreground">
                    <Icon className="mr-1.5 h-4 w-4 text-primary" />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-12 text-center">
            <Link href="/#invoice-generator">
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
          <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{data.featuresHeading}</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.features.map((feature) => (
            <div key={feature.title} className="flex flex-col justify-between rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
              {feature.paidPlan && (
                <span className="mt-4 flex items-center text-sm font-semibold text-primary">
                  Paid plan <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SAMPLE INVOICE */}
      <section className="relative w-full overflow-hidden bg-slate-950 py-16 text-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Artisanal Document Sample</span>
            <h2 className="mt-1 text-3xl font-bold text-white sm:text-4xl">What your invoice can look like</h2>
            <p className="mt-2 text-slate-400">
              An illustrative example — your invoice will reflect your own business, client, work, and chosen
              currency.
            </p>
          </div>

          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200/40 bg-[#faf8f5] p-6 text-foreground shadow-2xl sm:p-10">
            <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-primary" />
            <div className="flex flex-col items-start justify-between gap-4 pb-6 sm:flex-row">
              <div>
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-primary">
                  {data.invoicePreview.fromLine}
                </span>
                <h3 className="text-2xl font-bold text-foreground">{data.invoicePreview.fromName}</h3>
              </div>
              <div className="sm:text-right">
                <span className="block text-xl font-bold tracking-tight text-foreground">INVOICE</span>
                <span className="mt-0.5 block font-semibold text-primary">{data.invoicePreview.invoiceNumber}</span>
                <div className="mt-2 text-sm text-muted-foreground">Due: {data.invoicePreview.dueLabel}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2">
              <div className="rounded-lg bg-card/70 p-3">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Billed To
                </span>
                <p className="text-sm font-semibold text-foreground">{data.invoicePreview.clientName}</p>
                {data.invoicePreview.clientLine && (
                  <p className="text-sm text-muted-foreground">{data.invoicePreview.clientLine}</p>
                )}
              </div>
              <div className="flex flex-col justify-center rounded-lg bg-card/70 p-3">
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
                    <th className="py-2.5 px-3 text-right rounded-r">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.invoicePreview.items.map((item) => (
                    <tr key={item.description}>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-foreground">{item.description}</div>
                        {item.meta && <div className="text-xs text-muted-foreground">{item.meta}</div>}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-foreground">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col items-end gap-2 pt-2 text-right">
              <div className="flex w-full max-w-xs justify-between text-sm text-muted-foreground">
                <span>Subtotal:</span>
                <span>{data.invoicePreview.subtotal}</span>
              </div>
              {data.invoicePreview.tax && (
                <div className="flex w-full max-w-xs justify-between text-sm text-muted-foreground">
                  <span>Tax:</span>
                  <span>{data.invoicePreview.tax}</span>
                </div>
              )}
              {data.invoicePreview.discount && (
                <div className="flex w-full max-w-xs justify-between text-sm text-muted-foreground">
                  <span>Discount:</span>
                  <span>{data.invoicePreview.discount}</span>
                </div>
              )}
              <div className="flex w-full max-w-xs items-baseline justify-between pt-2">
                <span className="font-bold text-foreground">Total Due:</span>
                <span className="text-2xl font-extrabold text-primary">{data.invoicePreview.total}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEST PRACTICES / TIPS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Best Practices</span>
          <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">{data.bestPracticesHeading}</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.bestPractices.map((tip) => (
            <div key={tip} className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-sm">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
              <p className="text-sm font-medium text-foreground">{tip}</p>
            </div>
          ))}
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
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.crossLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between gap-4 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="font-bold text-foreground transition-colors group-hover:text-primary">{link.label}</h3>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Helpful Resources:</span>
            {data.relatedLinks.map((link, i) => (
              <span key={link.href} className="flex items-center gap-4">
                {i > 0 && <span className="text-border">•</span>}
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Common Inquiries</span>
          <h2 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">Frequently asked questions</h2>
        </div>
        <ProfessionFaqAccordion faqs={data.faqs} keepAnswersMounted={ukInvoiceCopy} />
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-center shadow-2xl md:flex-row md:p-12 md:text-left">
          <div className="absolute -bottom-12 -right-12 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Get Paid On Time</span>
            <h2 className="mt-1 text-3xl font-bold text-white sm:text-4xl">{data.finalCtaHeading}</h2>
            <p className="mt-2 leading-relaxed text-slate-300">{data.finalCtaText}</p>
          </div>
          <div className="relative z-10 flex w-full shrink-0 flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <Link href="/#invoice-generator" className="w-full sm:w-auto">
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
