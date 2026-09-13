import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { SITE_INFO, LEGAL_ROUTES } from "@/lib/site-info"

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy | MakeInvo",
  description: "Learn how to cancel a MakeInvo subscription, stop renewal and request help with an eligible refund.",
  alternates: { canonical: LEGAL_ROUTES.refundPolicy },
}

const sections = [
  { id: "how-subscriptions-work", title: "How subscriptions work" },
  { id: "trials", title: "Free trials" },
  { id: "monthly", title: "Monthly subscriptions" },
  { id: "annual", title: "Annual subscriptions" },
  { id: "auto-renewal", title: "Automatic renewals" },
  { id: "how-to-cancel", title: "How to cancel" },
  { id: "access-after", title: "Access after cancellation" },
  { id: "eligibility", title: "Refund eligibility" },
  { id: "duplicate-charges", title: "Duplicate or incorrect charges" },
  { id: "failed-payments", title: "Failed payments" },
  { id: "upgrades-downgrades", title: "Plan upgrades and downgrades" },
  { id: "promo-pricing", title: "Promotional pricing" },
  { id: "how-to-request", title: "How to request a refund" },
  { id: "processing-times", title: "Processing times" },
  { id: "provider-timing", title: "Payment-provider timing" },
  { id: "contact", title: "Contact information" },
]

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund and Cancellation Policy"
      path={LEGAL_ROUTES.refundPolicy}
      intro="This page explains how MakeInvo subscriptions renew, how to cancel, and when a refund may be available. It covers payments you make to MakeInvo for your own subscription - not payments your clients make to you."
      sections={sections}
      related={[
        { href: "/pricing", label: "Pricing" },
        { href: LEGAL_ROUTES.terms, label: "Terms and Conditions" },
      ]}
    >
      <h2 id="how-subscriptions-work">1. How subscriptions work</h2>
      <p>
        Paid MakeInvo plans are subscriptions billed through Stripe or PayPal, depending on the payment method you
        choose at checkout. Current plans and prices are shown on the <Link href="/pricing">Pricing page</Link>.
      </p>

      <h2 id="trials">2. Free trials</h2>
      <p>
        Where a free trial is offered, its length and what happens when it ends are shown at signup. If you do not
        cancel before a trial ends and a paid plan begins, your saved payment method will be charged.
      </p>

      <h2 id="monthly">3. Monthly subscriptions</h2>
      <p>Monthly plans are billed once per month from the date you subscribe, and renew each month until cancelled.</p>

      <h2 id="annual">4. Annual subscriptions</h2>
      <p>
        Annual plans are billed once per year from the date you subscribe, and renew each year until cancelled.
        Annual-plan refund requests are handled case by case - see Section 8.
      </p>

      <h2 id="auto-renewal">5. Automatic renewals</h2>
      <p>
        Subscriptions renew automatically at the end of each billing period using your saved payment method, unless
        you cancel before the renewal date.
      </p>

      <h2 id="how-to-cancel">6. How to cancel</h2>
      <p>
        You can cancel a subscription at any time from your account's subscription settings. Stripe-based
        subscriptions are managed through Stripe's customer portal, accessible from your subscription page;
        PayPal-based subscriptions are cancelled directly through MakeInvo's subscription settings, which sends a
        cancellation request to PayPal on your behalf.
      </p>

      <h2 id="access-after">7. Access after cancellation</h2>
      <p>
        Cancelling stops future renewals - your card or PayPal account will not be charged again. Depending on the
        payment provider and timing, you typically retain paid-plan access until the end of the billing period you
        already paid for, after which your account reverts to the free plan rather than being deleted.
      </p>

      <h2 id="eligibility">8. Refund eligibility</h2>
      <p>
        <em>
          MakeInvo has not yet published a confirmed refund rule (for example, a money-back window) for standard
          cancellations: [REFUND ELIGIBILITY RULE REQUIRED — OWNER CONFIRMATION NEEDED]. Until this is confirmed,
          refund requests are reviewed individually - contact us and we will let you know what's possible for your
          situation. This does not affect any mandatory refund rights you have under consumer-protection law in
          your jurisdiction.
        </em>
      </p>

      <h2 id="duplicate-charges">9. Duplicate or incorrect charges</h2>
      <p>
        If you believe you were charged twice or charged an incorrect amount, contact us with your account email,
        the charge date and amount, and we will investigate against your Stripe/PayPal billing record.
      </p>

      <h2 id="failed-payments">10. Failed payments</h2>
      <p>
        If a renewal payment fails, Stripe or PayPal may retry the charge automatically. If payment cannot be
        collected, your subscription may be paused or downgraded to the free plan until payment succeeds.
      </p>

      <h2 id="upgrades-downgrades">11. Plan upgrades and downgrades</h2>
      <p>
        Upgrading or downgrading changes your plan going forward. Whether an upgrade is prorated for the current
        billing period depends on the option Stripe/PayPal presents at the time - this is shown before you confirm
        the change.
      </p>

      <h2 id="promo-pricing">12. Promotional pricing</h2>
      <p>
        If you subscribed under a promotional or discounted price, that price applies for the term stated in the
        offer; renewals after that term may bill at the standard price shown on the Pricing page at the time.
      </p>

      <h2 id="how-to-request">13. How to request a refund</h2>
      <p>
        Contact us via the <Link href={LEGAL_ROUTES.contact}>Contact page</Link> (category: "Refund request") or at{" "}
        <a href={`mailto:${SITE_INFO.billingEmail}`}>{SITE_INFO.billingEmail}</a> with your account email, the
        charge date and amount, and the reason for your request.
      </p>

      <h2 id="processing-times">14. Processing times</h2>
      <p>
        We will acknowledge refund requests and let you know the outcome as soon as we can. A confirmed processing
        time has not yet been published: [REFUND PROCESSING TIME REQUIRED — OWNER CONFIRMATION NEEDED].
      </p>

      <h2 id="provider-timing">15. Payment-provider timing</h2>
      <p>
        Once a refund is approved and issued, Stripe or PayPal typically take several business days to return the
        funds to your original payment method - this timing is controlled by the payment provider and your bank,
        not MakeInvo.
      </p>

      <h2 id="contact">16. Contact information</h2>
      <p>
        For any billing or refund question, use the <Link href={LEGAL_ROUTES.contact}>Contact page</Link> or email{" "}
        <a href={`mailto:${SITE_INFO.billingEmail}`}>{SITE_INFO.billingEmail}</a>.
      </p>
    </LegalPageLayout>
  )
}
