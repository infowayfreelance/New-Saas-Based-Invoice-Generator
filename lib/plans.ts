export interface Plan {
  id: string
  name: string
  code: "GUEST" | "BASIC" | "STANDARD" | "PRO"
  priceMonthly: number
  stripePriceId?: string
  invoiceLimitPerDay: number | null
  invoiceLimitPerMonth: number | null
  features: PlanFeatures
}

export interface PlanFeatures {
  downloadPdf: boolean
  sendEmail: boolean
  saveClients: boolean
  templates: string[]
  analytics: boolean | "basic" | "full"
  recurring: boolean
  paymentTracking: boolean
  logoUpload?: boolean
  branding?: boolean
  watermark?: boolean
  signature?: boolean
  autoReminders?: boolean
}

export const PLANS: Plan[] = [
  {
    id: "guest",
    name: "Guest",
    code: "GUEST",
    priceMonthly: 0,
    invoiceLimitPerDay: 3,
    invoiceLimitPerMonth: 15,
    features: {
      downloadPdf: true,
      sendEmail: false,
      saveClients: false,
      templates: ["minimal"],
      analytics: false,
      recurring: false,
      paymentTracking: false,
    },
  },
  {
    id: "basic",
    name: "Basic",
    code: "BASIC",
    priceMonthly: 5,
    invoiceLimitPerDay: 5,
    invoiceLimitPerMonth: 30,
    features: {
      downloadPdf: true,
      sendEmail: true,
      saveClients: false,
      templates: ["minimal"],
      analytics: false,
      recurring: false,
      paymentTracking: false,
    },
  },
  {
    id: "standard",
    name: "Standard",
    code: "STANDARD",
    priceMonthly: 12,
    invoiceLimitPerDay: null,
    invoiceLimitPerMonth: null,
    features: {
      downloadPdf: true,
      sendEmail: true,
      saveClients: true,
      templates: ["minimal", "classic", "modern"],
      analytics: "basic",
      recurring: false,
      paymentTracking: false,
      logoUpload: true,
      branding: true,
    },
  },
  {
    id: "pro",
    name: "Pro",
    code: "PRO",
    priceMonthly: 29.99,
    invoiceLimitPerDay: null,
    invoiceLimitPerMonth: null,
    features: {
      downloadPdf: true,
      sendEmail: true,
      saveClients: true,
      templates: ["minimal", "classic", "modern", "premium", "elegant"],
      analytics: "full",
      recurring: true,
      paymentTracking: true,
      logoUpload: true,
      branding: true,
      watermark: true,
      signature: true,
      autoReminders: true,
    },
  },
]

export function getPlanByCode(code: string): Plan | undefined {
  return PLANS.find((p) => p.code === code)
}

export function canAccessFeature(planCode: string, feature: keyof PlanFeatures): boolean {
  const plan = getPlanByCode(planCode)
  if (!plan) return false
  return !!plan.features[feature]
}
