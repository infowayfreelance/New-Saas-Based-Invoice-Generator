"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
import { InvoiceStyleControls } from "@/components/invoice/invoice-style-controls"
import { UsageMeter } from "@/components/invoice/usage-meter"
import { type InvoiceFormData, type InvoiceVisibility, getDefaultInvoiceData } from "@/lib/utils/invoice"
import { generateGuestInvoice, checkInvoiceUsage } from "@/app/actions/invoice"
import { downloadInvoicePdf } from "@/lib/utils/pdf"
import { Download, Printer, Send, AlertCircle, ArrowRight, FilePlus, Eye, Pencil } from "lucide-react"
import { toast } from "sonner"
import { FloatingDownloadButton } from "@/components/floating-download-button"

interface EmbeddedInvoiceGeneratorProps {
  showHeading?: boolean
  useBackend?: boolean
}

const VALID_LAYOUTS = ["classic", "modern", "banner", "minimal", "bold", "creative", "compact"]

export function EmbeddedInvoiceGenerator({ showHeading = false, useBackend = false }: EmbeddedInvoiceGeneratorProps) {
  const searchParams = useSearchParams()
  const initialLayout = VALID_LAYOUTS.includes(searchParams.get("layout") ?? "") ? searchParams.get("layout")! : undefined
  const freelancerMode = searchParams.get("mode") === "freelancer"
  const [formData, setFormData] = useState<InvoiceFormData>(() => {
    const data = getDefaultInvoiceData()
    if (initialLayout) data.layoutStyle = initialLayout
    if (searchParams.get("mode") === "freelancer") {
      data.layoutStyle = initialLayout || "modern"
      data.items[0].billingType = "fixed"
    }
    return data
  })
  const [isLoading, setIsLoading] = useState(false)
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit")
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
      if (result) setUsage(result)
    }
    loadUsage()
  }, [useBackend])

  const handleFormChange = useCallback((data: InvoiceFormData) => {
    setFormData((prev) => ({
      ...data,
      logoPosition: prev.logoPosition,
      infoLayout: prev.infoLayout,
      tableStyle: prev.tableStyle,
    }))
  }, [])

  const handleDownloadPDF = useCallback(async () => {
    if (useBackend) {
      setIsLoading(true)
      try {
        const result = await generateGuestInvoice(formData)
        if (!result.success) {
          if (result.usage) setUsage(result.usage)
          setShowLimitDialog(true)
          return
        }
        if (result.usage) setUsage(result.usage)
      } catch {
        toast.error("Failed to generate invoice. Please try again.")
        return
      } finally {
        setIsLoading(false)
      }
    }

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
      toast.error("Failed to generate PDF. Please try again.", {
        duration: 5000,
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    }
  }, [formData, useBackend])

  const handleCreateNewInvoice = useCallback(() => {
    setFormData(getDefaultInvoiceData())
    setMobileTab("edit")
  }, [])

  const handleStyleChange = useCallback((key: keyof InvoiceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleVisibilityChange = useCallback((key: keyof InvoiceVisibility, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      visibility: { ...(prev.visibility ?? {}), [key]: value },
    }))
  }, [])

  const layout = formData.layoutStyle || "classic"
  const supportsLogoPosition = ["classic", "modern", "banner", "minimal", "bold", "compact"].includes(layout)
  const supportsInfoLayout = ["classic", "minimal", "bold"].includes(layout)
  const supportsTableStyle = ["classic", "modern", "banner", "bold", "compact"].includes(layout)

  const styleControls = (
    <InvoiceStyleControls
      layoutStyle={layout}
      primaryColor={formData.primaryColor}
      accentColor={formData.accentColor}
      fontFamily={formData.fontFamily || "sans"}
      logoPosition={formData.logoPosition || "left"}
      infoLayout={formData.infoLayout || "side-by-side"}
      tableStyle={formData.tableStyle || "clean"}
      visibility={formData.visibility}
      onLayoutStyleChange={(v) => handleStyleChange("layoutStyle", v)}
      onPrimaryColorChange={(v) => handleStyleChange("primaryColor", v)}
      onAccentColorChange={(v) => handleStyleChange("accentColor", v)}
      onFontFamilyChange={(v) => handleStyleChange("fontFamily", v)}
      onLogoPositionChange={supportsLogoPosition ? (v) => handleStyleChange("logoPosition", v) : undefined}
      onInfoLayoutChange={supportsInfoLayout ? (v) => handleStyleChange("infoLayout", v) : undefined}
      onTableStyleChange={supportsTableStyle ? (v) => handleStyleChange("tableStyle", v) : undefined}
      onVisibilityChange={handleVisibilityChange}
    />
  )

  const actionButtons = (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={handleDownloadPDF} disabled={isLoading}>
        <Download className="mr-2 h-4 w-4" />
        {isLoading ? "Generating…" : "Download PDF"}
      </Button>
      <Button variant="outline" onClick={handleCreateNewInvoice} className="bg-transparent">
        <FilePlus className="mr-2 h-4 w-4" />
        New Invoice
      </Button>
      <Button variant="outline" onClick={() => window.print()} className="bg-transparent">
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <Button variant="outline" onClick={() => setShowEmailDialog(true)} className="bg-transparent">
        <Send className="mr-2 h-4 w-4" />
        Send via Email
      </Button>
    </div>
  )

  return (
    <div id="invoice-generator" className="scroll-mt-20">
      {showHeading && (
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">Free Invoice Generator</h1>
            {freelancerMode && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Freelancer Mode
              </span>
            )}
          </div>
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

      {/* Action bar — always visible */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {actionButtons}
      </div>

      {/* Desktop: side-by-side editor + preview */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
        {/* Left: form */}
        <div className="min-w-0">
          <InvoiceForm
            initialData={formData}
            onChange={handleFormChange}
            hideSubmit
            isLoading={isLoading}
          />
        </div>

        {/* Right: style controls + live preview */}
        <div className="min-w-0 space-y-4 sticky top-4">
          {styleControls}
          <div ref={previewRef} className="rounded-lg border border-border shadow-sm overflow-hidden">
            <InvoicePreview data={formData} />
          </div>
        </div>
      </div>

      {/* Mobile: tabbed edit/preview */}
      <div className="lg:hidden">
        <Tabs value={mobileTab} onValueChange={(v) => setMobileTab(v as "edit" | "preview")}>
          <TabsList className="w-full">
            <TabsTrigger value="edit" className="flex-1 gap-2">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1 gap-2">
              <Eye className="h-3.5 w-3.5" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-4">
            <InvoiceForm
              initialData={formData}
              onChange={handleFormChange}
              hideSubmit
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-4 space-y-4">
            {styleControls}
            <div ref={previewRef} className="rounded-lg border border-border shadow-sm overflow-hidden">
              <InvoicePreview data={formData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FloatingDownloadButton onClick={handleDownloadPDF} isVisible />

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
                <li>Basic plan: 5/day, 30/month — $5/mo</li>
                <li>Standard plan: Unlimited — $12/mo</li>
                <li>Pro plan: Unlimited + premium features — $29.99/mo</li>
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
