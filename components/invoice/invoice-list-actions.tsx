"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createRoot } from "react-dom/client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Download, Send, Trash } from "lucide-react"
import { InvoicePreview } from "@/components/invoice/invoice-preview"
import { toast } from "sonner"
import type { InvoiceFormData } from "@/lib/utils/invoice"
import { deleteInvoice } from "@/app/actions/invoice-delete"

interface InvoiceListActionsProps {
  invoiceId: string
  invoiceNumber: string
}

export function InvoiceListActions({ invoiceId, invoiceNumber }: InvoiceListActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDeleteInvoice = async () => {
    if (isDeleting) return

    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice? This action cannot be undone."
    )

    if (!confirmed) return

    setIsDeleting(true)
    console.log("[v0] Deleting invoice:", invoiceId)

    try {
      const result = await deleteInvoice(invoiceId)

      if (result.success) {
        toast.success("Invoice deleted successfully!")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete invoice")
      }
    } catch (error) {
      console.error("[v0] Error deleting invoice:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (isDownloading) return
    
    setIsDownloading(true)
    console.log("[v0] Starting PDF download for invoice:", invoiceId)
    toast.info("Generating PDF...")

    try {
      // Dynamically import PDF libraries
      const [html2canvas, jsPDF] = await Promise.all([
        import("html2canvas").then((mod) => mod.default),
        import("jspdf").then((mod) => mod.default),
      ])

      // Fetch invoice data
      const response = await fetch(`/app/invoices/${invoiceId}`)
      if (!response.ok) throw new Error("Failed to fetch invoice data")
      
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")
      
      // Extract invoice data from the page (this is a simplified approach)
      // In a real scenario, you'd want to fetch from an API endpoint
      console.log("[v0] Invoice data fetched, generating PDF...")
      
      // Create a hidden container
      const container = document.createElement("div")
      container.style.position = "absolute"
      container.style.left = "-9999px"
      container.style.top = "0"
      container.style.width = "800px"
      document.body.appendChild(container)

      // We need to fetch the actual invoice data - let's use a simple approach
      // by opening the page in an iframe
      const iframe = document.createElement("iframe")
      iframe.style.position = "absolute"
      iframe.style.left = "-9999px"
      iframe.style.width = "800px"
      iframe.style.height = "1200px"
      document.body.appendChild(iframe)
      
      iframe.src = `/app/invoices/${invoiceId}`
      
      // Wait for iframe to load
      await new Promise((resolve) => {
        iframe.onload = resolve
      })

      // Wait a bit for content to render
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) throw new Error("Could not access iframe content")

      const previewElement = iframeDoc.getElementById("invoice-preview")
      if (!previewElement) throw new Error("Invoice preview not found")

      console.log("[v0] Capturing invoice preview as image...")
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      console.log("[v0] Creating PDF from image...")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pdf = new jsPDF("p", "mm", "a4")
      const imgData = canvas.toDataURL("image/png")
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      console.log("[v0] Downloading PDF...")
      pdf.save(`invoice-${invoiceNumber}.pdf`)

      // Cleanup
      document.body.removeChild(iframe)
      if (container.parentNode) {
        document.body.removeChild(container)
      }

      toast.success("PDF downloaded successfully!")
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      toast.error("Failed to generate PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-xs font-semibold text-green-600">DELETE TEST VISIBLE</div>
        <DropdownMenuItem asChild>
          <Link href={`/app/invoices/${invoiceId}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadPDF} disabled={isDownloading}>
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? "Generating..." : "Download PDF"}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Send className="mr-2 h-4 w-4" />
          Send Email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDeleteInvoice} 
          disabled={isDeleting}
          className="text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete Invoice"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
