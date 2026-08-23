"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoiceStyleControls } from "@/components/invoice/invoice-style-controls"
import { InvoicePreview } from "@/components/invoice/invoice-preview"
import { updateInvoiceStyle } from "@/app/actions/invoice"
import { type InvoiceFormData } from "@/lib/utils/invoice"
import { toast } from "sonner"

interface InvoiceDesignPreviewProps {
  invoiceId: string
  data: InvoiceFormData
}

export function InvoiceDesignPreview({ invoiceId, data }: InvoiceDesignPreviewProps) {
  const [style, setStyle] = useState({
    layoutStyle: data.layoutStyle || "classic",
    primaryColor: data.primaryColor,
    accentColor: data.accentColor,
    fontFamily: data.fontFamily || "sans",
  })
  const [isPending, startTransition] = useTransition()

  const handleChange = (patch: Partial<typeof style>) => {
    const next = { ...style, ...patch }
    setStyle(next)
    startTransition(async () => {
      const result = await updateInvoiceStyle(invoiceId, patch)
      if (!result.success) {
        toast.error(result.error || "Failed to update invoice style")
      }
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Invoice Style</CardTitle>
          <CardDescription>Choose the design, colors, and font for this invoice.</CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceStyleControls
            layoutStyle={style.layoutStyle}
            primaryColor={style.primaryColor}
            accentColor={style.accentColor}
            fontFamily={style.fontFamily}
            onLayoutStyleChange={(value) => handleChange({ layoutStyle: value })}
            onPrimaryColorChange={(value) => handleChange({ primaryColor: value })}
            onAccentColorChange={(value) => handleChange({ accentColor: value })}
            onFontFamilyChange={(value) => handleChange({ fontFamily: value })}
          />
        </CardContent>
      </Card>
      <div className="rounded-lg border border-border shadow-sm">
        <InvoicePreview data={{ ...data, ...style }} />
      </div>
    </div>
  )
}
