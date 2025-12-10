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
    <Card
      className={`pdf-safe-wrapper p-8 ${className}`}
      id="invoice-preview"
      style={{
        backgroundColor: "#ffffff",
        color: "#171717",
      }}
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#171717" }}>
            INVOICE
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#737373" }}>
            #{data.invoiceNumber}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm">
            <p className="font-semibold" style={{ color: "#171717" }}>
              {data.fromName || "Your Business Name"}
            </p>
            <p style={{ color: "#737373" }}>{data.fromEmail}</p>
            <p className="whitespace-pre-line" style={{ color: "#737373" }}>
              {data.fromAddress}
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-6" style={{ backgroundColor: "#e5e5e5" }} />

      {/* Bill To & Invoice Info */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
            Bill To
          </p>
          <p className="mt-2 font-semibold" style={{ color: "#171717" }}>
            {data.clientName || "Client Name"}
          </p>
          <p className="text-sm" style={{ color: "#737373" }}>
            {data.clientEmail}
          </p>
          <p className="whitespace-pre-line text-sm" style={{ color: "#737373" }}>
            {data.clientAddress}
          </p>
        </div>
        <div className="space-y-2 sm:text-right">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
              Issue Date
            </p>
            <p className="text-sm" style={{ color: "#171717" }}>
              {formatDate(data.issueDate)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
              Due Date
            </p>
            <p className="text-sm" style={{ color: "#171717" }}>
              {formatDate(data.dueDate)}
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-6" style={{ backgroundColor: "#e5e5e5" }} />

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottomWidth: "1px", borderBottomColor: "#e5e5e5" }}>
              <th className="pb-3 text-left font-semibold" style={{ color: "#171717" }}>
                Description
              </th>
              <th className="pb-3 text-right font-semibold" style={{ color: "#171717" }}>
                Qty
              </th>
              <th className="pb-3 text-right font-semibold" style={{ color: "#171717" }}>
                Price
              </th>
              <th className="pb-3 text-right font-semibold" style={{ color: "#171717" }}>
                Tax
              </th>
              <th className="pb-3 text-right font-semibold" style={{ color: "#171717" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => {
              const subtotal = item.quantity * item.unitPrice
              const tax = subtotal * (item.taxRate / 100)
              const total = subtotal + tax
              return (
                <tr key={item.id} style={{ borderBottomWidth: "1px", borderBottomColor: "#f5f5f5" }}>
                  <td className="py-3" style={{ color: "#171717" }}>
                    {item.description || "—"}
                  </td>
                  <td className="py-3 text-right" style={{ color: "#171717" }}>
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right" style={{ color: "#171717" }}>
                    {formatCurrency(item.unitPrice, data.currency)}
                  </td>
                  <td className="py-3 text-right" style={{ color: "#171717" }}>
                    {item.taxRate}%
                  </td>
                  <td className="py-3 text-right" style={{ color: "#171717" }}>
                    {formatCurrency(total, data.currency)}
                  </td>
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
            <span style={{ color: "#737373" }}>Subtotal</span>
            <span style={{ color: "#171717" }}>{formatCurrency(totals.subtotal, data.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#737373" }}>Tax</span>
            <span style={{ color: "#171717" }}>{formatCurrency(totals.taxAmount, data.currency)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span style={{ color: "#737373" }}>Discount</span>
              <span style={{ color: "#171717" }}>-{formatCurrency(totals.discountAmount, data.currency)}</span>
            </div>
          )}
          <Separator style={{ backgroundColor: "#e5e5e5" }} />
          <div className="flex justify-between text-lg font-semibold">
            <span style={{ color: "#171717" }}>Total</span>
            <span style={{ color: "#171717" }}>{formatCurrency(totals.totalAmount, data.currency)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      {(data.notes || data.terms) && (
        <>
          <Separator className="my-6" style={{ backgroundColor: "#e5e5e5" }} />
          <div className="grid gap-6 sm:grid-cols-2">
            {data.notes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
                  Notes
                </p>
                <p className="mt-2 whitespace-pre-line text-sm" style={{ color: "#171717" }}>
                  {data.notes}
                </p>
              </div>
            )}
            {data.terms && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
                  Terms & Conditions
                </p>
                <p className="mt-2 whitespace-pre-line text-sm" style={{ color: "#171717" }}>
                  {data.terms}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
