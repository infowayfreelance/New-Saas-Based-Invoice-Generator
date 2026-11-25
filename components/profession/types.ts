import type { LucideIcon } from "lucide-react"

export interface InvoiceLineItem {
  description: string
  meta?: string
  amount: string
}

export interface ProfessionInvoicePreview {
  fromName: string
  fromLine?: string
  clientName: string
  clientLine?: string
  invoiceNumber: string
  dueLabel: string
  items: InvoiceLineItem[]
  subtotal: string
  tax?: string
  discount?: string
  total: string
}

export interface ProfessionFeature {
  icon: LucideIcon
  title: string
  description: string
  paidPlan?: boolean
}

export interface RelatedLink {
  href: string
  label: string
}

export interface ProfessionFaq {
  question: string
  answer: string
  answerLinks?: RelatedLink[]
}

export interface ProfessionPageData {
  slug: string
  audienceLabel: string
  seoTitle: string
  metaDescription: string
  h1: string
  heroParagraph: string
  heroSupportingLine: string
  invoicePreview: ProfessionInvoicePreview
  invoicePreviewAlt: string

  problemsHeading: string
  problems: string[]

  solutionsHeading: string
  solutions: string[]

  infoHeading: string
  infoItems: string[]
  infoNote?: string

  workflowHeading: string
  workflowSteps: { title: string; description: string }[]

  featuresHeading: string
  features: ProfessionFeature[]

  bestPracticesHeading: string
  bestPractices: string[]

  faqs: ProfessionFaq[]

  finalCtaHeading: string
  finalCtaText: string

  relatedLinks: RelatedLink[]
  crossLinks: RelatedLink[]
}
