export type BillingType = "fixed" | "hourly" | "daily" | "quantity" | "milestone"

export interface InvoiceVisibility {
  logo: boolean
  projectDetails: boolean
  fromPhone: boolean
  fromWebsite: boolean
  clientPhone: boolean
  taxNumbers: boolean
  paymentDetails: boolean
  notes: boolean
  termsAndConditions: boolean
  invoiceStatus: boolean
  footer: boolean
}

export function getDefaultVisibility(): InvoiceVisibility {
  return {
    logo: true,
    projectDetails: true,
    fromPhone: true,
    fromWebsite: true,
    clientPhone: true,
    taxNumbers: true,
    paymentDetails: true,
    notes: true,
    termsAndConditions: true,
    invoiceStatus: true,
    footer: true,
  }
}

export interface InvoiceFormData {
  // From (Your business)
  fromName: string
  fromEmail: string
  fromAddress: string
  fromPhone?: string
  fromWebsite?: string
  fromBusinessReg?: string
  // To (Client)
  clientName: string
  clientCompanyName?: string
  clientEmail: string
  clientAddress: string
  clientPhone?: string
  clientRef?: string
  // Invoice details
  invoiceNumber: string
  issueDate: string
  dueDate: string
  paymentTerms?: "due-on-receipt" | "net-7" | "net-14" | "net-30" | "custom"
  currency: string
  status?: string
  // Project (optional section)
  projectName?: string
  projectRef?: string
  projectDescription?: string
  // Items
  items: InvoiceItemFormData[]
  // Totals / calculations
  terms: string
  notes?: string
  termsDetail?: string
  taxRate: number
  taxName?: string
  discountType?: "percentage" | "fixed"
  discountValue?: number
  discountAmount: number
  // Legacy payment / bank details
  bankDetails?: string
  // Structured payment details
  paymentMethod?: "bank" | "paypal" | "wise" | "stripe" | "other"
  paymentLink?: string
  paymentCustomNote?: string
  // Reference / compliance
  poNumber?: string
  fromTaxId?: string
  clientTaxId?: string
  // Branding
  logoUrl?: string
  primaryColor?: string
  accentColor?: string
  watermarkText?: string
  signatureUrl?: string
  // Payment status
  amountPaid?: number
  // Layout
  layoutStyle?: string
  fontFamily?: string
  logoPosition?: "left" | "center" | "right"
  tableStyle?: "clean" | "bordered" | "soft-card"
  infoLayout?: "side-by-side" | "stacked"
  // Visibility toggles
  visibility?: Partial<InvoiceVisibility>
}

export interface BankAccountRecord {
  account_name: string
  bank_name: string
  account_number: string
  routing_number: string | null
  swift_code: string | null
  sort_code?: string | null
  bank_address?: string | null
  currency?: string | null
  is_default?: boolean | null
}

export function formatBankDetails(account: BankAccountRecord | null | undefined): string {
  if (!account) return ""
  const lines = [
    `Beneficiary: ${account.account_name}`,
    `Bank Name: ${account.bank_name}`,
  ]
  if (account.sort_code) lines.push(`Sort Code: ${account.sort_code}`)
  lines.push(`Account Number: ${account.account_number}`)
  if (account.routing_number) lines.push(`Routing Number: ${account.routing_number}`)
  if (account.swift_code) lines.push(`SWIFT / IBAN: ${account.swift_code}`)
  if (account.bank_address) lines.push(`Bank Address: ${account.bank_address}`)
  return lines.join("\n")
}

export function pickBankAccountForCurrency<T extends BankAccountRecord>(
  accounts: T[] | null | undefined,
  currency?: string | null,
): T | null {
  if (!accounts || accounts.length === 0) return null
  if (currency) {
    const match = accounts.find((a) => (a.currency || "").toUpperCase() === currency.toUpperCase())
    if (match) return match
  }
  return accounts.find((a) => a.is_default) || accounts[0]
}

export interface InvoiceItemFormData {
  id: string
  description: string
  detailedDescription?: string
  billingType: BillingType
  quantity: number
  unitPrice: number
  taxRate: number
}

/** Returns column labels appropriate for the billing type of a line item. */
export function getBillingTypeLabels(billingType: BillingType): { qty: string | null; rate: string } {
  switch (billingType) {
    case "hourly":
      return { qty: "Hours", rate: "Rate/hr" }
    case "daily":
      return { qty: "Days", rate: "Rate/day" }
    case "fixed":
      return { qty: null, rate: "Amount" }
    case "milestone":
      return { qty: null, rate: "Amount" }
    case "quantity":
    default:
      return { qty: "Qty", rate: "Unit Price" }
  }
}

/** Human-readable summary of a billing type row (shown under description in preview). */
export function getBillingTypeSummary(
  item: InvoiceItemFormData,
  currency: string,
): string | null {
  const qty = toNumber(item.quantity)
  const rate = toNumber(item.unitPrice)
  switch (item.billingType) {
    case "hourly":
      return `${qty} ${qty === 1 ? "hr" : "hrs"} × ${formatCurrency(rate, currency)}/hr`
    case "daily":
      return `${qty} ${qty === 1 ? "day" : "days"} × ${formatCurrency(rate, currency)}/day`
    case "milestone":
      return null
    case "fixed":
      return null
    case "quantity":
    default:
      if (qty === 1) return null
      return `${qty} × ${formatCurrency(rate, currency)}`
  }
}

export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `INV-${year}${month}-${random}`
}

export function toNumber(value: any): number {
  if (value === null || value === undefined || value === "") {
    return 0
  }
  const num = typeof value === "number" ? value : Number(value)
  return Number.isFinite(num) ? num : 0
}

export function calculateItemTotal(item: InvoiceItemFormData): number {
  const quantity = toNumber(item.quantity)
  const unitPrice = toNumber(item.unitPrice)
  const taxRate = toNumber(item.taxRate)

  const subtotal = quantity * unitPrice
  const tax = subtotal * (taxRate / 100)
  return subtotal + tax
}

export function computeDiscountAmount(
  subtotal: number,
  discountType: "percentage" | "fixed" = "fixed",
  discountValue = 0,
): number {
  if (discountType === "percentage") {
    return Math.round(subtotal * (discountValue / 100) * 100) / 100
  }
  return Math.round(toNumber(discountValue) * 100) / 100
}

export function calculateInvoiceTotals(items: InvoiceItemFormData[], discountAmount = 0) {
  const subtotal = items.reduce((sum, item) => {
    const qty = toNumber(item.quantity)
    const price = toNumber(item.unitPrice)
    return sum + qty * price
  }, 0)

  const taxAmount = items.reduce((sum, item) => {
    const qty = toNumber(item.quantity)
    const price = toNumber(item.unitPrice)
    const taxRate = toNumber(item.taxRate)
    return sum + qty * price * (taxRate / 100)
  }, 0)

  const discount = toNumber(discountAmount)
  const totalAmount = subtotal + taxAmount - discount

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    discountAmount: Math.round(discount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  }
}

export function formatCurrency(amount: number | string | null | undefined, currency = "USD"): string {
  const safeAmount = toNumber(amount)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(safeAmount)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/** Compute dueDate from issueDate + payment terms offset. */
export function computeDueDateFromTerms(issueDate: string, terms: string): string {
  const offsets: Record<string, number> = {
    "due-on-receipt": 0,
    "net-7": 7,
    "net-14": 14,
    "net-30": 30,
  }
  const days = offsets[terms]
  if (days === undefined) return ""
  const date = new Date(issueDate)
  if (isNaN(date.getTime())) return ""
  date.setDate(date.getDate() + days)
  return date.toISOString().split("T")[0]
}

export const CURRENCIES = [
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
]

export function getDefaultInvoiceData(): InvoiceFormData {
  const today = new Date()
  const dueDate = new Date(today)
  dueDate.setDate(dueDate.getDate() + 30)

  return {
    fromName: "",
    fromEmail: "",
    fromAddress: "",
    fromPhone: "",
    fromWebsite: "",
    fromBusinessReg: "",
    clientName: "",
    clientCompanyName: "",
    clientEmail: "",
    clientAddress: "",
    clientPhone: "",
    clientRef: "",
    invoiceNumber: generateInvoiceNumber(),
    issueDate: today.toISOString().split("T")[0],
    dueDate: dueDate.toISOString().split("T")[0],
    paymentTerms: "net-30",
    currency: "USD",
    projectName: "",
    projectRef: "",
    projectDescription: "",
    items: [
      {
        id: crypto.randomUUID(),
        description: "",
        detailedDescription: "",
        billingType: "quantity",
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
      },
    ],
    terms: "",
    notes: "",
    termsDetail: "",
    taxRate: 0,
    taxName: "",
    discountType: "fixed",
    discountValue: 0,
    discountAmount: 0,
    bankDetails: "",
    paymentMethod: "bank",
    paymentLink: "",
    paymentCustomNote: "",
    visibility: getDefaultVisibility(),
  }
}