import { ImageResponse } from "next/og"
import { toNumber, formatCurrency, formatDate } from "@/lib/utils/invoice"
import { getPublicInvoiceSummary } from "@/lib/data/public-invoice"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Invoice"

export default async function OpengraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const summary = await getPublicInvoiceSummary(id).catch(() => null)

  if (!summary) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            fontSize: 48,
            color: "#171717",
          }}
        >
          Invoice not found
        </div>
      ),
      size,
    )
  }

  const total = formatCurrency(toNumber(summary.totalAmount), summary.currency)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: "#16a34a",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            M
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: "#171717" }}>Make Invo</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", fontSize: 32, color: "#737373" }}>{`Invoice ${summary.invoiceNumber}`}</div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, color: "#171717" }}>{total}</div>
          {summary.clientName && (
            <div style={{ display: "flex", fontSize: 32, color: "#737373" }}>{`Billed to ${summary.clientName}`}</div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#737373" }}>
          <div style={{ display: "flex" }}>{`From ${summary.businessName}`}</div>
          <div style={{ display: "flex" }}>{`Due ${formatDate(summary.dueDate)}`}</div>
        </div>
      </div>
    ),
    size,
  )
}
