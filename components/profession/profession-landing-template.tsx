import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Download, ShieldCheck, UserPlus, ListChecks } from "lucide-react"
import { InvoicePreviewCard } from "./invoice-preview-card"
import type { ProfessionPageData } from "./types"

const benefitStrip = [
  { icon: CheckCircle2, label: "No credit card required" },
  { icon: ShieldCheck, label: "No watermark" },
  { icon: Download, label: "Instant PDF download" },
  { icon: UserPlus, label: "No signup needed for guest invoices" },
]

export function ProfessionLandingTemplate({ data }: { data: ProfessionPageData }) {
  return (
    <>
      {/* 1. Breadcrumbs */}
      <div className="border-b border-border px-4 py-3 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span aria-current="page">{data.h1}</span>
        </nav>
      </div>

      {/* 2 & 3. Hero + audience-specific invoice preview */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="order-1">
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{data.h1}</h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">{data.heroParagraph}</p>
            <p className="mt-3 text-sm text-muted-foreground">{data.heroSupportingLine}</p>

            <div className="order-2 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/#invoice-generator" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 shadow-md shadow-primary/20 sm:w-auto">
                  Create a Free Invoice
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full bg-transparent sm:w-auto">
                  Create a Free Account
                </Button>
              </Link>
            </div>
          </div>

          <div className="order-3 lg:order-2">
            <InvoicePreviewCard preview={data.invoicePreview} alt={data.invoicePreviewAlt} />
          </div>
        </div>
      </section>

      {/* 4. Benefits strip */}
      <section className="border-y border-border bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4">
          {benefitStrip.map((item) => (
            <div key={item.label} className="flex items-center justify-center gap-2 text-center text-sm font-medium text-muted-foreground sm:justify-start">
              <item.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Problems and solutions */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{data.problemsHeading}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {data.problems.map((problem) => (
              <li key={problem} className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                {problem}
              </li>
            ))}
          </ul>

          <h2 className="mt-14 text-balance text-2xl font-bold tracking-tight sm:text-3xl">{data.solutionsHeading}</h2>
          <ul className="mt-6 space-y-3">
            {data.solutions.map((solution) => (
              <li key={solution} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-pretty leading-relaxed text-muted-foreground">{solution}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Important invoice information */}
      <section className="border-y border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{data.infoHeading}</h2>
          <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {data.infoItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {data.infoNote && (
            <p className="mt-6 rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
              {data.infoNote}
            </p>
          )}
        </div>
      </section>

      {/* 7. Profession-specific workflow */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{data.workflowHeading}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {data.workflowSteps.map((step, index) => (
              <div key={step.title}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/#invoice-generator">
              <Button size="lg" className="gap-2">
                Create a Free Invoice
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Feature section */}
      <section className="border-y border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{data.featuresHeading}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.features.map((feature) => (
              <Card key={feature.title} className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    {feature.paidPlan && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        Paid plan
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Invoice example (larger, more detailed version of the hero preview) */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-balance text-center text-2xl font-bold tracking-tight sm:text-3xl">
            What a {data.audienceLabel.toLowerCase()} invoice can look like
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            An illustrative example - your invoice will reflect your own business, client and totals.
          </p>
          <div className="mt-8">
            <InvoicePreviewCard preview={data.invoicePreview} alt={data.invoicePreviewAlt} compact={false} />
          </div>
        </div>
      </section>

      {/* 10. Best practices */}
      <section className="border-y border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{data.bestPracticesHeading}</h2>
          <ul className="mt-6 space-y-3">
            {data.bestPractices.map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-pretty leading-relaxed text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 11. Related guide links */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-lg font-semibold">Helpful invoicing guides</h2>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {data.relatedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-primary hover:underline">
                {link.label}
              </Link>
            ))}
          </div>

          {data.crossLinks.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-muted-foreground">Other ways to use MakeInvo</h3>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {data.crossLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-primary hover:underline">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="border-y border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-8 space-y-4">
            {data.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-border bg-card open:border-primary/30 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-border px-6 py-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Final CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-14 text-center">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{data.finalCtaHeading}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">{data.finalCtaText}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/#invoice-generator" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 shadow-md shadow-primary/20 sm:w-auto">
                  Create a Free Invoice
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full bg-transparent sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
