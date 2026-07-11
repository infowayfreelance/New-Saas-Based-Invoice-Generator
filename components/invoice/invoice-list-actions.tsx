"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Pencil, Download, Send, Trash } from "lucide-react"
import { toast } from "sonner"
import { deleteInvoice } from "@/app/actions/invoice-delete"
import { downloadInvoicePdf } from "@/lib/utils/pdf"

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
    toast.info("Generating PDF...")

    // Render the invoice detail page in a hidden iframe and capture its preview
    const iframe = document.createElement("iframe")
    iframe.style.position = "absolute"
    iframe.style.left = "-9999px"
    iframe.style.width = "1000px"
    iframe.style.height = "1400px"
    document.body.appendChild(iframe)

    try {
      iframe.src = `/app/invoices/${invoiceId}`

      await new Promise((resolve) => {
        iframe.onload = resolve
      })

      // Give the page a moment to finish rendering
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) throw new Error("Could not access iframe content")

      const previewElement = iframeDoc.getElementById("invoice-preview")
      if (!previewElement) throw new Error("Invoice preview not found")

      await downloadInvoicePdf(previewElement, `invoice-${invoiceNumber}.pdf`)

      toast.success("PDF downloaded successfully!")
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      toast.error("Failed to generate PDF. Please try again.")
    } finally {
      document.body.removeChild(iframe)
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
        <DropdownMenuItem asChild>
          <Link href={`/app/invoices/${invoiceId}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/app/invoices/${invoiceId}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
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
