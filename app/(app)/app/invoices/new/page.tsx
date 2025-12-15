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
    let mounted = true

    const loadData = async () => {
      try {
        console.log("[v0] Loading invoice form data...")
        const supabase = createClient()

        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Auth timeout")), 3000))

        const authPromise = supabase.auth.getUser()
        const authResult = (await Promise.race([authPromise, timeoutPromise])) as any

        if (!mounted) return

        const {
          data: { user },
          error: authError,
        } = authResult

        if (authError) {
          console.error("[v0] Auth error:", authError)
          setLoadError("Connection issue. Using default settings.")
          setIsLoadingData(false)
          return
        }

        if (!user) {
          console.log("[v0] No user, using demo mode")
          setLoadError("Demo mode: Using default invoice settings.")
          setIsLoadingData(false)
          return
        }

        try {
          const settingsPromise = supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle()

          const settingsResult = (await Promise.race([
            settingsPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Settings timeout")), 3000)),
          ])) as any

          if (!mounted) return

          const { data: settings, error: settingsError } = settingsResult

          if (settingsError && !settingsError.message?.includes("does not exist")) {
            console.error("[v0] Settings error:", settingsError)
          }

          if (settings) {
            console.log("[v0] Loaded user settings")
            setInitialData((prev) => ({
              ...prev,
              fromName: settings.company_name || user.email || "",
              fromEmail: settings.default_reply_to_email || user.email || "",
              fromAddress: settings.company_address || "",
              currency: settings.default_currency || "USD",
              invoiceNumber: `${settings.invoice_prefix || "INV-"}${String(settings.invoice_start_number || 1).padStart(3, "0")}`,
            }))
          }
        } catch (settingsErr) {
          console.error("[v0] Error loading settings:", settingsErr)
          // Continue with defaults
        }

        try {
          const usagePromise = checkInvoiceUsage(user.id)
          const usageResult = (await Promise.race([
            usagePromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Usage timeout")), 3000)),
          ])) as any

          if (!mounted) return

          if (usageResult) {
            console.log("[v0] Loaded usage data")
            setUsage(usageResult)
          }
        } catch (usageErr) {
          console.error("[v0] Error checking usage:", usageErr)
          // Continue without usage data
        }
      } catch (err) {
        console.error("[v0] Error loading invoice data:", err)
        if (mounted) {
          setLoadError("Connection issue. Using default settings.")
        }
      } finally {
        if (mounted) {
          setIsLoadingData(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (data: InvoiceFormData & { clientId?: string | null }) => {
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
