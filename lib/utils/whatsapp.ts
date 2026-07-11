/**
 * wa.me click-to-chat links require just digits (country code + number) -
 * no leading +, spaces, dashes, or parentheses.
 */
export function normalizeWhatsAppNumber(raw: string): string {
  return raw.replace(/[^0-9]/g, "")
}

export function isValidWhatsAppNumber(raw: string): boolean {
  const digits = normalizeWhatsAppNumber(raw)
  return digits.length >= 8 && digits.length <= 15
}

export function buildWhatsAppLink(rawNumber: string, message: string): string {
  const digits = normalizeWhatsAppNumber(rawNumber)
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function buildInvoiceWhatsAppMessage(params: {
  businessName: string
  invoiceNumber: string
  total: string
  dueDate: string
  clientName?: string
}): string {
  const greeting = params.clientName ? `Hi ${params.clientName},` : "Hi,"
  return [
    greeting,
    "",
    `Here is invoice ${params.invoiceNumber} from ${params.businessName}.`,
    `Amount due: ${params.total}`,
    `Due date: ${params.dueDate}`,
    "",
    "Please find the PDF attached. Let us know if you have any questions - thank you!",
  ].join("\n")
}
