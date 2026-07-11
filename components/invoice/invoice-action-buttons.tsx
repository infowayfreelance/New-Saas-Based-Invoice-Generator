"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Download, Send } from "lucide-react"
import { toast } from "sonner"
import { type InvoiceFormData, formatCurrency, formatDate, toNumber } from "@/lib/utils/invoice"
import { sendInvoiceEmail } from "@/app/actions/invoice"
import { downloadInvoicePdf } from "@/lib/utils/pdf"
import { markInvoiceAsSent } from "@/app/actions/invoice-status"
import { SendWhatsAppMenu } from "@/components/invoice/send-whatsapp-menu"
import { buildInvoiceWhatsAppMessage, buildInvoiceViewUrl } from "@/lib/utils/whatsapp"

interface InvoiceActionButtonsProps {
  invoiceData: InvoiceFormData
  invoiceId: string
  invoiceNumber: string
  totalAmount?: number
  dueDate?: string
  senderWhatsapp?: string | null
  clientWhatsapp?: string | null
}

export function InvoiceActionButtons({
  invoiceData,
  invoiceId,
  invoiceNumber,
  totalAmount,
  dueDate,
  senderWhatsapp,
  clientWhatsapp,
}: InvoiceActionButtonsProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const searchParams = useSearchParams()

  const handleDownloadPDF = useCallback(async () => {
    const element = document.getElementById("invoice-preview")
    if (!element) {
      toast.error("Invoice preview not found. Please try again.")
      return
    }

    setIsDownloading(true)
    toast.info("Generating PDF...")

    try {
      // USER INTENT: Mark as sent BEFORE generating PDF
      const statusResult = await markInvoiceAsSent(invoiceId)
      if (!statusResult.success) {
        console.error("[v0] Failed to mark as sent:", statusResult.error)
        // Continue anyway - user intent matters, not technical success
      }

      await downloadInvoicePdf(element, `invoice-${invoiceNumber}.pdf`)

      toast.success("PDF downloaded successfully!")
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      toast.error("Failed to generate PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }, [invoiceNumber, invoiceId])

  const handleSendEmail = useCallback(async () => {
    if (!invoiceData.clientEmail) {
      toast.error("Client email is required to send invoice")
      return
    }

    setIsSending(true)
    toast.info("Sending email...")

    try {
      // USER INTENT: Mark as sent BEFORE sending email
      const statusResult = await markInvoiceAsSent(invoiceId)
      if (!statusResult.success) {
        console.error("[v0] Failed to mark as sent:", statusResult.error)
        // Continue anyway - user intent matters, not technical success
      }

      const result = await sendInvoiceEmail(invoiceId)

      if (result.success) {
        toast.success("Invoice sent successfully!")
      } else {
        toast.error(result.error || "Failed to send invoice")
      }
    } catch (error) {
      console.error("[v0] Error sending email:", error)
      toast.error("Failed to send invoice. Please try again.")
    } finally {
      setIsSending(false)
    }
  }, [invoiceId, invoiceData.clientEmail])

  const whatsAppMessage = buildInvoiceWhatsAppMessage({
    businessName: invoiceData.fromName || "Your Business",
    invoiceNumber,
    total: formatCurrency(toNumber(totalAmount), invoiceData.currency),
    dueDate: dueDate ? formatDate(dueDate) : "-",
    clientName: invoiceData.clientName,
    viewUrl: buildInvoiceViewUrl(invoiceId),
  })

  return (
    <>
      <Button variant="outline" className="bg-transparent" onClick={handleDownloadPDF} disabled={isDownloading}>
        <Download className="mr-2 h-4 w-4" />
        {isDownloading ? "Generating..." : "Download PDF"}
      </Button>
      <SendWhatsAppMenu
        invoiceId={invoiceId}
        message={whatsAppMessage}
        senderWhatsapp={senderWhatsapp}
        clientWhatsapp={clientWhatsapp}
        clientName={invoiceData.clientName}
      />
      <Button onClick={handleSendEmail} disabled={isSending}>
        <Send className="mr-2 h-4 w-4" />
        {isSending ? "Sending..." : "Send Email"}
      </Button>
    </>
  )
}
