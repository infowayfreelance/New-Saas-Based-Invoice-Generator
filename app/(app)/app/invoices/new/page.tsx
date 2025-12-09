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

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Load user settings
        const { data: settings } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

        if (settings) {
          setInitialData((prev) => ({
            ...prev,
            fromName: settings.company_name || "",
            fromAddress: settings.company_address || "",
            currency: settings.default_currency || "USD",
            invoiceNumber: `${settings.invoice_prefix || "INV-"}${String(settings.invoice_start_number || 1).padStart(3, "0")}`,
          }))
        }

        // Check usage
        const usageResult = await checkInvoiceUsage(user.id)
        if (usageResult) {
          setUsage(usageResult)
        }
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
    } catch {
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
        {usage && (
          <UsageMeter
            dailyUsed={usage.dailyUsed}
            dailyLimit={usage.dailyLimit}
            monthlyUsed={usage.monthlyUsed}
            monthlyLimit={usage.monthlyLimit}
            canCreate={usage.canCreate}
          />
        )}
        <InvoiceForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Create Invoice"
        />
      </div>
    </>
  )
}
