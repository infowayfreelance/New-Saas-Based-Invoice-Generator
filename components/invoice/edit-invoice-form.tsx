"use client"

import { InvoiceForm } from "./invoice-form"
import type { InvoiceFormData } from "@/lib/utils/invoice"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { GenerateInvoiceResult } from "@/lib/utils/invoice"

interface EditInvoiceFormProps {
  invoiceId: string
  initialData: InvoiceFormData
  updateAction: (data: InvoiceFormData & { clientId?: string | null }) => Promise<GenerateInvoiceResult>
}

export function EditInvoiceForm({ invoiceId, initialData, updateAction }: EditInvoiceFormProps) {
  const router = useRouter()

  async function handleSubmit(data: InvoiceFormData & { clientId?: string | null }) {
    const result = await updateAction(data)
    
    if (result.success) {
      toast.success("Invoice updated successfully")
      router.push(`/app/invoices/${invoiceId}`)
    } else {
      toast.error(result.error || "Failed to update invoice")
    }
    
    return result
  }

  return <InvoiceForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Update Invoice" />
}
