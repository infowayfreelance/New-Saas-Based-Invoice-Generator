import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { ContactForm } from "@/components/legal/contact-form"
import { SITE_INFO, LEGAL_ROUTES } from "@/lib/site-info"

export const metadata: Metadata = {
  title: "Contact MakeInvo | Account, Billing and Invoice Support",
  description: "Contact MakeInvo for help with your account, invoices, subscription, billing, privacy or security questions.",
  alternates: { canonical: LEGAL_ROUTES.contact },
}

export default function ContactPage() {
  return (
    <LegalPageLayout
      title="Contact MakeInvo"
      path={LEGAL_ROUTES.contact}
      intro="Have a question about your account, an invoice, billing, privacy, or security? Use the form below or email us directly."
      related={[
        { href: LEGAL_ROUTES.privacy, label: "Privacy Policy" },
        { href: LEGAL_ROUTES.security, label: "Security" },
      ]}
    >
      <h2>General support</h2>
      <p>
        For any general question, email <a href={`mailto:${SITE_INFO.supportEmail}`}>{SITE_INFO.supportEmail}</a> or
        use the form below.
      </p>

      <h2>Account support</h2>
      <p>Sign-in, registration, or account-settings issues - select "Account help" in the form below.</p>

      <h2>Billing and subscription support</h2>
      <p>
        For plan, billing, or subscription questions, select "Billing or subscription" below.
      </p>

      <h2>Privacy requests</h2>
      <p>
        To ask about, access, or delete your personal information, select "Privacy or data request" below, or email{" "}
        <a href={`mailto:${SITE_INFO.privacyEmail}`}>{SITE_INFO.privacyEmail}</a>. See also the{" "}
        <Link href={LEGAL_ROUTES.dataDeletion}>Data and Account Deletion page</Link>.
      </p>

      <h2>Security reports</h2>
      <p>
        To report a security issue, select "Security issue" below or email{" "}
        <a href={`mailto:${SITE_INFO.securityEmail}`}>{SITE_INFO.securityEmail}</a> directly - see our{" "}
        <Link href={LEGAL_ROUTES.security}>Security page</Link> for responsible-disclosure guidelines.
      </p>

      <h2>Business or partnership enquiries</h2>
      <p>Affiliate programme and other business enquiries - select the relevant category below.</p>

      <h2>Support availability</h2>
      <p>
        <em>
          Confirmed support hours and typical response time have not yet been published:{" "}
          {SITE_INFO.supportHours} / {SITE_INFO.responseTime}. We do not claim 24/7 support or a guaranteed response
          time until these are confirmed.
        </em>
      </p>

      <h2>Safety notice</h2>
      <p>
        Never send your password, full payment card details, secret keys, or confidential client information
        through this form or by email.
      </p>

      <div className="not-prose mt-10 rounded-xl border border-border bg-card p-6 sm:p-8">
        <ContactForm />
      </div>
    </LegalPageLayout>
  )
}
