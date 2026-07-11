"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { InvoicePreview } from "@/components/invoice/invoice-preview"
import { downloadInvoicePdf } from "@/lib/utils/pdf"
import type { InvoiceFormData } from "@/lib/utils/invoice"

interface PublicInvoiceViewProps {
  data: InvoiceFormData
  invoiceNumber: string
}

/**
 * Read-only, unauthenticated invoice view shared via a link (e.g. WhatsApp).
 * No edit/send actions here - just view + download, since the recipient
 * has no account.
 */
export function PublicInvoiceView({ data, invoiceNumber }: PublicInvoiceViewProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    const element = document.getElementById("invoice-preview")
    if (!element) {
      toast.error("Invoice preview not found. Please try again.")
      return
    }

    setIsDownloading(true)
    toast.info("Generating PDF...")

    try {
      await downloadInvoicePdf(element, `invoice-${invoiceNumber}.pdf`)
      toast.success("PDF downloaded successfully!")
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      toast.error("Failed to generate PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Invoice {invoiceNumber}</h1>
        <Button onClick={handleDownload} disabled={isDownloading}>
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? "Generating..." : "Download PDF"}
        </Button>
      </div>
      <div className="rounded-lg border border-border shadow-sm">
        <InvoicePreview data={data} />
      </div>
    </div>
  )
}
