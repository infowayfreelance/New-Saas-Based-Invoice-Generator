import type { Metadata } from "next"
import { EmbeddedInvoiceGenerator } from "@/components/marketing/embedded-invoice-generator"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://makeinvo.com"

export const metadata: Metadata = {
  title: "Free Invoice Generator - Create & Download PDF Invoices Instantly",
  description:
    "Use MakeInvo's free invoice generator to create a professional PDF invoice in under a minute. No signup, no watermark, no credit card required.",
  alternates: { canonical: `${siteUrl}/free-invoice` },
}

export default function FreeInvoicePage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <EmbeddedInvoiceGenerator showHeading useBackend />
      </div>
    </div>
  )
}
