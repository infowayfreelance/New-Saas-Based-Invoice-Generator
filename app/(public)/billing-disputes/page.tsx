import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { SITE_INFO, LEGAL_ROUTES } from "@/lib/site-info"

export const metadata: Metadata = {
  title: "Billing and Dispute Policy | MakeInvo",
  description:
    "Learn how MakeInvo handles billing questions, incorrect charges, refund disputes and payment-related complaints.",
  alternates: { canonical: LEGAL_ROUTES.billingDisputes },
}

const sections = [
  { id: "check-first", title: "Check your invoice and account first" },
  { id: "recognising", title: "Recognising MakeInvo charges" },
  { id: "incorrect", title: "Incorrect or unexpected charges" },
  { id: "duplicate", title: "Duplicate charges" },
  { id: "failed", title: "Failed or reversed payments" },
  { id: "trial-to-paid", title: "Trial-to-paid subscription charges" },
  { id: "annual-renewal", title: "Annual renewal disputes" },
  { id: "refund-disputes", title: "Refund disputes" },
  { id: "how-to-submit", title: "How to submit a billing complaint" },
  { id: "info-needed", title: "Information required to investigate" },
  { id: "process", title: "Investigation and response process" },
  { id: "resolution", title: "Resolution options" },
  { id: "chargebacks", title: "Chargebacks" },
  { id: "fraud", title: "Fraudulent transactions" },
  { id: "escalating", title: "Escalating an unresolved complaint" },
  { id: "governing-law", title: "Governing law and consumer rights" },
  { id: "contact", title: "Contact information" },
]

export default function BillingDisputesPage() {
  return (
    <LegalPageLayout
      title="Billing and Dispute Policy"
      path={LEGAL_ROUTES.billingDisputes}
      intro="This policy explains how to raise and how we handle a billing question about your own MakeInvo subscription. It does not cover payment disputes between you and the clients you invoice using MakeInvo - those are between you and your client."
      sections={sections}
      related={[
        { href: LEGAL_ROUTES.refundPolicy, label: "Refund and Cancellation Policy" },
        { href: LEGAL_ROUTES.terms, label: "Terms and Conditions" },
        { href: LEGAL_ROUTES.contact, label: "Contact" },
      ]}
    >
      <h2 id="check-first">1. Check your invoice and account first</h2>
      <p>
        Before raising a dispute, check your Stripe or PayPal receipt email and your MakeInvo subscription settings
        - many questions are resolved by confirming the plan, billing date, and amount shown there.
      </p>

      <h2 id="recognising">2. Recognising MakeInvo charges</h2>
      <p>
        Charges for your MakeInvo subscription will appear on your statement under the billing descriptor used by
        Stripe or PayPal for MakeInvo's account with them, alongside the plan you subscribed to.
      </p>

      <h2 id="incorrect">3. Incorrect or unexpected charges</h2>
      <p>
        If a charge doesn't match the plan or price you expected, contact us with the details below and we will
        check it against your subscription and billing-provider record.
      </p>

      <h2 id="duplicate">4. Duplicate charges</h2>
      <p>
        If you were billed twice for the same period, let us know - we will verify this with Stripe/PayPal and
        arrange a correction where a duplicate charge is confirmed.
      </p>

      <h2 id="failed">5. Failed or reversed payments</h2>
      <p>
        If a payment failed or was reversed by your bank, your subscription may show as past due or may revert to
        the free plan until payment is resolved.
      </p>

      <h2 id="trial-to-paid">6. Trial-to-paid subscription charges</h2>
      <p>
        If you were charged after a free trial you believe you cancelled in time, contact us with the cancellation
        date you attempted and we will check your account's cancellation history.
      </p>

      <h2 id="annual-renewal">7. Annual renewal disputes</h2>
      <p>
        Annual renewal disputes are reviewed individually, taking into account how far into the renewal period the
        request is made.
      </p>

      <h2 id="refund-disputes">8. Refund disputes</h2>
      <p>
        If you disagree with the outcome of a refund request made under the{" "}
        <Link href={LEGAL_ROUTES.refundPolicy}>Refund and Cancellation Policy</Link>, you can ask for it to be
        reviewed again using the process below.
      </p>

      <h2 id="how-to-submit">9. How to submit a billing complaint</h2>
      <p>
        Email <a href={`mailto:${SITE_INFO.billingEmail}`}>{SITE_INFO.billingEmail}</a> or use the{" "}
        <Link href={LEGAL_ROUTES.contact}>Contact page</Link> (category: "Billing or subscription" or "Payment
        dispute").
      </p>

      <h2 id="info-needed">10. Information required to investigate</h2>
      <ul>
        <li>Your account email</li>
        <li>The charge date, amount, and currency</li>
        <li>The last four digits or a payment reference, only where your provider shows this safely</li>
        <li>Any relevant invoice or transaction ID from your MakeInvo account</li>
        <li>A short description of the issue</li>
      </ul>
      <p>
        <strong>
          Never send your full card number, CVV, password, or other secret login information to us by email or
          through the contact form.
        </strong>
      </p>

      <h2 id="process">11. Investigation and response process</h2>
      <ol>
        <li>You contact MakeInvo billing support with the details above.</li>
        <li>We acknowledge your complaint.</li>
        <li>We investigate against your account and Stripe/PayPal payment records.</li>
        <li>We explain the result and any available resolution.</li>
        <li>You can ask for the matter to be escalated if it remains unresolved.</li>
      </ol>
      <p>
        A confirmed acknowledgement/response time has not yet been published:{" "}
        [BILLING RESPONSE TIME REQUIRED — OWNER CONFIRMATION NEEDED].
      </p>

      <h2 id="resolution">12. Resolution options</h2>
      <p>
        Depending on the investigation, a resolution may include a correction, a refund under the{" "}
        <Link href={LEGAL_ROUTES.refundPolicy}>Refund and Cancellation Policy</Link>, a plan/billing adjustment, or
        an explanation of why the charge was correct.
      </p>

      <h2 id="chargebacks">13. Chargebacks</h2>
      <p>
        We ask that you contact us first so we can investigate before filing a chargeback with your bank or card
        issuer, since a chargeback can take longer to resolve than contacting us directly. This is a request, not a
        restriction - you always retain the right to contact your bank or payment provider directly.
      </p>

      <h2 id="fraud">14. Fraudulent transactions</h2>
      <p>
        If you believe a MakeInvo subscription was created or charged fraudulently (for example, your payment
        method was used without your authorization), contact us immediately and also notify your card issuer or
        PayPal.
      </p>

      <h2 id="escalating">15. Escalating an unresolved complaint</h2>
      <p>
        If you're not satisfied with the outcome, reply to your existing thread and ask for the complaint to be
        escalated for a further review.
      </p>

      <h2 id="governing-law">16. Governing law and consumer rights</h2>
      <p>
        Nothing in this policy limits any mandatory consumer-protection or dispute-resolution rights you have under
        the law of your country of residence.
      </p>

      <h2 id="contact">17. Contact information</h2>
      <p>
        Billing and dispute questions: <a href={`mailto:${SITE_INFO.billingEmail}`}>{SITE_INFO.billingEmail}</a> or
        the <Link href={LEGAL_ROUTES.contact}>Contact page</Link>.
      </p>
    </LegalPageLayout>
  )
}
