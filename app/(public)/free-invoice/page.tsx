import type { Metadata } from "next"
import { EmbeddedInvoiceGenerator } from "@/components/marketing/embedded-invoice-generator"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://makeinvo.com"

export const metadata: Metadata = {
  title: "Free Invoice Generator - Create & Download PDF Invoices Instantly",
  description:
    "Use MakeInvo's free invoice generator to create a professional PDF invoice in under a minute. No signup, no watermark, no credit card required.",
  alternates: { canonical: `${siteUrl}/free-invoice` },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Free Invoice Generator", item: `${siteUrl}/free-invoice` },
  ],
}

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MakeInvo Free Invoice Generator",
  url: `${siteUrl}/free-invoice`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
}

export default function FreeInvoicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <EmbeddedInvoiceGenerator showHeading useBackend />
      </div>
    </div>
    </>
  )
}
