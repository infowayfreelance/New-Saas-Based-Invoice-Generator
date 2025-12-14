"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/app/page-header"
import { InvoiceForm } from "@/components/invoice/invoice-form"
import { UsageMeter } from "@/components/invoice/usage-meter"
import { type InvoiceFormData, getDefaultInvoiceData } from "@/lib/utils/invoice"
import { generateAuthenticatedInvoice, checkInvoiceUsage } from "@/app/actions/invoice"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function NewInvoicePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [initialData, setInitialData] = useState<InvoiceFormData>(getDefaultInvoiceData())
  const [usage, setUsage] = useState<{
    canCreate: boolean
    dailyUsed: number
    dailyLimit: number | null
    monthlyUsed: number
    monthlyLimit: number | null
  } | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          console.error("[v0] Auth error:", authError)
          setLoadError("Authentication error. Please log in again.")
          setIsLoadingData(false)
          return
        }

        if (!user) {
          console.error("[v0] No authenticated user")
          setLoadError("Please log in to create invoices.")
          setIsLoadingData(false)
          return
        }

        try {
          const { data: settings, error: settingsError } = await supabase
            .from("user_settings")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle() // Use maybeSingle instead of single to avoid throwing on no rows

          // Only log error if it's not a "table doesn't exist" error
          if (settingsError && !settingsError.message.includes("does not exist")) {
            console.error("[v0] Settings error:", settingsError)
          }

          if (settings) {
            setInitialData((prev) => ({
              ...prev,
              fromName: settings.company_name || "",
              fromAddress: settings.company_address || "",
              currency: settings.default_currency || "USD",
              invoiceNumber: `${settings.invoice_prefix || "INV-"}${String(settings.invoice_start_number || 1).padStart(3, "0")}`,
            }))
          }
        } catch (settingsErr) {
          // Silently handle settings errors - not critical for invoice creation
          console.error("[v0] Error loading settings:", settingsErr)
        }

        try {
          const usageResult = await checkInvoiceUsage(user.id)
          if (usageResult) {
            setUsage(usageResult)
          }
        } catch (usageErr) {
          console.error("[v0] Error checking usage:", usageErr)
          // Continue without usage data - not critical
        }
      } catch (err) {
        console.error("[v0] Error loading invoice data:", err)
        setLoadError("Failed to load invoice data. You can still create an invoice with default settings.")
      } finally {
        setIsLoadingData(false)
      }
    }
    loadData()
  }, [])

  const handleSubmit = async (data: InvoiceFormData) => {
    setIsLoading(true)

    try {
      const result = await generateAuthenticatedInvoice(data)

      if (!result.success) {
        toast.error(result.error || "Failed to create invoice")
        if (result.usage) {
          setUsage(result.usage)
        }
        return
      }

      toast.success("Invoice created successfully!")
      router.push(`/app/invoices/${result.invoiceId}`)
    } catch (err) {
      console.error("[v0] Invoice creation error:", err)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="New Invoice"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Invoices", href: "/app/invoices" },
          { label: "New Invoice" },
        ]}
      />
      <div className="flex-1 space-y-6 p-6">
        {loadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loadError}</AlertDescription>
          </Alert>
        )}

        {usage && !isLoadingData && (
          <UsageMeter
            dailyUsed={usage.dailyUsed}
            dailyLimit={usage.dailyLimit}
            monthlyUsed={usage.monthlyUsed}
            monthlyLimit={usage.monthlyLimit}
            canCreate={usage.canCreate}
          />
        )}

        {isLoadingData ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="text-sm text-muted-foreground">Loading invoice form...</p>
            </div>
          </div>
        ) : (
          <InvoiceForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Create Invoice"
          />
        )}
      </div>
    </>
  )
}
