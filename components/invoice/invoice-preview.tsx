"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { type InvoiceFormData, calculateInvoiceTotals, formatCurrency, formatDate } from "@/lib/utils/invoice"

interface InvoicePreviewProps {
  data: InvoiceFormData
  className?: string
}

export function InvoicePreview({ data, className }: InvoicePreviewProps) {
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)

  return (
    <Card className={`bg-white p-8 text-foreground ${className}`} id="invoice-preview">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-foreground">INVOICE</h1>
          <p className="mt-1 text-sm text-muted-foreground">#{data.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <div className="text-sm">
            <p className="font-semibold">{data.fromName || "Your Business Name"}</p>
            <p className="text-muted-foreground">{data.fromEmail}</p>
            <p className="whitespace-pre-line text-muted-foreground">{data.fromAddress}</p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Bill To & Invoice Info */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bill To</p>
          <p className="mt-2 font-semibold">{data.clientName || "Client Name"}</p>
          <p className="text-sm text-muted-foreground">{data.clientEmail}</p>
          <p className="whitespace-pre-line text-sm text-muted-foreground">{data.clientAddress}</p>
        </div>
        <div className="space-y-2 sm:text-right">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Issue Date</p>
            <p className="text-sm">{formatDate(data.issueDate)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Due Date</p>
            <p className="text-sm">{formatDate(data.dueDate)}</p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left font-semibold">Description</th>
              <th className="pb-3 text-right font-semibold">Qty</th>
              <th className="pb-3 text-right font-semibold">Price</th>
              <th className="pb-3 text-right font-semibold">Tax</th>
              <th className="pb-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => {
              const subtotal = item.quantity * item.unitPrice
              const tax = subtotal * (item.taxRate / 100)
              const total = subtotal + tax
              return (
                <tr key={item.id} className="border-b border-border/50">
                  <td className="py-3">{item.description || "—"}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">{formatCurrency(item.unitPrice, data.currency)}</td>
                  <td className="py-3 text-right">{item.taxRate}%</td>
                  <td className="py-3 text-right">{formatCurrency(total, data.currency)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(totals.subtotal, data.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>{formatCurrency(totals.taxAmount, data.currency)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span>-{formatCurrency(totals.discountAmount, data.currency)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatCurrency(totals.totalAmount, data.currency)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      {(data.notes || data.terms) && (
        <>
          <Separator className="my-6" />
          <div className="grid gap-6 sm:grid-cols-2">
            {data.notes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</p>
                <p className="mt-2 whitespace-pre-line text-sm">{data.notes}</p>
              </div>
            )}
            {data.terms && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Terms & Conditions
                </p>
                <p className="mt-2 whitespace-pre-line text-sm">{data.terms}</p>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
