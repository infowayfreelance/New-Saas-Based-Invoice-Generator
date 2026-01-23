"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Download, Send } from "lucide-react"
import { toast } from "sonner"

interface InvoiceListActionsProps {
  invoiceId: string
  invoiceNumber: string
}

export function InvoiceListActions({
  invoiceId,
  invoiceNumber,
}: InvoiceListActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    if (isDownloading) return

    setIsDownloading(true)
    toast.info("Generating PDF...")

    try {
      const [html2canvas, jsPDF] = await Promise.all([
        import("html2canvas").then((mod) => mod.default),
        import("jspdf").then((mod) => mod.default),
      ])

      const iframe = document.createElement("iframe")
      iframe.style.position = "absolute"
      iframe.style.left = "-9999px"
      iframe.style.width = "800px"
      iframe.style.height = "1200px"
      document.body.appendChild(iframe)

      iframe.src = `/app/invoices/${invoiceId}`

      await new Promise((resolve) => {
        iframe.onload = resolve
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const iframeDoc = iframe.contentDocument
      if (!iframeDoc) throw new Error("Failed to load invoice")

      const preview = iframeDoc.getElementById("invoice-preview")
      if (!preview) throw new Error("Invoice preview not found")

      const canvas = await html2canvas(preview, {
        scale: 2,
        backgroundColor: "#ffffff",
      })

      const pdf = new jsPDF("p", "mm", "a4")
      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`invoice-${invoiceNumber}.pdf`)

      toast.success("PDF downloaded")
    } catch (error) {
      console.error("[invoice-pdf]", error)
      toast.error("Failed to generate PDF")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/app/invoices/${invoiceId}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/app/invoices/${invoiceId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDownloadPDF} disabled={isDownloading}>
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? "Generating…" : "Download PDF"}
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Send className="mr-2 h-4 w-4" />
          Send Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
