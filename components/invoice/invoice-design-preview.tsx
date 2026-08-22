"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DesignSlider } from "@/components/invoice/design-slider"
import { InvoicePreview } from "@/components/invoice/invoice-preview"
import { updateInvoiceLayoutStyle } from "@/app/actions/invoice"
import { type InvoiceFormData } from "@/lib/utils/invoice"
import { toast } from "sonner"

interface InvoiceDesignPreviewProps {
  invoiceId: string
  data: InvoiceFormData
}

export function InvoiceDesignPreview({ invoiceId, data }: InvoiceDesignPreviewProps) {
  const [layoutStyle, setLayoutStyle] = useState(data.layoutStyle || "classic")
  const [isPending, startTransition] = useTransition()

  const handleChange = (value: string) => {
    setLayoutStyle(value)
    startTransition(async () => {
      const result = await updateInvoiceLayoutStyle(invoiceId, value)
      if (!result.success) {
        toast.error(result.error || "Failed to update invoice design")
      }
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Invoice Design</CardTitle>
          <CardDescription>Choose how this invoice looks.</CardDescription>
        </CardHeader>
        <CardContent>
          <DesignSlider
            value={layoutStyle}
            primaryColor={data.primaryColor}
            accentColor={data.accentColor}
            onChange={handleChange}
          />
        </CardContent>
      </Card>
      <div className="rounded-lg border border-border shadow-sm">
        <InvoicePreview data={{ ...data, layoutStyle }} />
      </div>
    </div>
  )
}
