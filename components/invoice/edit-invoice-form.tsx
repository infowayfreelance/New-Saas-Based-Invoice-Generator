"use client"

import { InvoiceForm } from "./invoice-form"
import type { InvoiceFormData } from "@/lib/utils/invoice"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import type { GenerateInvoiceResult } from "@/app/actions/invoice"

interface EditInvoiceFormProps {
  invoiceId: string
  initialData: InvoiceFormData & { clientId?: string | null }
  updateAction: (
    invoiceId: string,
    data: InvoiceFormData & { clientId?: string | null },
  ) => Promise<GenerateInvoiceResult>
}

export function EditInvoiceForm({ invoiceId, initialData, updateAction }: EditInvoiceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(data: InvoiceFormData & { clientId?: string | null }) {
    setIsSubmitting(true)
    try {
      const result = await updateAction(invoiceId, data)
      
      if (result.success) {
        toast.success("Invoice updated successfully")
        router.push(`/app/invoices/${invoiceId}`)
      } else {
        toast.error(result.error || "Unknown update error")
      }
    } catch (error) {
      console.error("[v0] Error updating invoice:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown update error"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <InvoiceForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
      submitLabel="Update Invoice"
    />
  )
}
