"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoiceForm } from "@/components/invoice/invoice-form"
import { InvoicePreview } from "@/components/invoice/invoice-preview"
import { UsageMeter } from "@/components/invoice/usage-meter"
import { type InvoiceFormData, getDefaultInvoiceData, calculateInvoiceTotals } from "@/lib/utils/invoice"
import { generateGuestInvoice, checkInvoiceUsage } from "@/app/actions/invoice"
import { downloadInvoicePdf } from "@/lib/utils/pdf"
import { Download, Send, AlertCircle, ArrowRight, FilePlus } from "lucide-react"
import { toast } from "sonner"
import { FloatingDownloadButton } from "@/components/floating-download-button"

interface EmbeddedInvoiceGeneratorProps {
  /** Show the "Free Invoice Generator" page heading. Off when embedded in the homepage hero. */
  showHeading?: boolean
  /**
   * Track usage against the database and enforce guest limits, like the
   * standalone /free-invoice page does. Off (the default) for the homepage
   * hero, which is a purely client-side demo: fill it in, preview it,
   * download it - nothing is sent to or stored in the database.
   */
  useBackend?: boolean
}

/**
 * The invoice generator UI - shared between the homepage hero (a pure,
 * client-side demo with no database involved) and the standalone
 * /free-invoice page (which tracks guest usage against the database), so
 * both stay visually in sync.
 */
export function EmbeddedInvoiceGenerator({ showHeading = false, useBackend = false }: EmbeddedInvoiceGeneratorProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(getDefaultInvoiceData())
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [showLimitDialog, setShowLimitDialog] = useState(false)
  const [usage, setUsage] = useState<{
    canCreate: boolean
    dailyUsed: number
    dailyLimit: number | null
    monthlyUsed: number
    monthlyLimit: number | null
    message?: string
  } | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!useBackend) return

    const loadUsage = async () => {
      const result = await checkInvoiceUsage(null)
      if (result) {
        setUsage(result)
      }
    }
    loadUsage()
  }, [useBackend])

  const handleFormSubmit = async (data: InvoiceFormData) => {
    setFormData(data)

    // Homepage demo: no server call, no usage tracking, no database - just
    // show the preview immediately from the values entered manually.
    if (!useBackend) {
      setShowPreview(true)
      toast.success("Invoice generated successfully!")
      return
    }

    setIsLoading(true)

    try {
      const result = await generateGuestInvoice(data)

      if (!result.success) {
        if (result.usage) {
          setUsage(result.usage)
        }
        setShowLimitDialog(true)
        return
      }

      if (result.usage) {
        setUsage(result.usage)
      }

      setShowPreview(true)
      toast.success("Invoice generated successfully!")
    } catch {
      toast.error("Failed to generate invoice. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = useCallback(async () => {
    const element = document.getElementById("invoice-preview")
    if (!element) {
      toast.error("Invoice preview not found. Please try again.")
      return
    }

    toast.info("Generating PDF...")

    try {
      await downloadInvoicePdf(element, `invoice-${formData.invoiceNumber}.pdf`)
      toast.success("PDF downloaded successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF. Please try again or contact support.", {
        duration: 5000,
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    }
  }, [formData.invoiceNumber])

  const handleCreateNewInvoice = useCallback(() => {
    setFormData(getDefaultInvoiceData())
    setShowPreview(false)
  }, [])

  return (
    <div id="invoice-generator" className="scroll-mt-20">
      {showHeading && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Free Invoice Generator</h1>
          <p className="mt-2 text-muted-foreground">Create professional invoices in seconds. No signup required.</p>
        </div>
      )}

      {usage && (
        <div className="mb-6">
          <UsageMeter
            dailyUsed={usage.dailyUsed}
            dailyLimit={usage.dailyLimit}
            monthlyUsed={usage.monthlyUsed}
            monthlyLimit={usage.monthlyLimit}
            canCreate={usage.canCreate}
          />
        </div>
      )}

      {!showPreview ? (
        <InvoiceForm
          initialData={formData}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          submitLabel="Generate Invoice"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleCreateNewInvoice} className="bg-transparent">
              <FilePlus className="mr-2 h-4 w-4" />
              Create New Invoice
            </Button>
            <Button variant="outline" onClick={() => setShowEmailDialog(true)} className="bg-transparent">
              <Send className="mr-2 h-4 w-4" />
              Send via Email
            </Button>
            <Button variant="ghost" onClick={() => setShowPreview(false)}>
              Edit Invoice
            </Button>
          </div>

          <Tabs defaultValue="preview" className="w-full">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-6">
              <div ref={previewRef} className="rounded-lg border border-border shadow-sm">
                <InvoicePreview data={formData} />
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Summary</CardTitle>
                  <CardDescription>Invoice #{formData.invoiceNumber}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">From</p>
                      <p className="font-medium">{formData.fromName}</p>
                      <p className="text-sm text-muted-foreground">{formData.fromEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">To</p>
                      <p className="font-medium">{formData.clientName}</p>
                      <p className="text-sm text-muted-foreground">{formData.clientEmail}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                      <p>{new Date(formData.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                      <p>{new Date(formData.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total</p>
                      <p className="text-xl font-bold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: formData.currency,
                        }).format(calculateInvoiceTotals(formData.items, formData.discountAmount).totalAmount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <FloatingDownloadButton onClick={handleDownloadPDF} isVisible={showPreview} />

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send via Email
            </DialogTitle>
            <DialogDescription>
              Email delivery is available on paid plans. Sign up to unlock this feature and more!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium">What you get with a paid plan:</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Send invoices directly to clients</li>
                <li>Professional email templates</li>
                <li>Save and manage clients</li>
                <li>Invoice history and tracking</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)} className="bg-transparent">
              Maybe Later
            </Button>
            <Link href="/register">
              <Button>
                Sign Up Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Usage Limit Reached
            </DialogTitle>
            <DialogDescription>
              {usage?.message || "You've reached your invoice limit for this period."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium">Upgrade to continue creating invoices</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Basic plan: 5/day, 30/month - $5/mo</li>
                <li>Standard plan: Unlimited - $12/mo</li>
                <li>Pro plan: Unlimited + premium features - $29.99/mo</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLimitDialog(false)} className="bg-transparent">
              Close
            </Button>
            <Link href="/register">
              <Button>
                Sign Up Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
