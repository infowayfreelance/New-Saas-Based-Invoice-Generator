"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { type InvoiceFormData, calculateInvoiceTotals, formatCurrency, formatDate, toNumber } from "@/lib/utils/invoice"
import { PDF_RENDER_WIDTH, PDF_RENDER_HEIGHT } from "@/lib/utils/pdf"
import { getFontStack } from "@/lib/utils/fonts"

interface InvoicePreviewProps {
  data: InvoiceFormData
  className?: string
}

function getReadableDarkColor(hex?: string): string {
  if (!hex) return "#171717"
  const match = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!match) return "#171717"
  const value = match[1]
  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  // Relative luminance — bright brand colors (e.g. neon green) make poor
  // backgrounds for large blocks of white text, so fall back to near-black.
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance > 0.55 ? "#171717" : hex
}

function getStatusStamp(status?: string): { label: string; color: string } | null {
  const normalized = (status || "").toLowerCase()
  if (normalized === "paid") return { label: "PAID", color: "#16a34a" }
  if (normalized === "overdue") return { label: "OVERDUE", color: "#dc2626" }
  if (normalized === "draft") return { label: "DRAFT", color: "#737373" }
  return null
}

export function InvoicePreview({ data, className }: InvoicePreviewProps) {
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

      const contentHeight = Math.max(contentRef.current?.offsetHeight ?? 0, PDF_RENDER_HEIGHT)
      setScaledHeight(contentHeight * nextScale)
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
            minHeight: `${PDF_RENDER_HEIGHT}px`,
            position: "relative",
            overflow: "hidden",
            padding: data.layoutStyle === "banner" ? 0 : undefined,
            border: "1px solid #e5e5e5",
            boxShadow: "none",
            fontFamily: getFontStack(data.fontFamily),
          }}
        >
          {data.layoutStyle === "banner" ? <BannerInvoiceBody data={data} /> : <ClassicInvoiceBody data={data} />}
        </Card>
      </div>
    </div>
  )
}

function ClassicInvoiceBody({ data }: { data: InvoiceFormData }) {
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)
  const accentColor = data.accentColor || "#171717"
  const amountPaid = toNumber(data.amountPaid)
  const balanceDue = Math.max(totals.totalAmount - amountPaid, 0)
  const stamp = getStatusStamp(data.status)

  return (
    <>
      {/* Watermark */}
      {data.watermarkText && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <span
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: "#171717",
              opacity: 0.06,
              transform: "rotate(-30deg)",
              whiteSpace: "nowrap",
            }}
          >
            {data.watermarkText}
          </span>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row">
          <div>
            <div className="flex items-center gap-3">
              {data.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.logoUrl}
                  alt="Business logo"
                  crossOrigin="anonymous"
                  style={{ height: "48px", width: "auto", objectFit: "contain" }}
                />
              )}
              <h1 className="text-3xl font-bold" style={{ color: accentColor }}>
                INVOICE
              </h1>
              {stamp && (
                <span
                  className="rounded border px-2 py-1 text-sm font-bold tracking-wider"
                  style={{ color: stamp.color, borderColor: stamp.color }}
                >
                  {stamp.label}
                </span>
              )}
            </div>
            <p className="mt-1 text-base" style={{ color: "#737373" }}>
              #{data.invoiceNumber}
            </p>
            {data.poNumber && (
              <p className="text-base" style={{ color: "#737373" }}>
                PO #: {data.poNumber}
              </p>
            )}
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
              {data.fromTaxId && <p style={{ color: "#737373" }}>Tax ID: {data.fromTaxId}</p>}
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
            {data.clientTaxId && (
              <p className="text-base" style={{ color: "#737373" }}>
                Tax ID: {data.clientTaxId}
              </p>
            )}
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
              <tr style={{ borderBottomWidth: "2px", borderBottomColor: accentColor }}>
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
              <span className="text-3xl font-extrabold tracking-wide" style={{ color: accentColor }}>
                {formatCurrency(totals.totalAmount, data.currency)}
              </span>
            </div>
            {amountPaid > 0 && (
              <>
                <div className="flex justify-between text-base">
                  <span style={{ color: "#737373" }}>Amount Paid</span>
                  <span style={{ color: "#16a34a" }}>-{formatCurrency(amountPaid, data.currency)}</span>
                </div>
                <Separator style={{ backgroundColor: "#e5e5e5" }} />
                <div className="flex justify-between py-1 text-xl font-bold">
                  <span style={{ color: "#171717" }}>Balance Due</span>
                  <span style={{ color: balanceDue > 0 ? "#dc2626" : "#16a34a" }}>
                    {formatCurrency(balanceDue, data.currency)}
                  </span>
                </div>
              </>
            )}
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

        {/* Signature */}
        {data.signatureUrl && (
          <>
            <Separator className="my-6" style={{ backgroundColor: "#e5e5e5" }} />
            <div className="flex justify-end">
              <div className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.signatureUrl}
                  alt="Authorized signature"
                  crossOrigin="anonymous"
                  style={{ height: "64px", width: "auto", objectFit: "contain" }}
                />
                <p className="mt-1 border-t pt-1 text-sm" style={{ color: "#737373", borderColor: "#e5e5e5" }}>
                  Authorized Signature
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

function BannerInvoiceBody({ data }: { data: InvoiceFormData }) {
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)
  const accentColor = data.accentColor || "#f5c518"
  // The user's chosen brand color is always used for text/labels (readable on
  // white regardless of brightness). A separate, contrast-safe variant is used
  // only where white text sits on top of it (e.g. the table header row).
  const brandColor = data.primaryColor || "#171717"
  const darkColor = getReadableDarkColor(data.primaryColor)
  const amountPaid = toNumber(data.amountPaid)
  const balanceDue = Math.max(totals.totalAmount - amountPaid, 0)
  const stamp = getStatusStamp(data.status)
  const footerContact = [data.fromEmail, data.fromAddress?.split("\n")[0]].filter(Boolean).join("   |   ")

  return (
    <div
      className="flex flex-col p-10"
      style={{ position: "relative", minHeight: `${PDF_RENDER_HEIGHT}px` }}
    >
      {/* Watermark */}
      {data.watermarkText && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <span
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: darkColor,
              opacity: 0.06,
              transform: "rotate(-30deg)",
              whiteSpace: "nowrap",
            }}
          >
            {data.watermarkText}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col" style={{ position: "relative", zIndex: 1 }}>
        {/* Logo row */}
        <div className="flex items-center gap-3">
          {data.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.logoUrl}
              alt="Business logo"
              crossOrigin="anonymous"
              style={{ height: "40px", width: "auto", objectFit: "contain" }}
            />
          ) : null}
          <span className="text-lg font-bold" style={{ color: brandColor }}>
            {data.fromName || "Your Business Name"}
          </span>
        </div>

        {/* Banner bar */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div style={{ height: "10px", flex: 1, backgroundColor: accentColor }} />
          <h1
            className="px-4 text-4xl font-extrabold tracking-wide"
            style={{ color: brandColor, backgroundColor: "#ffffff" }}
          >
            INVOICE
          </h1>
          <div style={{ height: "10px", width: "48px", backgroundColor: darkColor }} />
        </div>

        {/* Divider bar */}
        <div className="mt-1 flex items-center justify-end">
          <div style={{ height: "8px", flex: 1, backgroundColor: accentColor }} />
          <div style={{ height: "8px", width: "48px", backgroundColor: darkColor }} />
        </div>

        {/* Bill To / Invoice Info */}
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-bold" style={{ color: brandColor }}>
              Invoice to:
            </p>
            <p className="mt-1 text-base font-bold" style={{ color: brandColor }}>
              {data.clientName || "Client Name"}
            </p>
            <p className="whitespace-pre-line text-sm" style={{ color: "#737373" }}>
              {data.clientAddress}
            </p>
            {data.clientTaxId && (
              <p className="text-sm" style={{ color: "#737373" }}>
                Tax ID: {data.clientTaxId}
              </p>
            )}
          </div>
          <div className="text-right text-sm">
            <div className="flex items-center justify-end gap-2">
              <span style={{ color: brandColor }} className="font-semibold">
                Invoice#
              </span>
              <span style={{ color: "#737373" }}>{data.invoiceNumber}</span>
              {stamp && (
                <span
                  className="rounded border px-2 py-0.5 text-xs font-bold tracking-wider"
                  style={{ color: stamp.color, borderColor: stamp.color }}
                >
                  {stamp.label}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center justify-end gap-2">
              <span style={{ color: brandColor }} className="font-semibold">
                Date
              </span>
              <span style={{ color: "#737373" }}>{formatDate(data.issueDate)}</span>
            </div>
            <div className="mt-1 flex items-center justify-end gap-2">
              <span style={{ color: brandColor }} className="font-semibold">
                Due
              </span>
              <span style={{ color: "#737373" }}>{formatDate(data.dueDate)}</span>
            </div>
            {data.poNumber && (
              <div className="mt-1 flex items-center justify-end gap-2">
                <span style={{ color: brandColor }} className="font-semibold">
                  PO #
                </span>
                <span style={{ color: "#737373" }}>{data.poNumber}</span>
              </div>
            )}
            {data.fromTaxId && (
              <div className="mt-1 flex items-center justify-end gap-2">
                <span style={{ color: brandColor }} className="font-semibold">
                  Tax ID
                </span>
                <span style={{ color: "#737373" }}>{data.fromTaxId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Items table */}
        <div className="mt-6 flex flex-1 flex-col overflow-x-auto overflow-y-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: darkColor }}>
                <th className="px-3 py-2 text-left font-semibold" style={{ color: "#ffffff" }}>
                  SL.
                </th>
                <th className="px-3 py-2 text-left font-semibold" style={{ color: "#ffffff" }}>
                  Item Description
                </th>
                <th className="px-3 py-2 text-right font-semibold" style={{ color: "#ffffff" }}>
                  Price
                </th>
                <th className="px-3 py-2 text-right font-semibold" style={{ color: "#ffffff" }}>
                  Qty.
                </th>
                <th className="px-3 py-2 text-right font-semibold" style={{ color: "#ffffff" }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => {
                const quantity = toNumber(item.quantity)
                const unitPrice = toNumber(item.unitPrice)
                const taxRate = toNumber(item.taxRate)
                const total = quantity * unitPrice * (1 + taxRate / 100)

                return (
                  <tr key={item.id} style={{ backgroundColor: index % 2 === 1 ? "#f5f5f5" : "#ffffff" }}>
                    <td className="px-3 py-2" style={{ color: "#171717" }}>
                      {index + 1}
                    </td>
                    <td className="px-3 py-2" style={{ color: "#171717" }}>
                      {item.description || "—"}
                    </td>
                    <td className="px-3 py-2 text-right" style={{ color: "#171717" }}>
                      {formatCurrency(unitPrice, data.currency)}
                    </td>
                    <td className="px-3 py-2 text-right" style={{ color: "#171717" }}>
                      {quantity}
                    </td>
                    <td className="px-3 py-2 text-right font-medium" style={{ color: "#171717" }}>
                      {formatCurrency(total, data.currency)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {/* Filler stripes: continue the row zebra pattern down through the
              blank space until the footer, instead of leaving it plain white. */}
          <div
            aria-hidden
            style={{
              flex: 1,
              minHeight: 0,
              backgroundImage: `repeating-linear-gradient(to bottom, ${
                data.items.length % 2 === 1 ? "#f5f5f5" : "#ffffff"
              } 0px, ${data.items.length % 2 === 1 ? "#f5f5f5" : "#ffffff"} 36px, ${
                data.items.length % 2 === 1 ? "#ffffff" : "#f5f5f5"
              } 36px, ${data.items.length % 2 === 1 ? "#ffffff" : "#f5f5f5"} 72px)`,
            }}
          />
        </div>

        {/* Footer: notes/terms/bank on the left, totals on the right */}
        <div className="grid grid-cols-2 gap-8 pt-10">
          <div className="space-y-4 text-sm">
            <p className="font-bold" style={{ color: brandColor }}>
              Thank you for your business
            </p>
            {data.terms && (
              <div>
                <p className="font-semibold" style={{ color: brandColor }}>
                  Terms & Conditions
                </p>
                <p className="whitespace-pre-line" style={{ color: "#737373" }}>
                  {data.terms}
                </p>
              </div>
            )}
            {data.notes && (
              <div>
                <p className="font-semibold" style={{ color: brandColor }}>
                  Notes
                </p>
                <p className="whitespace-pre-line" style={{ color: "#737373" }}>
                  {data.notes}
                </p>
              </div>
            )}
            {data.bankDetails && (
              <div>
                <p className="font-semibold" style={{ color: brandColor }}>
                  Payment Info
                </p>
                <p className="whitespace-pre-line" style={{ color: "#737373" }}>
                  {data.bankDetails}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "#737373" }}>Sub Total:</span>
              <span style={{ color: "#171717" }}>{formatCurrency(totals.subtotal, data.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#737373" }}>Tax:</span>
              <span style={{ color: "#171717" }}>{formatCurrency(totals.taxAmount, data.currency)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between">
                <span style={{ color: "#737373" }}>Discount:</span>
                <span style={{ color: "#171717" }}>-{formatCurrency(totals.discountAmount, data.currency)}</span>
              </div>
            )}
            <div
              className="flex justify-between px-3 py-2 text-base font-bold"
              style={{ backgroundColor: accentColor, color: darkColor }}
            >
              <span>Total:</span>
              <span>{formatCurrency(totals.totalAmount, data.currency)}</span>
            </div>
            {amountPaid > 0 && (
              <>
                <div className="flex justify-between">
                  <span style={{ color: "#737373" }}>Amount Paid:</span>
                  <span style={{ color: "#16a34a" }}>-{formatCurrency(amountPaid, data.currency)}</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span style={{ color: brandColor }}>Balance Due:</span>
                  <span style={{ color: balanceDue > 0 ? "#dc2626" : "#16a34a" }}>
                    {formatCurrency(balanceDue, data.currency)}
                  </span>
                </div>
              </>
            )}

            {data.signatureUrl && (
              <div className="mt-8 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.signatureUrl}
                  alt="Authorized signature"
                  crossOrigin="anonymous"
                  style={{ height: "56px", width: "auto", objectFit: "contain", margin: "0 auto" }}
                />
                <p className="mt-1 border-t pt-1 text-xs" style={{ color: "#737373", borderColor: "#e5e5e5" }}>
                  Authorised Sign
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer contact bar */}
        <div
          className="mt-8 flex items-center justify-center py-3 text-xs"
          style={{ borderTop: `2px solid ${accentColor}` }}
        >
          <span style={{ color: "#737373" }} className="font-medium">
            {footerContact || " "}
          </span>
        </div>
      </div>
    </div>
  )
}
