export interface InvoiceFormData {
  // From (Your business)
  fromName: string
  fromEmail: string
  fromAddress: string
  // To (Client)
  clientName: string
  clientEmail: string
  clientAddress: string
  // Invoice details
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: string
  // Items
  items: InvoiceItemFormData[]
  // Additional
  notes: string
  terms: string
  taxRate: number
  discountAmount: number
}

export interface InvoiceItemFormData {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
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

/**
 * Safely converts a value to a number, returning 0 for invalid values
 */
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
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceNumber: generateInvoiceNumber(),
    issueDate: today.toISOString().split("T")[0],
    dueDate: dueDate.toISOString().split("T")[0],
    currency: "USD",
    items: [
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
      },
    ],
    notes: "",
    terms: "Payment is due within 30 days of invoice date.",
    taxRate: 0,
    discountAmount: 0,
  }
}
