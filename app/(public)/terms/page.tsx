import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "InvoiceFlow Terms of Service",
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://makeinvo.com"

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Terms of Service", item: `${siteUrl}/terms` },
  ],
}

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">Last updated: December 10, 2025</p>
        <div className="prose prose-neutral mt-8 dark:prose-invert">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using InvoiceFlow, you accept and agree to be bound by the terms and provision of this
            agreement.
          </p>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily use InvoiceFlow for personal, non-commercial transitory viewing only.
            This is the grant of a license, not a transfer of title.
          </p>
          <h2>3. Disclaimer</h2>
          <p>
            The materials on InvoiceFlow are provided on an &apos;as is&apos; basis. InvoiceFlow makes no warranties,
            expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
            implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
            of intellectual property or other violation of rights.
          </p>
          <h2>4. Limitations</h2>
          <p>
            In no event shall InvoiceFlow or its suppliers be liable for any damages (including, without limitation,
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability to
            use the materials on InvoiceFlow.
          </p>
          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on InvoiceFlow could include technical, typographical, or photographic errors.
            InvoiceFlow does not warrant that any of the materials on its website are accurate, complete or current.
          </p>
          <h2>6. Modifications</h2>
          <p>
            InvoiceFlow may revise these terms of service at any time without notice. By using this website you are
            agreeing to be bound by the then current version of these terms of service.
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
