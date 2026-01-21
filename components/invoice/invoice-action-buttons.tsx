"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download, Send } from "lucide-react"
import { toast } from "sonner"
import type { InvoiceFormData } from "@/lib/utils/invoice"
import { sendInvoiceEmail } from "@/app/actions/invoice"

interface InvoiceActionButtonsProps {
  invoiceData: InvoiceFormData
  invoiceId: string
  invoiceNumber: string
}

export function InvoiceActionButtons({ invoiceData, invoiceId, invoiceNumber }: InvoiceActionButtonsProps) {
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
      // Dynamic import for html2canvas and jspdf
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      const pdf = new jsPDF("p", "mm", "a4")

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 10

      const imgData = canvas.toDataURL("image/png")
      let imgWidth = pageWidth - margin * 2
      let imgHeight = (canvas.height * imgWidth) / canvas.width

      // Scale to fit page
      const targetHeight = pageHeight - margin * 2
      if (imgHeight < targetHeight * 0.9) {
        const scale = (targetHeight * 0.9) / imgHeight
        imgWidth = imgWidth * scale
        imgHeight = imgHeight * scale
      }

      if (imgWidth > pageWidth - margin * 2) {
        const fitScale = (pageWidth - margin * 2) / imgWidth
        imgWidth = imgWidth * fitScale
        imgHeight = imgHeight * fitScale
      }

      const x = (pageWidth - imgWidth) / 2
      const y = margin

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight)
      pdf.save(`invoice-${invoiceNumber}.pdf`)

      toast.success("PDF downloaded successfully!")
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      toast.error("Failed to generate PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }, [invoiceNumber])

  const handleSendEmail = useCallback(async () => {
    if (!invoiceData.clientEmail) {
      toast.error("Client email is required to send invoice")
      return
    }

    setIsSending(true)
    toast.info("Sending email...")

    try {
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

  // Auto-trigger PDF download if download parameter is present
  useEffect(() => {
    const shouldDownload = searchParams.get('download') === 'true'
    if (shouldDownload && !isDownloading) {
      console.log("[v0] Auto-triggering PDF download")
      // Wait a bit for the page to fully render
      setTimeout(() => {
        handleDownloadPDF()
      }, 1000)
    }
  }, [searchParams, handleDownloadPDF, isDownloading])

  return (
    <>
      <Button variant="outline" className="bg-transparent" onClick={handleDownloadPDF} disabled={isDownloading}>
        <Download className="mr-2 h-4 w-4" />
        {isDownloading ? "Generating..." : "Download PDF"}
      </Button>
      <Button onClick={handleSendEmail} disabled={isSending}>
        <Send className="mr-2 h-4 w-4" />
        {isSending ? "Sending..." : "Send Email"}
      </Button>
    </>
  )
}
