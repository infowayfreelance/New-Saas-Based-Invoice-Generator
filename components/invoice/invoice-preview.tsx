"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  type InvoiceFormData,
  type InvoiceItemFormData,
  calculateInvoiceTotals,
  formatCurrency,
  formatDate,
  toNumber,
  getBillingTypeSummary,
  getDefaultVisibility,
} from "@/lib/utils/invoice"
import { PDF_RENDER_WIDTH, PDF_RENDER_HEIGHT } from "@/lib/utils/pdf"
import { getFontStack } from "@/lib/utils/fonts"

interface InvoicePreviewProps {
  data: InvoiceFormData
  className?: string
}

// ─── Color helpers ──────────────────────────────────────────────────────────

function getReadableDarkColor(hex?: string): string {
  if (!hex) return "#171717"
  const match = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!match) return "#171717"
  const v = match[1]
  const r = parseInt(v.slice(0, 2), 16)
  const g = parseInt(v.slice(2, 4), 16)
  const b = parseInt(v.slice(4, 6), 16)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance > 0.55 ? "#171717" : hex
}

function getContrastTextColor(hex?: string): string {
  if (!hex) return "#171717"
  const match = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!match) return "#171717"
  const v = match[1]
  const r = parseInt(v.slice(0, 2), 16)
  const g = parseInt(v.slice(2, 4), 16)
  const b = parseInt(v.slice(4, 6), 16)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance > 0.5 ? "#171717" : "#ffffff"
}

/** Lighten a hex color by mixing it with white. ratio = 0..1 */
function lighten(hex: string, ratio: number): string {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!match) return hex
  const v = match[1]
  const r = parseInt(v.slice(0, 2), 16)
  const g = parseInt(v.slice(2, 4), 16)
  const b = parseInt(v.slice(4, 6), 16)
  const lr = Math.round(r + (255 - r) * ratio)
  const lg = Math.round(g + (255 - g) * ratio)
  const lb = Math.round(b + (255 - b) * ratio)
  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`
}

function getStatusStamp(status?: string): { label: string; color: string } | null {
  const normalized = (status || "").toLowerCase()
  if (normalized === "paid") return { label: "PAID", color: "#16a34a" }
  if (normalized === "overdue") return { label: "OVERDUE", color: "#dc2626" }
  if (normalized === "draft") return { label: "DRAFT", color: "#737373" }
  return null
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

function vis(data: InvoiceFormData): Required<ReturnType<typeof getDefaultVisibility>> {
  const dv = getDefaultVisibility()
  return { ...dv, ...(data.visibility || {}) } as Required<ReturnType<typeof getDefaultVisibility>>
}

function ItemRow({
  item,
  currency,
  accentColor,
  oddBg,
  style,
}: {
  item: InvoiceItemFormData
  currency: string
  accentColor: string
  oddBg: string
  style?: React.CSSProperties
}) {
  const qty = toNumber(item.quantity)
  const unitPrice = toNumber(item.unitPrice)
  const taxRate = toNumber(item.taxRate)
  const lineTotal = qty * unitPrice * (1 + taxRate / 100)
  const summary = getBillingTypeSummary(item, currency)
  return (
    <tr style={style}>
      <td className="py-2.5 text-left" style={{ color: "#171717" }}>
        <span className="font-medium">{item.description || "—"}</span>
        {summary && (
          <span className="block text-xs mt-0.5" style={{ color: "#9ca3af" }}>
            {summary}
          </span>
        )}
        {item.detailedDescription && (
          <span className="block text-xs mt-0.5 whitespace-pre-line" style={{ color: "#9ca3af" }}>
            {item.detailedDescription}
          </span>
        )}
      </td>
      <td className="py-2.5 text-right text-sm" style={{ color: "#525252", whiteSpace: "nowrap" }}>
        {item.billingType === "fixed" || item.billingType === "milestone"
          ? "—"
          : formatCurrency(unitPrice, currency)}
        {taxRate > 0 && (
          <span className="block text-xs" style={{ color: "#9ca3af" }}>
            +{taxRate}% tax
          </span>
        )}
      </td>
      <td className="py-2.5 text-right font-semibold" style={{ color: "#171717" }}>
        {formatCurrency(lineTotal, currency)}
      </td>
    </tr>
  )
}

function TotalsBlock({
  data,
  accentColor,
  currency,
  compact = false,
}: {
  data: InvoiceFormData
  accentColor: string
  currency: string
  compact?: boolean
}) {
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)
  const amountPaid = toNumber(data.amountPaid)
  const balanceDue = Math.max(totals.totalAmount - amountPaid, 0)
  const taxLabel = data.taxName ? data.taxName : "Tax"
  const fs = compact ? "text-xs" : "text-sm"

  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      <div className={`flex justify-between ${fs}`}>
        <span style={{ color: "#737373" }}>Subtotal</span>
        <span style={{ color: "#171717" }}>{formatCurrency(totals.subtotal, currency)}</span>
      </div>
      {totals.taxAmount > 0 && (
        <div className={`flex justify-between ${fs}`}>
          <span style={{ color: "#737373" }}>{taxLabel}</span>
          <span style={{ color: "#171717" }}>{formatCurrency(totals.taxAmount, currency)}</span>
        </div>
      )}
      {totals.discountAmount > 0 && (
        <div className={`flex justify-between ${fs}`}>
          <span style={{ color: "#737373" }}>Discount</span>
          <span style={{ color: "#171717" }}>−{formatCurrency(totals.discountAmount, currency)}</span>
        </div>
      )}
      <div
        className={`flex justify-between ${compact ? "py-1.5 px-2" : "py-2.5 px-3"} rounded font-bold ${compact ? "text-sm" : "text-base"}`}
        style={{ backgroundColor: accentColor, color: getContrastTextColor(accentColor) }}
      >
        <span>Total</span>
        <span>{formatCurrency(totals.totalAmount, currency)}</span>
      </div>
      {amountPaid > 0 && (
        <>
          <div className={`flex justify-between ${fs}`}>
            <span style={{ color: "#737373" }}>Amount Paid</span>
            <span style={{ color: "#16a34a" }}>−{formatCurrency(amountPaid, currency)}</span>
          </div>
          <div className={`flex justify-between ${fs} font-bold`}>
            <span style={{ color: "#171717" }}>Balance Due</span>
            <span style={{ color: balanceDue > 0 ? "#dc2626" : "#16a34a" }}>
              {formatCurrency(balanceDue, currency)}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

function Watermark({ text, color = "#171717" }: { text: string; color?: string }) {
  return (
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
          color,
          opacity: 0.06,
          transform: "rotate(-30deg)",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  )
}

// ─── Template 1: Classic ─────────────────────────────────────────────────────

function ClassicInvoiceBody({ data }: { data: InvoiceFormData }) {
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)
  const accentColor = data.accentColor || "#171717"
  const amountPaid = toNumber(data.amountPaid)
  const balanceDue = Math.max(totals.totalAmount - amountPaid, 0)
  const stamp = getStatusStamp(data.status)
  const v = vis(data)
  const taxLabel = data.taxName || "Tax"
  const lp = data.logoPosition || "left"
  const il = data.infoLayout || "side-by-side"
  const ts = data.tableStyle || "clean"

  return (
    <>
      {data.watermarkText && <Watermark text={data.watermarkText} />}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        {lp !== "left" && v.logo && data.logoUrl && (
          <div className={`mb-3 flex ${lp === "center" ? "justify-center" : "justify-end"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.logoUrl} alt="Logo" crossOrigin="anonymous"
              style={{ height: "48px", width: "auto", objectFit: "contain" }} />
          </div>
        )}
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              {lp === "left" && v.logo && data.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.logoUrl} alt="Logo" crossOrigin="anonymous"
                  style={{ height: "48px", width: "auto", objectFit: "contain" }} />
              )}
              <div>
                <div className="text-3xl font-bold" style={{ color: accentColor }}>INVOICE</div>
                {v.invoiceStatus && stamp && (
                  <span className="ml-2 rounded border px-2 py-0.5 text-xs font-bold tracking-wider"
                    style={{ color: stamp.color, borderColor: stamp.color }}>
                    {stamp.label}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm" style={{ color: "#737373" }}>#{data.invoiceNumber}</p>
            {data.poNumber && <p className="text-sm" style={{ color: "#737373" }}>PO #: {data.poNumber}</p>}
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-base" style={{ color: "#171717" }}>{data.fromName || "Your Business"}</p>
            <p style={{ color: "#737373" }}>{data.fromEmail}</p>
            {v.fromPhone && data.fromPhone && <p style={{ color: "#737373" }}>{data.fromPhone}</p>}
            {v.fromWebsite && data.fromWebsite && <p style={{ color: "#737373" }}>{data.fromWebsite}</p>}
            <p className="whitespace-pre-line" style={{ color: "#737373" }}>{data.fromAddress}</p>
            {v.taxNumbers && data.fromTaxId && <p style={{ color: "#737373" }}>Tax ID: {data.fromTaxId}</p>}
          </div>
        </div>

        <Separator className="my-5" style={{ backgroundColor: "#e5e5e5" }} />

        {/* Bill To & Invoice Info */}
        <div className={il === "stacked" ? "space-y-4" : "grid gap-6 sm:grid-cols-2"}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>Bill To</p>
            <p className="mt-1.5 text-base font-semibold" style={{ color: "#171717" }}>
              {data.clientName || "Client Name"}
            </p>
            {data.clientCompanyName && (
              <p className="text-sm" style={{ color: "#737373" }}>{data.clientCompanyName}</p>
            )}
            <p className="text-sm" style={{ color: "#737373" }}>{data.clientEmail}</p>
            {v.clientPhone && data.clientPhone && <p className="text-sm" style={{ color: "#737373" }}>{data.clientPhone}</p>}
            <p className="whitespace-pre-line text-sm" style={{ color: "#737373" }}>{data.clientAddress}</p>
            {v.taxNumbers && data.clientTaxId && <p className="text-sm" style={{ color: "#737373" }}>Tax ID: {data.clientTaxId}</p>}
            {data.clientRef && <p className="text-sm" style={{ color: "#737373" }}>Ref: {data.clientRef}</p>}
          </div>
          <div className={`space-y-2 text-sm ${il === "stacked" ? "" : "text-right"}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>Issue Date</p>
              <p style={{ color: "#171717" }}>{formatDate(data.issueDate)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>Due Date</p>
              <p style={{ color: "#171717" }}>{formatDate(data.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Project section */}
        {v.projectDetails && (data.projectName || data.projectDescription) && (
          <>
            <Separator className="my-5" style={{ backgroundColor: "#e5e5e5" }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#737373" }}>Project</p>
              {data.projectName && <p className="font-medium" style={{ color: "#171717" }}>{data.projectName}{data.projectRef ? ` — ${data.projectRef}` : ""}</p>}
              {data.projectDescription && <p className="text-sm mt-0.5" style={{ color: "#737373" }}>{data.projectDescription}</p>}
            </div>
          </>
        )}

        <Separator className="my-5" style={{ backgroundColor: "#e5e5e5" }} />

        {/* Items Table */}
        <table className="w-full text-sm"
          style={ts === "bordered" ? { borderCollapse: "collapse" } : undefined}>
          <thead>
            <tr style={
              ts === "soft-card"
                ? { backgroundColor: lighten(accentColor, 0.9) }
                : { borderBottomWidth: "2px", borderBottomStyle: "solid", borderBottomColor: accentColor }
            }>
              <th className="pb-2 pt-2 text-left font-semibold px-2" style={{ color: "#171717",
                ...(ts === "bordered" ? { border: `1px solid ${accentColor}` } : {}) }}>Description</th>
              <th className="pb-2 pt-2 text-right font-semibold px-2" style={{ color: "#171717",
                ...(ts === "bordered" ? { border: `1px solid ${accentColor}` } : {}) }}>Rate</th>
              <th className="pb-2 pt-2 text-right font-semibold px-2" style={{ color: "#171717",
                ...(ts === "bordered" ? { border: `1px solid ${accentColor}` } : {}) }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => {
              const qty = toNumber(item.quantity)
              const unitPrice = toNumber(item.unitPrice)
              const taxRate = toNumber(item.taxRate)
              const lineTotal = qty * unitPrice * (1 + taxRate / 100)
              const summary = getBillingTypeSummary(item, data.currency)
              const rowStyle: React.CSSProperties = ts === "soft-card"
                ? { backgroundColor: idx % 2 === 1 ? "#f9fafb" : "#ffffff" }
                : ts === "bordered"
                ? { borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "#d1d5db" }
                : { borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "#f5f5f5" }
              return (
                <tr key={item.id} style={rowStyle}>
                  <td className="py-2.5 px-2" style={{ color: "#171717",
                    ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                    <span className="font-medium">{item.description || "—"}</span>
                    {summary && <span className="block text-xs mt-0.5" style={{ color: "#9ca3af" }}>{summary}</span>}
                    {item.detailedDescription && <span className="block text-xs mt-0.5 whitespace-pre-line" style={{ color: "#9ca3af" }}>{item.detailedDescription}</span>}
                  </td>
                  <td className="py-2.5 px-2 text-right" style={{ color: "#525252",
                    ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                    {(item.billingType === "fixed" || item.billingType === "milestone") ? "—" : formatCurrency(unitPrice, data.currency)}
                    {taxRate > 0 && <span className="block text-xs" style={{ color: "#9ca3af" }}>+{taxRate}%</span>}
                  </td>
                  <td className="py-2.5 px-2 text-right font-semibold" style={{ color: "#171717",
                    ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                    {formatCurrency(lineTotal, data.currency)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <Separator className="my-5" style={{ backgroundColor: "#e5e5e5" }} />

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: "#737373" }}>Subtotal</span>
              <span style={{ color: "#171717" }}>{formatCurrency(totals.subtotal, data.currency)}</span>
            </div>
            {totals.taxAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "#737373" }}>{taxLabel}</span>
                <span style={{ color: "#171717" }}>{formatCurrency(totals.taxAmount, data.currency)}</span>
              </div>
            )}
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "#737373" }}>Discount</span>
                <span style={{ color: "#171717" }}>−{formatCurrency(totals.discountAmount, data.currency)}</span>
              </div>
            )}
            <Separator style={{ backgroundColor: "#e5e5e5" }} />
            <div className="flex justify-between py-1 text-xl font-bold">
              <span style={{ color: "#171717" }}>Total</span>
              <span style={{ color: accentColor }}>{formatCurrency(totals.totalAmount, data.currency)}</span>
            </div>
            {amountPaid > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#737373" }}>Amount Paid</span>
                  <span style={{ color: "#16a34a" }}>−{formatCurrency(amountPaid, data.currency)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span style={{ color: "#171717" }}>Balance Due</span>
                  <span style={{ color: balanceDue > 0 ? "#dc2626" : "#16a34a" }}>
                    {formatCurrency(balanceDue, data.currency)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment & Notes */}
        {((v.paymentDetails && (data.bankDetails || data.paymentCustomNote)) || (v.notes && data.notes) || data.terms) && (
          <>
            <Separator className="my-5" style={{ backgroundColor: "#e5e5e5" }} />
            <div className="grid gap-6 sm:grid-cols-2">
              {v.paymentDetails && (data.bankDetails || data.paymentCustomNote) && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>Payment Details</p>
                  <p className="mt-1.5 whitespace-pre-line text-sm" style={{ color: "#171717" }}>
                    {data.paymentCustomNote || data.bankDetails}
                  </p>
                </div>
              )}
              {((v.notes && data.notes) || data.terms) && (
                <div>
                  {v.notes && data.notes && (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>Notes</p>
                      <p className="mt-1.5 whitespace-pre-line text-sm" style={{ color: "#171717" }}>{data.notes}</p>
                    </>
                  )}
                  {data.terms && (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-wider mt-3" style={{ color: "#737373" }}>Terms</p>
                      <p className="mt-1 whitespace-pre-line text-sm" style={{ color: "#171717" }}>{data.terms}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Signature */}
        {data.signatureUrl && (
          <>
            <Separator className="my-5" style={{ backgroundColor: "#e5e5e5" }} />
            <div className="flex justify-end">
              <div className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.signatureUrl} alt="Signature" crossOrigin="anonymous"
                  style={{ height: "56px", width: "auto", objectFit: "contain" }} />
                <p className="mt-1 border-t pt-1 text-xs" style={{ color: "#737373", borderColor: "#e5e5e5" }}>
                  Authorised Signature
                </p>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        {v.footer && (data.fromEmail || data.fromWebsite) && (
          <div className="mt-8 text-center text-xs" style={{ borderTop: "1px solid #e5e5e5", paddingTop: "12px", color: "#9ca3af" }}>
            {[data.fromName, data.fromEmail, data.fromWebsite].filter(Boolean).join("  ·  ")}
          </div>
        )}
      </div>
    </>
  )
}

// ─── Template 2: Modern ──────────────────────────────────────────────────────

function ModernInvoiceBody({ data }: { data: InvoiceFormData }) {
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)
  const accentColor = data.accentColor || "#f5c518"
  const brandColor = data.primaryColor || "#171717"
  const darkColor = getReadableDarkColor(data.primaryColor)
  const amountPaid = toNumber(data.amountPaid)
  const balanceDue = Math.max(totals.totalAmount - amountPaid, 0)
  const stamp = getStatusStamp(data.status)
  const v = vis(data)
  const taxLabel = data.taxName || "Tax"
  const footerContact = [data.fromEmail, data.fromAddress?.split("\n")[0]].filter(Boolean).join("   |   ")
  const lp = data.logoPosition || "left"
  const ts = data.tableStyle || "clean"

  return (
    <div className="flex flex-col p-10" style={{ position: "relative", minHeight: `${PDF_RENDER_HEIGHT}px` }}>
      {data.watermarkText && <Watermark text={data.watermarkText} color={darkColor} />}
      <div className="flex flex-1 flex-col" style={{ position: "relative", zIndex: 1 }}>
        {/* Logo row */}
        <div className={`flex items-center gap-3 ${lp === "center" ? "justify-center" : lp === "right" ? "justify-end" : ""}`}>
          {v.logo && data.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.logoUrl} alt="Logo" crossOrigin="anonymous"
              style={{ height: "40px", width: "auto", objectFit: "contain" }} />
          )}
          <span className="text-lg font-bold" style={{ color: brandColor }}>
            {data.fromName || "Your Business Name"}
          </span>
        </div>

        {/* Banner bar */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div style={{ height: "10px", flex: 1, backgroundColor: accentColor }} />
          <div className="px-4 text-4xl font-bold tracking-wide"
            style={{ color: brandColor, backgroundColor: "#ffffff", lineHeight: 1.3 }}>
            INVOICE
          </div>
          <div style={{ height: "10px", width: "48px", backgroundColor: darkColor }} />
        </div>
        <div className="flex items-center justify-end">
          <div style={{ height: "8px", flex: 1, backgroundColor: accentColor }} />
          <div style={{ height: "8px", width: "48px", backgroundColor: darkColor }} />
        </div>

        {/* Bill To / Info */}
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-bold" style={{ color: brandColor }}>Invoice to:</p>
            <p className="mt-1 font-bold" style={{ color: brandColor }}>
              {data.clientName || "Client Name"}
            </p>
            {data.clientCompanyName && <p className="text-sm" style={{ color: "#737373" }}>{data.clientCompanyName}</p>}
            <p className="whitespace-pre-line text-sm" style={{ color: "#737373" }}>{data.clientAddress}</p>
            {v.clientPhone && data.clientPhone && <p className="text-sm" style={{ color: "#737373" }}>{data.clientPhone}</p>}
            {v.taxNumbers && data.clientTaxId && <p className="text-sm" style={{ color: "#737373" }}>Tax ID: {data.clientTaxId}</p>}
          </div>
          <div className="text-right text-sm">
            <div className="flex items-center justify-end gap-2">
              <span style={{ color: brandColor }} className="font-semibold">Invoice#</span>
              <span style={{ color: "#737373" }}>{data.invoiceNumber}</span>
              {v.invoiceStatus && stamp && (
                <span className="rounded border px-2 py-0.5 text-xs font-bold tracking-wider"
                  style={{ color: stamp.color, borderColor: stamp.color }}>
                  {stamp.label}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center justify-end gap-2">
              <span style={{ color: brandColor }} className="font-semibold">Date</span>
              <span style={{ color: "#737373" }}>{formatDate(data.issueDate)}</span>
            </div>
            <div className="mt-1 flex items-center justify-end gap-2">
              <span style={{ color: brandColor }} className="font-semibold">Due</span>
              <span style={{ color: "#737373" }}>{formatDate(data.dueDate)}</span>
            </div>
            {data.poNumber && (
              <div className="mt-1 flex items-center justify-end gap-2">
                <span style={{ color: brandColor }} className="font-semibold">PO #</span>
                <span style={{ color: "#737373" }}>{data.poNumber}</span>
              </div>
            )}
            {v.taxNumbers && data.fromTaxId && (
              <div className="mt-1 flex items-center justify-end gap-2">
                <span style={{ color: brandColor }} className="font-semibold">Tax ID</span>
                <span style={{ color: "#737373" }}>{data.fromTaxId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Project */}
        {v.projectDetails && data.projectName && (
          <div className="mt-4 rounded px-3 py-2 text-sm" style={{ backgroundColor: lighten(accentColor, 0.85) }}>
            <span className="font-semibold" style={{ color: brandColor }}>Project: </span>
            <span style={{ color: "#525252" }}>{data.projectName}{data.projectRef ? ` — ${data.projectRef}` : ""}</span>
            {data.projectDescription && <span style={{ color: "#737373" }}> · {data.projectDescription}</span>}
          </div>
        )}

        {/* Items table */}
        <div className="mt-5 flex flex-1 flex-col overflow-x-auto overflow-y-hidden">
          <table className="w-full text-sm"
            style={ts === "bordered" ? { borderCollapse: "collapse" } : undefined}>
            <thead>
              <tr style={ts === "bordered"
                ? { backgroundColor: darkColor, border: `1px solid ${accentColor}` }
                : { backgroundColor: darkColor }}>
                <th className="px-3 py-2 text-left font-semibold" style={{ color: "#ffffff",
                  ...(ts === "bordered" ? { border: "1px solid rgba(255,255,255,0.3)" } : {}) }}>SL.</th>
                <th className="px-3 py-2 text-left font-semibold" style={{ color: "#ffffff",
                  ...(ts === "bordered" ? { border: "1px solid rgba(255,255,255,0.3)" } : {}) }}>Description</th>
                <th className="px-3 py-2 text-right font-semibold" style={{ color: "#ffffff",
                  ...(ts === "bordered" ? { border: "1px solid rgba(255,255,255,0.3)" } : {}) }}>Rate</th>
                <th className="px-3 py-2 text-right font-semibold" style={{ color: "#ffffff",
                  ...(ts === "bordered" ? { border: "1px solid rgba(255,255,255,0.3)" } : {}) }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => {
                const qty = toNumber(item.quantity)
                const unitPrice = toNumber(item.unitPrice)
                const taxRate = toNumber(item.taxRate)
                const total = qty * unitPrice * (1 + taxRate / 100)
                const summary = getBillingTypeSummary(item, data.currency)
                const rowBg = ts === "soft-card"
                  ? (index % 2 === 1 ? lighten(accentColor, 0.9) : "#ffffff")
                  : (index % 2 === 1 ? "#f5f5f5" : "#ffffff")
                return (
                  <tr key={item.id} style={{ backgroundColor: rowBg,
                    ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                    <td className="px-3 py-2" style={{ color: "#171717",
                      ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>{index + 1}</td>
                    <td className="px-3 py-2" style={{ color: "#171717",
                      ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                      {item.description || "—"}
                      {summary && <span className="block text-xs" style={{ color: "#9ca3af" }}>{summary}</span>}
                    </td>
                    <td className="px-3 py-2 text-right" style={{ color: "#525252",
                      ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                      {(item.billingType === "fixed" || item.billingType === "milestone") ? "—" : formatCurrency(unitPrice, data.currency)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium" style={{ color: "#171717",
                      ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                      {formatCurrency(total, data.currency)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div aria-hidden
            style={{
              flex: 1, minHeight: 0,
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='4' height='72'><rect width='4' height='36' fill='${data.items.length % 2 === 1 ? "#f5f5f5" : "#ffffff"}'/><rect y='36' width='4' height='36' fill='${data.items.length % 2 === 1 ? "#ffffff" : "#f5f5f5"}'/></svg>`,
              )}")`,
              backgroundRepeat: "repeat", backgroundSize: "100% 72px",
            }}
          />
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 gap-8 pt-8">
          <div className="space-y-3 text-sm">
            <p className="font-bold" style={{ color: brandColor }}>Thank you for your business</p>
            {v.notes && data.notes && (
              <div>
                <p className="font-semibold" style={{ color: brandColor }}>Notes</p>
                <p className="whitespace-pre-line text-xs" style={{ color: "#737373" }}>{data.notes}</p>
              </div>
            )}
            {data.terms && (
              <div>
                <p className="font-semibold" style={{ color: brandColor }}>Terms</p>
                <p className="whitespace-pre-line text-xs" style={{ color: "#737373" }}>{data.terms}</p>
              </div>
            )}
            {v.paymentDetails && (data.bankDetails || data.paymentCustomNote) && (
              <div>
                <p className="font-semibold" style={{ color: brandColor }}>Payment Info</p>
                <p className="whitespace-pre-line text-xs" style={{ color: "#737373" }}>
                  {data.paymentCustomNote || data.bankDetails}
                </p>
              </div>
            )}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "#737373" }}>Sub Total:</span>
              <span style={{ color: "#171717" }}>{formatCurrency(totals.subtotal, data.currency)}</span>
            </div>
            {totals.taxAmount > 0 && (
              <div className="flex justify-between">
                <span style={{ color: "#737373" }}>{taxLabel}:</span>
                <span style={{ color: "#171717" }}>{formatCurrency(totals.taxAmount, data.currency)}</span>
              </div>
            )}
            {totals.discountAmount > 0 && (
              <div className="flex justify-between">
                <span style={{ color: "#737373" }}>Discount:</span>
                <span style={{ color: "#171717" }}>−{formatCurrency(totals.discountAmount, data.currency)}</span>
              </div>
            )}
            <div className="flex justify-between px-3 py-2 text-base font-bold"
              style={{ backgroundColor: accentColor, color: getContrastTextColor(accentColor) }}>
              <span>Total:</span>
              <span>{formatCurrency(totals.totalAmount, data.currency)}</span>
            </div>
            {amountPaid > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#737373" }}>Amount Paid:</span>
                  <span style={{ color: "#16a34a" }}>−{formatCurrency(amountPaid, data.currency)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span style={{ color: brandColor }}>Balance Due:</span>
                  <span style={{ color: balanceDue > 0 ? "#dc2626" : "#16a34a" }}>
                    {formatCurrency(balanceDue, data.currency)}
                  </span>
                </div>
              </>
            )}
            {data.signatureUrl && (
              <div className="mt-6 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.signatureUrl} alt="Signature" crossOrigin="anonymous"
                  style={{ height: "48px", width: "auto", objectFit: "contain", margin: "0 auto" }} />
                <p className="mt-1 border-t pt-1 text-xs" style={{ color: "#737373", borderColor: "#e5e5e5" }}>
                  Authorised Sign
                </p>
              </div>
            )}
          </div>
        </div>

        {v.footer && (
          <div className="mt-8 flex items-center justify-center py-2 text-xs"
            style={{ borderTop: `2px solid ${accentColor}` }}>
            <span style={{ color: "#737373" }} className="font-medium">
              {footerContact || " "}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Template 3: Minimal ─────────────────────────────────────────────────────

function MinimalInvoiceBody({ data }: { data: InvoiceFormData }) {
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)
  const accentColor = data.accentColor || "#171717"
  const amountPaid = toNumber(data.amountPaid)
  const balanceDue = Math.max(totals.totalAmount - amountPaid, 0)
  const stamp = getStatusStamp(data.status)
  const v = vis(data)
  const taxLabel = data.taxName || "Tax"
  const lp = data.logoPosition || "left"
  const il = data.infoLayout || "side-by-side"

  return (
    <div className="p-10" style={{ position: "relative" }}>
      {data.watermarkText && <Watermark text={data.watermarkText} />}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div className={`flex items-start ${lp === "center" ? "flex-col items-center gap-4" : "justify-between"}`}>
          <div className={lp === "center" ? "text-center" : ""}>
            {v.logo && data.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logoUrl} alt="Logo" crossOrigin="anonymous"
                style={{ height: "44px", width: "auto", objectFit: "contain", marginBottom: "8px",
                  ...(lp === "center" ? { margin: "0 auto 8px" } : lp === "right" ? { marginLeft: "auto" } : {}) }} />
            )}
            <p className="text-xl font-semibold" style={{ color: "#171717" }}>
              {data.fromName || "Your Business"}
            </p>
            {v.fromPhone && data.fromPhone && <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{data.fromPhone}</p>}
            {v.fromWebsite && data.fromWebsite && <p className="text-xs" style={{ color: "#9ca3af" }}>{data.fromWebsite}</p>}
            <p className="text-xs whitespace-pre-line" style={{ color: "#9ca3af" }}>{data.fromAddress}</p>
            {v.taxNumbers && data.fromTaxId && <p className="text-xs" style={{ color: "#9ca3af" }}>VAT/Tax: {data.fromTaxId}</p>}
          </div>
          <div className={lp === "center" ? "text-center" : "text-right"}>
            <p className="text-5xl font-light tracking-widest" style={{ color: "#e5e7eb" }}>INVOICE</p>
            <p className="text-sm font-medium mt-1" style={{ color: "#374151" }}>#{data.invoiceNumber}</p>
            {v.invoiceStatus && stamp && (
              <span className="text-xs font-semibold tracking-widest" style={{ color: stamp.color }}>
                {stamp.label}
              </span>
            )}
          </div>
        </div>

        {/* Thin rule */}
        <div className="mt-8 mb-8" style={{ borderBottom: "1px solid #e5e7eb" }} />

        {/* Bill to + dates */}
        <div className={il === "stacked" ? "space-y-6" : "grid grid-cols-2 gap-10"}>
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#9ca3af" }}>Billed to</p>
            <p className="font-semibold" style={{ color: "#111827" }}>{data.clientName || "Client Name"}</p>
            {data.clientCompanyName && <p className="text-sm" style={{ color: "#4b5563" }}>{data.clientCompanyName}</p>}
            <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>{data.clientEmail}</p>
            {v.clientPhone && data.clientPhone && <p className="text-sm" style={{ color: "#6b7280" }}>{data.clientPhone}</p>}
            <p className="text-sm whitespace-pre-line" style={{ color: "#6b7280" }}>{data.clientAddress}</p>
            {v.taxNumbers && data.clientTaxId && <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>Tax ID: {data.clientTaxId}</p>}
            {data.clientRef && <p className="text-xs" style={{ color: "#9ca3af" }}>Ref: {data.clientRef}</p>}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#9ca3af" }}>Invoice details</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "#9ca3af" }}>Date</span>
                <span style={{ color: "#374151" }}>{formatDate(data.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#9ca3af" }}>Due</span>
                <span style={{ color: "#374151" }}>{formatDate(data.dueDate)}</span>
              </div>
              {data.poNumber && (
                <div className="flex justify-between">
                  <span style={{ color: "#9ca3af" }}>PO #</span>
                  <span style={{ color: "#374151" }}>{data.poNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project */}
        {v.projectDetails && data.projectName && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#9ca3af" }}>Project</p>
            <p className="text-sm font-medium" style={{ color: "#374151" }}>
              {data.projectName}{data.projectRef ? ` · ${data.projectRef}` : ""}
            </p>
            {data.projectDescription && <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{data.projectDescription}</p>}
          </div>
        )}

        <div className="mt-8 mb-3" style={{ borderBottom: "1px solid #e5e7eb" }} />

        {/* Items — no table, just rows */}
        <div className="space-y-0">
          {data.items.map((item, idx) => {
            const qty = toNumber(item.quantity)
            const unitPrice = toNumber(item.unitPrice)
            const taxRate = toNumber(item.taxRate)
            const lineTotal = qty * unitPrice * (1 + taxRate / 100)
            const summary = getBillingTypeSummary(item, data.currency)
            return (
              <div key={item.id} className="flex items-start justify-between py-3"
                style={{ borderBottom: "1px solid #f3f4f6" }}>
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium" style={{ color: "#111827" }}>{item.description || "—"}</p>
                  {summary && <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{summary}</p>}
                  {item.detailedDescription && <p className="text-xs mt-0.5 whitespace-pre-line" style={{ color: "#9ca3af" }}>{item.detailedDescription}</p>}
                </div>
                <p className="text-sm font-semibold" style={{ color: "#111827", whiteSpace: "nowrap" }}>
                  {formatCurrency(lineTotal, data.currency)}
                </p>
              </div>
            )
          })}
        </div>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-56 space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "#9ca3af" }}>Subtotal</span>
              <span style={{ color: "#374151" }}>{formatCurrency(totals.subtotal, data.currency)}</span>
            </div>
            {totals.taxAmount > 0 && (
              <div className="flex justify-between">
                <span style={{ color: "#9ca3af" }}>{taxLabel}</span>
                <span style={{ color: "#374151" }}>{formatCurrency(totals.taxAmount, data.currency)}</span>
              </div>
            )}
            {totals.discountAmount > 0 && (
              <div className="flex justify-between">
                <span style={{ color: "#9ca3af" }}>Discount</span>
                <span style={{ color: "#374151" }}>−{formatCurrency(totals.discountAmount, data.currency)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 font-bold text-lg"
              style={{ borderTop: `2px solid ${accentColor}` }}>
              <span style={{ color: "#111827" }}>Total</span>
              <span style={{ color: accentColor }}>{formatCurrency(totals.totalAmount, data.currency)}</span>
            </div>
            {amountPaid > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#9ca3af" }}>Amount Paid</span>
                  <span style={{ color: "#16a34a" }}>−{formatCurrency(amountPaid, data.currency)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span style={{ color: "#111827" }}>Balance Due</span>
                  <span style={{ color: balanceDue > 0 ? "#dc2626" : "#16a34a" }}>
                    {formatCurrency(balanceDue, data.currency)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 space-y-4 text-xs" style={{ color: "#9ca3af" }}>
          {v.paymentDetails && (data.bankDetails || data.paymentCustomNote) && (
            <p className="whitespace-pre-line">{data.paymentCustomNote || data.bankDetails}</p>
          )}
          {v.notes && data.notes && <p className="whitespace-pre-line">{data.notes}</p>}
          {data.terms && <p className="whitespace-pre-line">{data.terms}</p>}
          {v.footer && (data.fromEmail || data.fromWebsite) && (
            <p className="pt-4" style={{ borderTop: "1px solid #f3f4f6" }}>
              {[data.fromName, data.fromEmail, data.fromWebsite].filter(Boolean).join("  ·  ")}
            </p>
          )}
        </div>

        {data.signatureUrl && (
          <div className="mt-8 flex justify-end">
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.signatureUrl} alt="Signature" crossOrigin="anonymous"
                style={{ height: "48px", width: "auto", objectFit: "contain" }} />
              <p className="mt-1 pt-1 text-xs" style={{ color: "#9ca3af", borderTop: "1px solid #e5e7eb" }}>
                Authorised Signature
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Template 4: Bold ────────────────────────────────────────────────────────

function BoldInvoiceBody({ data }: { data: InvoiceFormData }) {
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)
  const primaryColor = data.primaryColor || "#1e293b"
  const accentColor = data.accentColor || "#3b82f6"
  const headerTextColor = getContrastTextColor(primaryColor)
  const amountPaid = toNumber(data.amountPaid)
  const balanceDue = Math.max(totals.totalAmount - amountPaid, 0)
  const stamp = getStatusStamp(data.status)
  const v = vis(data)
  const taxLabel = data.taxName || "Tax"
  const lp = data.logoPosition || "left"
  const il = data.infoLayout || "side-by-side"
  const ts = data.tableStyle || "clean"

  return (
    <div style={{ position: "relative" }}>
      {data.watermarkText && <Watermark text={data.watermarkText} color={primaryColor} />}

      {/* Full-width header */}
      <div className="px-10 py-8" style={{ backgroundColor: primaryColor, position: "relative", zIndex: 1 }}>
        <div className={`flex items-start ${lp === "center" ? "flex-col items-center gap-4" : "justify-between"}`}>
          <div className={lp === "center" ? "text-center" : ""}>
            {v.logo && data.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logoUrl} alt="Logo" crossOrigin="anonymous"
                style={{ height: "48px", width: "auto", objectFit: "contain", marginBottom: "12px",
                  filter: headerTextColor === "#ffffff" ? "brightness(10)" : "none",
                  ...(lp === "center" ? { margin: "0 auto 12px" } : {}) }} />
            )}
            <p className="text-2xl font-bold" style={{ color: headerTextColor }}>
              {data.fromName || "Your Business"}
            </p>
            <p className="text-sm mt-1" style={{ color: headerTextColor, opacity: 0.7 }}>{data.fromEmail}</p>
            {v.fromPhone && data.fromPhone && <p className="text-sm" style={{ color: headerTextColor, opacity: 0.7 }}>{data.fromPhone}</p>}
            {v.fromWebsite && data.fromWebsite && <p className="text-sm" style={{ color: headerTextColor, opacity: 0.7 }}>{data.fromWebsite}</p>}
            <p className="text-sm whitespace-pre-line" style={{ color: headerTextColor, opacity: 0.7 }}>{data.fromAddress}</p>
            {v.taxNumbers && data.fromTaxId && <p className="text-sm" style={{ color: headerTextColor, opacity: 0.7 }}>Tax ID: {data.fromTaxId}</p>}
          </div>
          <div className="text-right">
            <p className="text-5xl font-black tracking-wide" style={{ color: accentColor }}>INVOICE</p>
            <p className="text-lg mt-1" style={{ color: headerTextColor }}>#{data.invoiceNumber}</p>
            {v.invoiceStatus && stamp && (
              <span className="mt-1 inline-block rounded px-3 py-1 text-sm font-bold tracking-wider"
                style={{ backgroundColor: stamp.color, color: "#ffffff" }}>
                {stamp.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Accent bar */}
      <div style={{ height: "6px", backgroundColor: accentColor }} />

      <div className="px-10 py-8" style={{ position: "relative", zIndex: 1 }}>
        {/* Bill to + Dates */}
        <div className={`${il === "stacked" ? "space-y-4" : "grid grid-cols-2 gap-8"} mb-8`}>
          <div className="rounded-lg p-4" style={{ backgroundColor: "#f8fafc" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Billed To</p>
            <p className="font-bold text-base" style={{ color: "#0f172a" }}>{data.clientName || "Client Name"}</p>
            {data.clientCompanyName && <p className="text-sm" style={{ color: "#64748b" }}>{data.clientCompanyName}</p>}
            <p className="text-sm mt-1" style={{ color: "#64748b" }}>{data.clientEmail}</p>
            {v.clientPhone && data.clientPhone && <p className="text-sm" style={{ color: "#64748b" }}>{data.clientPhone}</p>}
            <p className="text-sm whitespace-pre-line" style={{ color: "#64748b" }}>{data.clientAddress}</p>
            {v.taxNumbers && data.clientTaxId && <p className="text-sm" style={{ color: "#64748b" }}>Tax ID: {data.clientTaxId}</p>}
            {data.clientRef && <p className="text-sm" style={{ color: "#64748b" }}>Ref: {data.clientRef}</p>}
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: "#f8fafc" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Invoice Details</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "#64748b" }}>Invoice Date</span>
                <span className="font-medium" style={{ color: "#0f172a" }}>{formatDate(data.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#64748b" }}>Due Date</span>
                <span className="font-medium" style={{ color: "#0f172a" }}>{formatDate(data.dueDate)}</span>
              </div>
              {data.poNumber && (
                <div className="flex justify-between">
                  <span style={{ color: "#64748b" }}>PO Number</span>
                  <span className="font-medium" style={{ color: "#0f172a" }}>{data.poNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project */}
        {v.projectDetails && data.projectName && (
          <div className="mb-6 rounded-lg p-3"
            style={{ backgroundColor: lighten(accentColor, 0.9), borderLeft: `4px solid ${accentColor}` }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>Project</p>
            <p className="font-medium mt-0.5" style={{ color: "#0f172a" }}>
              {data.projectName}{data.projectRef ? ` — ${data.projectRef}` : ""}
            </p>
            {data.projectDescription && <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>{data.projectDescription}</p>}
          </div>
        )}

        {/* Items Table */}
        <table className="w-full text-sm"
          style={ts === "bordered" ? { borderCollapse: "collapse" } : undefined}>
          <thead>
            <tr style={ts === "bordered" ? { border: `1px solid ${accentColor}` } : undefined}>
              <th className="text-left py-2.5 px-3 font-bold text-xs uppercase tracking-wider" colSpan={1}
                style={{ backgroundColor: lighten(primaryColor, 0.9), color: primaryColor,
                  ...(ts === "bordered" ? { border: `1px solid ${accentColor}` } : {}) }}>
                Description
              </th>
              <th className="text-right py-2.5 px-3 font-bold text-xs uppercase tracking-wider"
                style={{ backgroundColor: lighten(primaryColor, 0.9), color: primaryColor,
                  ...(ts === "bordered" ? { border: `1px solid ${accentColor}` } : {}) }}>
                Rate
              </th>
              <th className="text-right py-2.5 px-3 font-bold text-xs uppercase tracking-wider"
                style={{ backgroundColor: lighten(primaryColor, 0.9), color: primaryColor,
                  ...(ts === "bordered" ? { border: `1px solid ${accentColor}` } : {}) }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => {
              const qty = toNumber(item.quantity)
              const unitPrice = toNumber(item.unitPrice)
              const taxRate = toNumber(item.taxRate)
              const lineTotal = qty * unitPrice * (1 + taxRate / 100)
              const summary = getBillingTypeSummary(item, data.currency)
              const rowStyle: React.CSSProperties = ts === "soft-card"
                ? { backgroundColor: idx % 2 === 1 ? lighten(accentColor, 0.95) : "#ffffff" }
                : ts === "bordered"
                ? { border: "1px solid #d1d5db" }
                : { borderBottom: "1px solid #f1f5f9" }
              return (
                <tr key={item.id} style={rowStyle}>
                  <td className="py-3 px-3" style={{ color: "#0f172a",
                    ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                    <span className="font-medium">{item.description || "—"}</span>
                    {summary && <span className="block text-xs mt-0.5" style={{ color: "#94a3b8" }}>{summary}</span>}
                    {item.detailedDescription && <span className="block text-xs mt-0.5 whitespace-pre-line" style={{ color: "#94a3b8" }}>{item.detailedDescription}</span>}
                  </td>
                  <td className="py-3 px-3 text-right" style={{ color: "#64748b",
                    ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                    {(item.billingType === "fixed" || item.billingType === "milestone") ? "—" : formatCurrency(unitPrice, data.currency)}
                    {taxRate > 0 && <span className="block text-xs" style={{ color: "#94a3b8" }}>+{taxRate}%</span>}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold" style={{ color: "#0f172a",
                    ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                    {formatCurrency(lineTotal, data.currency)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Totals — full width accent box */}
        <div className="mt-6 flex justify-end">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between py-1">
              <span style={{ color: "#64748b" }}>Subtotal</span>
              <span style={{ color: "#0f172a" }}>{formatCurrency(totals.subtotal, data.currency)}</span>
            </div>
            {totals.taxAmount > 0 && (
              <div className="flex justify-between py-1">
                <span style={{ color: "#64748b" }}>{taxLabel}</span>
                <span style={{ color: "#0f172a" }}>{formatCurrency(totals.taxAmount, data.currency)}</span>
              </div>
            )}
            {totals.discountAmount > 0 && (
              <div className="flex justify-between py-1">
                <span style={{ color: "#64748b" }}>Discount</span>
                <span style={{ color: "#0f172a" }}>−{formatCurrency(totals.discountAmount, data.currency)}</span>
              </div>
            )}
            <div className="flex justify-between items-center px-4 py-3 rounded-lg"
              style={{ backgroundColor: accentColor, color: getContrastTextColor(accentColor) }}>
              <span className="font-bold text-base">TOTAL DUE</span>
              <span className="font-black text-2xl">{formatCurrency(totals.totalAmount, data.currency)}</span>
            </div>
            {amountPaid > 0 && (
              <>
                <div className="flex justify-between py-1">
                  <span style={{ color: "#64748b" }}>Amount Paid</span>
                  <span style={{ color: "#16a34a" }}>−{formatCurrency(amountPaid, data.currency)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold">
                  <span style={{ color: "#0f172a" }}>Balance Due</span>
                  <span style={{ color: balanceDue > 0 ? "#dc2626" : "#16a34a" }}>
                    {formatCurrency(balanceDue, data.currency)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom section */}
        {(v.paymentDetails && (data.bankDetails || data.paymentCustomNote) || (v.notes && data.notes) || data.terms) && (
          <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
            {v.paymentDetails && (data.bankDetails || data.paymentCustomNote) && (
              <div>
                <p className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: accentColor }}>Payment Details</p>
                <p className="whitespace-pre-line" style={{ color: "#64748b" }}>
                  {data.paymentCustomNote || data.bankDetails}
                </p>
              </div>
            )}
            {((v.notes && data.notes) || data.terms) && (
              <div>
                {v.notes && data.notes && (
                  <>
                    <p className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: accentColor }}>Notes</p>
                    <p className="whitespace-pre-line" style={{ color: "#64748b" }}>{data.notes}</p>
                  </>
                )}
                {data.terms && (
                  <p className="whitespace-pre-line mt-2" style={{ color: "#94a3b8" }}>{data.terms}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {v.footer && (
          <div className="mt-10 py-4 text-center text-xs"
            style={{ borderTop: `3px solid ${accentColor}`, color: "#94a3b8" }}>
            {[data.fromName, data.fromEmail, data.fromWebsite].filter(Boolean).join("  ·  ")}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Template 5: Creative ────────────────────────────────────────────────────

function CreativeInvoiceBody({ data }: { data: InvoiceFormData }) {
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)
  const primaryColor = data.primaryColor || "#0f172a"
  const accentColor = data.accentColor || "#e879f9"
  const sidebarTextColor = getContrastTextColor(primaryColor)
  const amountPaid = toNumber(data.amountPaid)
  const balanceDue = Math.max(totals.totalAmount - amountPaid, 0)
  const stamp = getStatusStamp(data.status)
  const v = vis(data)
  const taxLabel = data.taxName || "Tax"

  return (
    <div className="flex" style={{ position: "relative", minHeight: `${PDF_RENDER_HEIGHT}px` }}>
      {data.watermarkText && <Watermark text={data.watermarkText} color={primaryColor} />}

      {/* Left sidebar */}
      <div className="flex flex-col px-7 py-10 w-56 shrink-0"
        style={{ backgroundColor: primaryColor, position: "relative", zIndex: 1 }}>
        {v.logo && data.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.logoUrl} alt="Logo" crossOrigin="anonymous"
            style={{ height: "44px", width: "auto", objectFit: "contain", marginBottom: "16px",
              filter: sidebarTextColor === "#ffffff" ? "brightness(10)" : "none" }} />
        )}
        <p className="text-base font-bold leading-tight" style={{ color: sidebarTextColor }}>
          {data.fromName || "Your Business"}
        </p>
        <p className="text-xs mt-2 break-all" style={{ color: sidebarTextColor, opacity: 0.7 }}>{data.fromEmail}</p>
        {v.fromPhone && data.fromPhone && <p className="text-xs mt-1" style={{ color: sidebarTextColor, opacity: 0.7 }}>{data.fromPhone}</p>}
        {v.fromWebsite && data.fromWebsite && <p className="text-xs mt-1 break-all" style={{ color: sidebarTextColor, opacity: 0.7 }}>{data.fromWebsite}</p>}
        <p className="text-xs mt-2 whitespace-pre-line" style={{ color: sidebarTextColor, opacity: 0.7 }}>{data.fromAddress}</p>
        {v.taxNumbers && data.fromTaxId && <p className="text-xs mt-1" style={{ color: sidebarTextColor, opacity: 0.7 }}>Tax: {data.fromTaxId}</p>}

        {/* Accent divider */}
        <div className="my-6" style={{ height: "2px", backgroundColor: accentColor }} />

        {/* Dates */}
        <div className="space-y-3 text-xs">
          <div>
            <p style={{ color: accentColor }} className="font-semibold uppercase tracking-widest text-[10px]">Date</p>
            <p style={{ color: sidebarTextColor }}>{formatDate(data.issueDate)}</p>
          </div>
          <div>
            <p style={{ color: accentColor }} className="font-semibold uppercase tracking-widest text-[10px]">Due</p>
            <p style={{ color: sidebarTextColor }}>{formatDate(data.dueDate)}</p>
          </div>
          {data.poNumber && (
            <div>
              <p style={{ color: accentColor }} className="font-semibold uppercase tracking-widest text-[10px]">PO #</p>
              <p style={{ color: sidebarTextColor }}>{data.poNumber}</p>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom sidebar content */}
        {v.paymentDetails && (data.bankDetails || data.paymentCustomNote) && (
          <div className="mt-4">
            <p style={{ color: accentColor }} className="font-semibold uppercase tracking-widest text-[10px] mb-1">Payment</p>
            <p className="text-xs whitespace-pre-line" style={{ color: sidebarTextColor, opacity: 0.7 }}>
              {data.paymentCustomNote || data.bankDetails}
            </p>
          </div>
        )}
        {data.signatureUrl && (
          <div className="mt-6 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.signatureUrl} alt="Signature" crossOrigin="anonymous"
              style={{ height: "40px", width: "auto", objectFit: "contain", margin: "0 auto",
                filter: sidebarTextColor === "#ffffff" ? "brightness(10)" : "none" }} />
            <p className="text-[10px] mt-1" style={{ color: sidebarTextColor, opacity: 0.5 }}>Signed</p>
          </div>
        )}
      </div>

      {/* Right main area */}
      <div className="flex-1 px-8 py-10" style={{ position: "relative", zIndex: 1 }}>
        {/* Top: Invoice title + number */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-4xl font-black tracking-tight" style={{ color: "#0f172a" }}>INVOICE</div>
            <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>#{data.invoiceNumber}</p>
          </div>
          {v.invoiceStatus && stamp && (
            <span className="rounded-full px-4 py-1.5 text-xs font-bold tracking-widest"
              style={{ backgroundColor: stamp.color, color: "#ffffff" }}>
              {stamp.label}
            </span>
          )}
        </div>

        {/* Accent bar */}
        <div className="mb-6" style={{ height: "3px", backgroundColor: accentColor, width: "60px" }} />

        {/* Bill to */}
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#94a3b8" }}>Invoiced to</p>
          <p className="font-bold text-base" style={{ color: "#0f172a" }}>{data.clientName || "Client Name"}</p>
          {data.clientCompanyName && <p className="text-sm" style={{ color: "#64748b" }}>{data.clientCompanyName}</p>}
          <p className="text-sm" style={{ color: "#64748b" }}>{data.clientEmail}</p>
          {v.clientPhone && data.clientPhone && <p className="text-sm" style={{ color: "#64748b" }}>{data.clientPhone}</p>}
          <p className="text-sm whitespace-pre-line" style={{ color: "#64748b" }}>{data.clientAddress}</p>
          {v.taxNumbers && data.clientTaxId && <p className="text-xs" style={{ color: "#94a3b8" }}>Tax ID: {data.clientTaxId}</p>}
          {data.clientRef && <p className="text-xs" style={{ color: "#94a3b8" }}>Ref: {data.clientRef}</p>}
        </div>

        {/* Project */}
        {v.projectDetails && data.projectName && (
          <div className="mb-5 rounded-lg p-3 text-sm"
            style={{ backgroundColor: lighten(accentColor, 0.9) }}>
            <p className="font-semibold" style={{ color: primaryColor }}>
              {data.projectName}{data.projectRef ? ` · ${data.projectRef}` : ""}
            </p>
            {data.projectDescription && <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{data.projectDescription}</p>}
          </div>
        )}

        {/* Items — compact rows */}
        <div className="space-y-0 mb-4">
          <div className="flex items-center py-1.5 text-xs font-semibold uppercase tracking-widest"
            style={{ borderBottom: `2px solid ${accentColor}`, color: "#94a3b8" }}>
            <span className="flex-1">Service / Description</span>
            <span>Amount</span>
          </div>
          {data.items.map((item) => {
            const qty = toNumber(item.quantity)
            const unitPrice = toNumber(item.unitPrice)
            const taxRate = toNumber(item.taxRate)
            const lineTotal = qty * unitPrice * (1 + taxRate / 100)
            const summary = getBillingTypeSummary(item, data.currency)
            return (
              <div key={item.id} className="flex items-start py-2.5"
                style={{ borderBottom: "1px solid #f1f5f9" }}>
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium" style={{ color: "#0f172a" }}>{item.description || "—"}</p>
                  {summary && <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{summary}</p>}
                  {item.detailedDescription && <p className="text-xs mt-0.5 whitespace-pre-line" style={{ color: "#94a3b8" }}>{item.detailedDescription}</p>}
                  {item.taxRate > 0 && <p className="text-xs" style={{ color: "#94a3b8" }}>+{item.taxRate}% tax</p>}
                </div>
                <p className="text-sm font-semibold" style={{ color: "#0f172a", whiteSpace: "nowrap" }}>
                  {formatCurrency(lineTotal, data.currency)}
                </p>
              </div>
            )
          })}
        </div>

        {/* Totals */}
        <div className="mt-4 space-y-1.5 text-sm">
          {totals.taxAmount > 0 && (
            <div className="flex justify-between">
              <span style={{ color: "#94a3b8" }}>{taxLabel}</span>
              <span style={{ color: "#475569" }}>{formatCurrency(totals.taxAmount, data.currency)}</span>
            </div>
          )}
          {totals.discountAmount > 0 && (
            <div className="flex justify-between">
              <span style={{ color: "#94a3b8" }}>Discount</span>
              <span style={{ color: "#475569" }}>−{formatCurrency(totals.discountAmount, data.currency)}</span>
            </div>
          )}
          <div className="flex justify-between items-center rounded-lg px-4 py-3 mt-2"
            style={{ backgroundColor: primaryColor }}>
            <span className="font-bold text-sm" style={{ color: accentColor }}>TOTAL</span>
            <span className="font-black text-xl" style={{ color: getContrastTextColor(primaryColor) }}>
              {formatCurrency(totals.totalAmount, data.currency)}
            </span>
          </div>
          {amountPaid > 0 && (
            <>
              <div className="flex justify-between">
                <span style={{ color: "#94a3b8" }}>Paid</span>
                <span style={{ color: "#16a34a" }}>−{formatCurrency(amountPaid, data.currency)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span style={{ color: "#0f172a" }}>Balance Due</span>
                <span style={{ color: balanceDue > 0 ? "#dc2626" : "#16a34a" }}>
                  {formatCurrency(balanceDue, data.currency)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        {((v.notes && data.notes) || data.terms) && (
          <div className="mt-6 text-xs" style={{ color: "#94a3b8" }}>
            {v.notes && data.notes && <p className="whitespace-pre-line mb-1">{data.notes}</p>}
            {data.terms && <p className="whitespace-pre-line">{data.terms}</p>}
          </div>
        )}

        {/* Footer */}
        {v.footer && (
          <div className="absolute bottom-6 left-8 right-8 text-xs text-center"
            style={{ color: "#cbd5e1" }}>
            {[data.fromName, data.fromEmail].filter(Boolean).join("  ·  ")}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Template 6: Compact ─────────────────────────────────────────────────────

function CompactInvoiceBody({ data }: { data: InvoiceFormData }) {
  const totals = calculateInvoiceTotals(data.items, data.discountAmount)
  const accentColor = data.accentColor || "#0ea5e9"
  const brandColor = data.primaryColor || "#0f172a"
  const amountPaid = toNumber(data.amountPaid)
  const balanceDue = Math.max(totals.totalAmount - amountPaid, 0)
  const stamp = getStatusStamp(data.status)
  const v = vis(data)
  const taxLabel = data.taxName || "Tax"
  const lp = data.logoPosition || "left"
  const ts = data.tableStyle || "clean"

  return (
    <div className="p-8" style={{ position: "relative" }}>
      {data.watermarkText && <Watermark text={data.watermarkText} />}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Compact header row */}
        <div className={`flex items-start pb-4 ${lp === "center" ? "justify-center" : "justify-between"}`}
          style={{ borderBottom: `3px solid ${accentColor}` }}>
          <div className={`flex items-center gap-3 ${lp === "right" ? "order-last" : ""}`}>
            {v.logo && data.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logoUrl} alt="Logo" crossOrigin="anonymous"
                style={{ height: "36px", width: "auto", objectFit: "contain" }} />
            )}
            <div>
              <p className="font-bold text-sm" style={{ color: brandColor }}>{data.fromName || "Your Business"}</p>
              <p className="text-xs" style={{ color: "#64748b" }}>{data.fromEmail}</p>
              {v.fromPhone && data.fromPhone && <p className="text-xs" style={{ color: "#64748b" }}>{data.fromPhone}</p>}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <div className="text-2xl font-black tracking-wide" style={{ color: accentColor }}>INVOICE</div>
              {v.invoiceStatus && stamp && (
                <span className="rounded px-2 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: stamp.color, color: "#ffffff" }}>
                  {stamp.label}
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: "#64748b" }}>#{data.invoiceNumber}</p>
          </div>
        </div>

        {/* Two-column info row */}
        <div className="grid grid-cols-3 gap-4 py-3 text-xs"
          style={{ borderBottom: "1px solid #e2e8f0" }}>
          <div>
            <p className="font-semibold uppercase tracking-wide text-[10px] mb-0.5" style={{ color: "#94a3b8" }}>Bill To</p>
            <p className="font-semibold" style={{ color: "#0f172a" }}>{data.clientName || "Client"}</p>
            {data.clientCompanyName && <p style={{ color: "#64748b" }}>{data.clientCompanyName}</p>}
            <p style={{ color: "#64748b" }}>{data.clientEmail}</p>
            {v.clientPhone && data.clientPhone && <p style={{ color: "#64748b" }}>{data.clientPhone}</p>}
            {v.taxNumbers && data.clientTaxId && <p style={{ color: "#94a3b8" }}>Tax: {data.clientTaxId}</p>}
            {data.clientRef && <p style={{ color: "#94a3b8" }}>Ref: {data.clientRef}</p>}
          </div>
          <div>
            <p className="font-semibold uppercase tracking-wide text-[10px] mb-0.5" style={{ color: "#94a3b8" }}>Dates</p>
            <p style={{ color: "#64748b" }}>Issued: <span style={{ color: "#0f172a" }}>{formatDate(data.issueDate)}</span></p>
            <p style={{ color: "#64748b" }}>Due: <span style={{ color: "#0f172a" }}>{formatDate(data.dueDate)}</span></p>
            {data.poNumber && <p style={{ color: "#64748b" }}>PO: <span style={{ color: "#0f172a" }}>{data.poNumber}</span></p>}
          </div>
          {v.projectDetails && data.projectName && (
            <div>
              <p className="font-semibold uppercase tracking-wide text-[10px] mb-0.5" style={{ color: "#94a3b8" }}>Project</p>
              <p style={{ color: "#0f172a" }}>{data.projectName}</p>
              {data.projectRef && <p style={{ color: "#64748b" }}>{data.projectRef}</p>}
              {data.projectDescription && <p style={{ color: "#94a3b8" }}>{data.projectDescription}</p>}
            </div>
          )}
        </div>

        {/* Items Table — compact */}
        <table className="w-full mt-3" style={{ fontSize: "12px",
          ...(ts === "bordered" ? { borderCollapse: "collapse" } : {}) }}>
          <thead>
            <tr style={ts === "bordered"
              ? { backgroundColor: lighten(accentColor, 0.9), border: `1px solid ${accentColor}` }
              : { backgroundColor: lighten(accentColor, 0.9) }}>
              <th className="py-1.5 px-2 text-left font-semibold" style={{ color: brandColor,
                ...(ts === "bordered" ? { border: `1px solid ${accentColor}` } : {}) }}>#</th>
              <th className="py-1.5 px-2 text-left font-semibold" style={{ color: brandColor,
                ...(ts === "bordered" ? { border: `1px solid ${accentColor}` } : {}) }}>Description</th>
              <th className="py-1.5 px-2 text-right font-semibold" style={{ color: brandColor,
                ...(ts === "bordered" ? { border: `1px solid ${accentColor}` } : {}) }}>Rate</th>
              <th className="py-1.5 px-2 text-right font-semibold" style={{ color: brandColor,
                ...(ts === "bordered" ? { border: `1px solid ${accentColor}` } : {}) }}>Amt</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => {
              const qty = toNumber(item.quantity)
              const unitPrice = toNumber(item.unitPrice)
              const taxRate = toNumber(item.taxRate)
              const lineTotal = qty * unitPrice * (1 + taxRate / 100)
              const summary = getBillingTypeSummary(item, data.currency)
              const rowBg = ts === "soft-card"
                ? (index % 2 === 0 ? "#ffffff" : "#f0f9ff")
                : (index % 2 === 0 ? "#ffffff" : "#f8fafc")
              return (
                <tr key={item.id}
                  style={{ backgroundColor: rowBg,
                    ...(ts === "bordered"
                      ? { border: "1px solid #d1d5db" }
                      : { borderBottom: "1px solid #f1f5f9" }) }}>
                  <td className="py-1.5 px-2" style={{ color: "#94a3b8",
                    ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>{index + 1}</td>
                  <td className="py-1.5 px-2" style={{ color: "#0f172a",
                    ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                    {item.description || "—"}
                    {summary && <span className="block text-[10px]" style={{ color: "#94a3b8" }}>{summary}</span>}
                  </td>
                  <td className="py-1.5 px-2 text-right" style={{ color: "#64748b",
                    ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                    {(item.billingType === "fixed" || item.billingType === "milestone") ? "—" : formatCurrency(unitPrice, data.currency)}
                    {taxRate > 0 && <span className="block text-[10px]" style={{ color: "#94a3b8" }}>+{taxRate}%</span>}
                  </td>
                  <td className="py-1.5 px-2 text-right font-semibold" style={{ color: "#0f172a",
                    ...(ts === "bordered" ? { border: "1px solid #d1d5db" } : {}) }}>
                    {formatCurrency(lineTotal, data.currency)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Totals row */}
        <div className="mt-4 flex justify-end">
          <div className="w-64">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span style={{ color: "#94a3b8" }}>Subtotal</span>
                <span style={{ color: "#475569" }}>{formatCurrency(totals.subtotal, data.currency)}</span>
              </div>
              {totals.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "#94a3b8" }}>{taxLabel}</span>
                  <span style={{ color: "#475569" }}>{formatCurrency(totals.taxAmount, data.currency)}</span>
                </div>
              )}
              {totals.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "#94a3b8" }}>Discount</span>
                  <span style={{ color: "#475569" }}>−{formatCurrency(totals.discountAmount, data.currency)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center px-3 py-2 rounded mt-2"
              style={{ backgroundColor: accentColor, color: getContrastTextColor(accentColor) }}>
              <span className="font-bold text-sm">Total</span>
              <span className="font-black text-lg">{formatCurrency(totals.totalAmount, data.currency)}</span>
            </div>
            {amountPaid > 0 && (
              <div className="space-y-1 text-xs mt-1.5">
                <div className="flex justify-between">
                  <span style={{ color: "#94a3b8" }}>Paid</span>
                  <span style={{ color: "#16a34a" }}>−{formatCurrency(amountPaid, data.currency)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span style={{ color: "#0f172a" }}>Balance Due</span>
                  <span style={{ color: balanceDue > 0 ? "#dc2626" : "#16a34a" }}>
                    {formatCurrency(balanceDue, data.currency)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-5 grid grid-cols-2 gap-6 text-xs" style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
          {v.paymentDetails && (data.bankDetails || data.paymentCustomNote) && (
            <div>
              <p className="font-semibold uppercase tracking-wide text-[10px] mb-1" style={{ color: accentColor }}>Payment</p>
              <p className="whitespace-pre-line" style={{ color: "#64748b" }}>
                {data.paymentCustomNote || data.bankDetails}
              </p>
            </div>
          )}
          {((v.notes && data.notes) || data.terms) && (
            <div>
              {v.notes && data.notes && <p className="whitespace-pre-line mb-1" style={{ color: "#64748b" }}>{data.notes}</p>}
              {data.terms && <p className="whitespace-pre-line" style={{ color: "#94a3b8" }}>{data.terms}</p>}
            </div>
          )}
        </div>

        {v.footer && (
          <div className="mt-5 text-center text-[10px]" style={{ color: "#cbd5e1" }}>
            {[data.fromName, data.fromEmail, data.fromWebsite].filter(Boolean).join("  ·  ")}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Layout dispatch ─────────────────────────────────────────────────────────

const TEMPLATE_BODIES: Record<string, React.ComponentType<{ data: InvoiceFormData }>> = {
  classic: ClassicInvoiceBody,
  banner: ModernInvoiceBody,
  modern: ModernInvoiceBody,
  minimal: MinimalInvoiceBody,
  bold: BoldInvoiceBody,
  creative: CreativeInvoiceBody,
  compact: CompactInvoiceBody,
}

// ─── Public component ────────────────────────────────────────────────────────

export function InvoicePreview({ data, className }: InvoicePreviewProps) {
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

  const TemplateBody = TEMPLATE_BODIES[data.layoutStyle || "classic"] || ClassicInvoiceBody
  const noInnerPadding = data.layoutStyle === "banner" || data.layoutStyle === "modern" || data.layoutStyle === "bold" || data.layoutStyle === "creative"

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
        <div
          id="invoice-preview"
          data-logo-position={data.logoPosition || "left"}
          data-info-layout={data.infoLayout || "side-by-side"}
          data-table-style={data.tableStyle || "clean"}
          className="invoice-print-root flex flex-col gap-6"
        >
          <style>{`
            #invoice-preview[data-logo-position="center"] img[alt="Logo"] { margin-left: auto !important; margin-right: auto !important; }
            #invoice-preview[data-logo-position="right"] img[alt="Logo"] { margin-left: auto !important; margin-right: 0 !important; }
            #invoice-preview[data-info-layout="stacked"] .sm\\:grid-cols-2 { grid-template-columns: 1fr !important; }
            #invoice-preview[data-info-layout="stacked"] .sm\\:grid-cols-3 { grid-template-columns: 1fr !important; }
            #invoice-preview[data-table-style="bordered"] table { border-collapse: collapse !important; border: 1px solid #d4d4d4 !important; }
            #invoice-preview[data-table-style="bordered"] th, #invoice-preview[data-table-style="bordered"] td { border: 1px solid #d4d4d4 !important; padding-left: 10px !important; padding-right: 10px !important; }
            #invoice-preview[data-table-style="soft-card"] table { border-collapse: separate !important; border-spacing: 0 8px !important; }
            #invoice-preview[data-table-style="soft-card"] tbody tr { background: #f8fafc !important; }
            #invoice-preview[data-table-style="soft-card"] tbody td:first-child { border-radius: 8px 0 0 8px; padding-left: 12px !important; }
            #invoice-preview[data-table-style="soft-card"] tbody td:last-child { border-radius: 0 8px 8px 0; padding-right: 12px !important; }
          `}</style>
          <Card
            className="pdf-safe-wrapper pdf-page"
            style={{
              backgroundColor: "#ffffff",
              color: "#171717",
              width: `${PDF_RENDER_WIDTH}px`,
              minWidth: `${PDF_RENDER_WIDTH}px`,
              maxWidth: `${PDF_RENDER_WIDTH}px`,
              minHeight: `${PDF_RENDER_HEIGHT}px`,
              position: "relative",
              overflow: "hidden",
              padding: noInnerPadding ? 0 : "40px",
              border: "1px solid #e5e5e5",
              boxShadow: "none",
              fontFamily: getFontStack(data.fontFamily),
            }}
          >
            <TemplateBody data={data} />
          </Card>

          {data.termsDetail && (data.visibility?.termsAndConditions !== false) && (
            <Card
              className="pdf-safe-wrapper pdf-page p-10"
              style={{
                backgroundColor: "#ffffff",
                color: "#171717",
                width: `${PDF_RENDER_WIDTH}px`,
                minWidth: `${PDF_RENDER_WIDTH}px`,
                maxWidth: `${PDF_RENDER_WIDTH}px`,
                minHeight: `${PDF_RENDER_HEIGHT}px`,
                border: "1px solid #e5e5e5",
                boxShadow: "none",
                fontFamily: getFontStack(data.fontFamily),
              }}
            >
              <p className="text-xl font-bold" style={{ color: "#171717" }}>Terms &amp; Conditions</p>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed" style={{ color: "#404040" }}>
                {data.termsDetail}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Named exports for use in the download API server action
export { ClassicInvoiceBody, ModernInvoiceBody }
