"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { type InvoiceFormData, calculateInvoiceTotals, formatCurrency, formatDate, toNumber } from "@/lib/utils/invoice"
import { PDF_RENDER_WIDTH } from "@/lib/utils/pdf"

interface InvoicePreviewProps {
  data: InvoiceFormData
  className?: string
}

export function InvoicePreview({ data, className }: InvoicePreviewProps) {
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)

  // The invoice is always laid out at a fixed A4 width so it looks identical
  // on every device. On screens narrower than that, scale the whole invoice
  // down to fit the available width (like a PDF viewer) instead of forcing
  // horizontal scrolling.
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    const update = () => {
      const containerWidth = containerRef.current?.clientWidth ?? PDF_RENDER_WIDTH
      const nextScale = Math.min(1, containerWidth / PDF_RENDER_WIDTH)
      setScale(nextScale)

      const contentHeight = contentRef.current?.offsetHeight
      setScaledHeight(contentHeight ? contentHeight * nextScale : undefined)
    }

    update()

    const observer = new ResizeObserver(update)
    if (containerRef.current) observer.observe(containerRef.current)
    if (contentRef.current) observer.observe(contentRef.current)
    window.addEventListener("resize", update)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div ref={containerRef} className={className} style={{ height: scaledHeight, overflow: "hidden" }}>
      <div
        ref={contentRef}
        style={{
          width: `${PDF_RENDER_WIDTH}px`,
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
          margin: scale >= 1 ? "0 auto" : undefined,
        }}
      >
      <Card
        className="pdf-safe-wrapper p-8"
        id="invoice-preview"
        style={{
          backgroundColor: "#ffffff",
          color: "#171717",
          width: `${PDF_RENDER_WIDTH}px`,
          minWidth: `${PDF_RENDER_WIDTH}px`,
          maxWidth: `${PDF_RENDER_WIDTH}px`,
        }}
      >
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#171717" }}>
            INVOICE
          </h1>
          <p className="mt-1 text-base" style={{ color: "#737373" }}>
            #{data.invoiceNumber}
          </p>
        </div>
        <div className="text-right">
          <div className="text-base">
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
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
            Bill To
          </p>
          <p className="mt-2 text-lg font-semibold" style={{ color: "#171717" }}>
            {data.clientName || "Client Name"}
          </p>
          <p className="text-base" style={{ color: "#737373" }}>
            {data.clientEmail}
          </p>
          <p className="whitespace-pre-line text-base" style={{ color: "#737373" }}>
            {data.clientAddress}
          </p>
        </div>
        <div className="space-y-2 sm:text-right">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
              Issue Date
            </p>
            <p className="text-base" style={{ color: "#171717" }}>
              {formatDate(data.issueDate)}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
              Due Date
            </p>
            <p className="text-base" style={{ color: "#171717" }}>
              {formatDate(data.dueDate)}
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-6" style={{ backgroundColor: "#e5e5e5" }} />

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-base">
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
              const quantity = toNumber(item.quantity)
              const unitPrice = toNumber(item.unitPrice)
              const taxRate = toNumber(item.taxRate)

              const subtotal = quantity * unitPrice
              const tax = subtotal * (taxRate / 100)
              const total = subtotal + tax

              return (
                <tr key={item.id} style={{ borderBottomWidth: "1px", borderBottomColor: "#f5f5f5" }}>
                  <td className="py-3 text-lg font-medium" style={{ color: "#171717" }}>
                    {item.description || "—"}
                  </td>
                  <td className="py-3 text-right" style={{ color: "#171717" }}>
                    {quantity}
                  </td>
                  <td className="py-3 text-right" style={{ color: "#171717" }}>
                    {formatCurrency(unitPrice, data.currency)}
                  </td>
                  <td className="py-3 text-right" style={{ color: "#171717" }}>
                    {taxRate}%
                  </td>
                  <td className="py-3 text-right font-bold text-lg" style={{ color: "#171717" }}>
                    {formatCurrency(total, data.currency)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Separator className="my-6" style={{ backgroundColor: "#e5e5e5" }} />

      {/* Totals */}
      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-base">
            <span style={{ color: "#737373" }}>Subtotal</span>
            <span style={{ color: "#171717" }}>{formatCurrency(totals.subtotal, data.currency)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span style={{ color: "#737373" }}>Tax</span>
            <span style={{ color: "#171717" }}>{formatCurrency(totals.taxAmount, data.currency)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-base">
              <span style={{ color: "#737373" }}>Discount</span>
              <span style={{ color: "#171717" }}>-{formatCurrency(totals.discountAmount, data.currency)}</span>
            </div>
          )}
          <Separator style={{ backgroundColor: "#e5e5e5" }} />
          <div className="mt-4 flex justify-between py-3 text-2xl font-extrabold">
            <span style={{ color: "#171717" }}>Total</span>
            <span className="text-3xl font-extrabold tracking-wide" style={{ color: "#171717" }}>
              {formatCurrency(totals.totalAmount, data.currency)}
            </span>
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
                <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
                  Notes
                </p>
                <p className="mt-2 whitespace-pre-line text-base" style={{ color: "#171717" }}>
                  {data.notes}
                </p>
              </div>
            )}
            {data.terms && (
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
                  Terms & Conditions
                </p>
                <p className="mt-2 whitespace-pre-line text-base" style={{ color: "#171717" }}>
                  {data.terms}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Bank Details */}
      {data.bankDetails && (
        <>
          <Separator className="my-6" style={{ backgroundColor: "#e5e5e5" }} />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
              Bank Details
            </p>
            <p className="mt-2 whitespace-pre-line text-base" style={{ color: "#171717" }}>
              {data.bankDetails}
            </p>
          </div>
        </>
      )}
      </Card>
      </div>
    </div>
  )
}
