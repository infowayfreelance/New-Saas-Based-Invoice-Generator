import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { SITE_INFO, LEGAL_ROUTES } from "@/lib/site-info"

export const metadata: Metadata = {
  title: "Delete Your MakeInvo Account and Data | MakeInvo",
  description:
    "Learn how to delete your MakeInvo account, invoices and client information and what may be retained for legal or security reasons.",
  alternates: { canonical: LEGAL_ROUTES.dataDeletion },
}

const sections = [
  { id: "delete-invoices", title: "Deleting individual invoices" },
  { id: "delete-clients", title: "Deleting saved clients" },
  { id: "cancel-subscription", title: "Cancelling a subscription" },
  { id: "delete-account", title: "Deleting an account" },
  { id: "what-includes", title: "What deletion includes" },
  { id: "what-retained", title: "What may be retained" },
  { id: "backups", title: "Backup retention" },
  { id: "shared-links", title: "Shared invoice links after deletion" },
  { id: "how-long", title: "How long deletion takes" },
  { id: "how-to-request", title: "How to request help" },
  { id: "identity", title: "Identity verification" },
  { id: "rights-requests", title: "Privacy rights requests" },
]

export default function DataDeletionPage() {
  return (
    <LegalPageLayout
      title="Delete Your MakeInvo Account and Data"
      path={LEGAL_ROUTES.dataDeletion}
      intro="This page explains what you can delete yourself today from your MakeInvo account, and how to request deletion of anything that doesn't yet have a self-service option."
      sections={sections}
      related={[
        { href: LEGAL_ROUTES.privacy, label: "Privacy Policy" },
        { href: LEGAL_ROUTES.contact, label: "Contact" },
      ]}
    >
      <h2 id="delete-invoices">1. Deleting individual invoices</h2>
      <p>
        You can delete an individual invoice yourself from the Invoices list in your dashboard - open the invoice's
        menu and choose Delete. This permanently removes that invoice and its line items from your account.
      </p>

      <h2 id="delete-clients">2. Deleting saved clients</h2>
      <p>
        You can delete a saved client from the Clients section of your dashboard, which removes that client record
        from your account.
      </p>

      <h2 id="cancel-subscription">3. Cancelling a subscription</h2>
      <p>
        Cancelling your paid plan is a separate action from deleting your account - it stops future billing but
        keeps your account, invoices, and clients intact on the free plan. See the{" "}
        <Link href={LEGAL_ROUTES.refundPolicy}>Refund and Cancellation Policy</Link>.
      </p>

      <h2 id="delete-account">4. Deleting an account</h2>
      <p>
        MakeInvo does not currently have a self-service "Delete Account" button in account settings. To request
        deletion of your account and the data associated with it, contact us via the{" "}
        <Link href={LEGAL_ROUTES.contact}>Contact page</Link> (category: "Privacy or data request") from the email
        address associated with your account. We will verify your identity before processing a request submitted
        this way (see Section 11). Adding a fully self-service delete-account option is something we would need to
        review carefully first, given it's a destructive, irreversible action.
      </p>

      <h2 id="what-includes">5. What deletion includes</h2>
      <p>
        An account deletion request covers your account profile, saved clients, and invoices stored in our
        database, along with your business profile/branding details.
      </p>

      <h2 id="what-retained">6. What may be retained</h2>
      <p>
        Some information may need to be retained after account deletion for legitimate reasons - for example,
        subscription and payment records we're required to keep for accounting or legal purposes, records needed to
        prevent fraud or abuse, and information already contained in security or system logs. Exact retention
        periods for these records have not yet been confirmed by the business owner:{" "}
        [POST-DELETION RETENTION PERIOD REQUIRED — OWNER CONFIRMATION NEEDED].
      </p>

      <h2 id="backups">7. Backup retention</h2>
      <p>
        Like most managed database services, our database provider's routine backups are not deleted instantly on
        request - deleted data may persist in backup snapshots for a period before those backups themselves age out
        and are overwritten. We do not yet have a confirmed backup-retention window to publish here.
      </p>

      <h2 id="shared-links">8. Shared invoice links after deletion</h2>
      <p>
        Once the underlying invoice is deleted, a previously shared link to it will no longer resolve to valid
        invoice data.
      </p>

      <h2 id="how-long">9. How long deletion takes</h2>
      <p>
        Invoices and clients you delete yourself are removed immediately from your account view. Account-level
        deletion requests submitted via Contact are handled manually; a confirmed turnaround time has not yet been
        published: [ACCOUNT DELETION TURNAROUND TIME REQUIRED — OWNER CONFIRMATION NEEDED].
      </p>

      <h2 id="how-to-request">10. How to request help</h2>
      <p>
        Use the <Link href={LEGAL_ROUTES.contact}>Contact page</Link> or email{" "}
        <a href={`mailto:${SITE_INFO.privacyEmail}`}>{SITE_INFO.privacyEmail}</a>.
      </p>

      <h2 id="identity">11. Identity verification</h2>
      <p>
        To protect your account from unauthorized deletion, we will only action account/data-deletion requests
        confirmed to come from the email address on the account, and may ask you to confirm details we can verify
        against your account before proceeding.
      </p>

      <h2 id="rights-requests">12. Privacy rights requests</h2>
      <p>
        Deletion is one of several rights described in the{" "}
        <Link href={LEGAL_ROUTES.privacy}>Privacy Policy</Link> - you can also request a copy of your data or ask
        us to correct it using the same Contact process.
      </p>
    </LegalPageLayout>
  )
}
