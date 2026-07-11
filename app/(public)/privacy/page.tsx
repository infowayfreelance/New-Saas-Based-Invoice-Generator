import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "InvoiceFlow Privacy Policy",
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://makeinvo.com"

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${siteUrl}/privacy` },
  ],
}

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: December 10, 2025</p>
        <div className="prose prose-neutral mt-8 dark:prose-invert">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, use our services, or
            contact us for support. This includes your name, email address, and any invoice data you create.
          </p>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
          </ul>
          <h2>3. Information Sharing</h2>
          <p>
            We do not share your personal information with third parties except as described in this policy. We may
            share information with service providers who assist in our operations.
          </p>
          <h2>4. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized
            access, disclosure, alteration, and destruction.
          </p>
          <h2>5. Your Rights</h2>
          <p>
            You may access, correct, or delete your personal information by logging into your account settings. You may
            also contact us to request access to, correct, or delete any personal information.
          </p>
          <h2>6. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us through our support channels.</p>
        </div>
      </div>
    </div>
    </>
  )
}
