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

export function calculateItemTotal(item: InvoiceItemFormData): number {
  const subtotal = item.quantity * item.unitPrice
  const tax = subtotal * (item.taxRate / 100)
  return subtotal + tax
}

export function calculateInvoiceTotals(items: InvoiceItemFormData[], discountAmount = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const taxAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice * (item.taxRate / 100), 0)
  const totalAmount = subtotal + taxAmount - discountAmount

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  }
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
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
