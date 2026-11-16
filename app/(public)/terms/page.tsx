import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { SITE_INFO, LEGAL_ROUTES } from "@/lib/site-info"

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the terms governing access to MakeInvo's free invoice generator, accounts, paid subscriptions and invoicing features.",
  alternates: { canonical: LEGAL_ROUTES.terms },
}

const sections = [
  { id: "agreement", title: "Agreement to the terms" },
  { id: "eligibility", title: "Who may use MakeInvo" },
  { id: "registration", title: "Account registration" },
  { id: "account-security", title: "Account security" },
  { id: "free-generator", title: "The free invoice generator" },
  { id: "plans", title: "Free and paid plans" },
  { id: "billing", title: "Subscription billing" },
  { id: "trials", title: "Trials and promotional offers" },
  { id: "renewals", title: "Renewals" },
  { id: "upgrades", title: "Upgrades and downgrades" },
  { id: "cancellation", title: "Cancellation" },
  { id: "refunds", title: "Refunds" },
  { id: "user-content", title: "User-created invoices and client information" },
  { id: "responsibilities", title: "User responsibilities" },
  { id: "acceptable-use", title: "Acceptable use" },
  { id: "shared-links", title: "Shared invoice links" },
  { id: "ip", title: "Intellectual property" },
  { id: "ownership", title: "User content ownership" },
  { id: "permission", title: "Permission needed to operate the service" },
  { id: "third-party", title: "Third-party services" },
  { id: "tax-disclaimer", title: "Tax, legal and accounting disclaimer" },
  { id: "availability", title: "Service availability and changes" },
  { id: "suspension", title: "Suspension and termination" },
  { id: "export-closure", title: "Data export and account closure" },
  { id: "disclaimers", title: "Disclaimers" },
  { id: "liability", title: "Limitation of liability" },
  { id: "governing-law", title: "Governing law" },
  { id: "disputes", title: "Dispute resolution" },
  { id: "changes", title: "Changes to these terms" },
  { id: "contact", title: "Contact details" },
]

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms and Conditions"
      path={LEGAL_ROUTES.terms}
      intro="These terms govern your access to and use of MakeInvo's website and invoicing platform, including the free invoice generator, registered accounts, and paid subscriptions. By using MakeInvo, you agree to these terms."
      sections={sections}
      related={[
        { href: LEGAL_ROUTES.acceptableUse, label: "Acceptable Use Policy" },
        { href: LEGAL_ROUTES.privacy, label: "Privacy Policy" },
      ]}
    >
      <h2 id="agreement">1. Agreement to the terms</h2>
      <p>
        By creating an account, using the free invoice generator, or subscribing to a paid plan, you agree to these
        Terms and Conditions and to our <Link href={LEGAL_ROUTES.privacy}>Privacy Policy</Link> and{" "}
        <Link href={LEGAL_ROUTES.acceptableUse}>Acceptable Use Policy</Link>.
      </p>

      <h2 id="eligibility">2. Who may use MakeInvo</h2>
      <p>
        MakeInvo is intended for business use by individuals and organizations old enough to enter a binding
        contract in their jurisdiction.
      </p>

      <h2 id="registration">3. Account registration</h2>
      <p>
        A registered account lets you save clients, access invoice history, and unlock higher usage limits and paid
        features. You must provide accurate account information and keep it up to date.
      </p>

      <h2 id="account-security">4. Account security</h2>
      <p>
        You are responsible for maintaining the confidentiality of your login credentials and for all activity
        under your account. Notify us immediately at{" "}
        <a href={`mailto:${SITE_INFO.securityEmail}`}>{SITE_INFO.securityEmail}</a> if you suspect unauthorized
        access.
      </p>

      <h2 id="free-generator">5. The free invoice generator</h2>
      <p>
        The invoice generator on the homepage and free-invoice page can be used without an account, subject to
        usage limits that apply per day and per month per user/IP address. Guest invoice content is generated in
        your browser and is not saved to a MakeInvo account.
      </p>

      <h2 id="plans">6. Free and paid plans</h2>
      <p>
        MakeInvo offers a free registered plan and paid subscription plans with additional limits and features
        (such as recurring invoices, email/WhatsApp delivery, payment tracking, and analytics). Current plan
        details and pricing are shown on the <Link href="/pricing">Pricing page</Link>, which is the authoritative
        source for limits and pricing at any given time. If plan limits change, we will update the Pricing page and
        make reasonable efforts to notify active subscribers of material changes affecting their plan.
      </p>

      <h2 id="billing">7. Subscription billing</h2>
      <p>
        Paid subscriptions are billed through Stripe or PayPal, depending on the payment method you choose.
        MakeInvo does not receive or store your full card or PayPal login details - see the{" "}
        <Link href={LEGAL_ROUTES.privacy}>Privacy Policy</Link>.
      </p>

      <h2 id="trials">8. Trials and promotional offers</h2>
      <p>
        Where a free trial or promotional price is offered, its exact terms (length, eligibility, and what happens
        at the end of the trial) are shown at the time the offer is presented and take precedence over any general
        description elsewhere on the site.
      </p>

      <h2 id="renewals">9. Renewals</h2>
      <p>
        Paid subscriptions renew automatically at the end of each billing period (monthly or annually, matching the
        plan you selected) unless cancelled before the renewal date, and are billed through Stripe or PayPal using
        your saved payment method.
      </p>

      <h2 id="upgrades">10. Upgrades and downgrades</h2>
      <p>
        You can upgrade or downgrade your plan from your account's subscription settings. If a downgrade would put
        you over the new plan's limits (for example, more saved clients or invoices than the lower plan allows),
        existing data is not deleted, but some features or the ability to create additional records may be
        restricted until you are back within the new plan's limits.
      </p>

      <h2 id="cancellation">11. Cancellation</h2>
      <p>
        You can cancel your subscription at any time from your account's subscription settings. Contact us via the{" "}
        <Link href={LEGAL_ROUTES.contact}>Contact page</Link> if you need help with cancellation.
      </p>

      <h2 id="refunds">12. Refunds</h2>
      <p>
        For refund requests, contact us via the{" "}
        <Link href={LEGAL_ROUTES.contact}>Contact page</Link>. Nothing in these
        terms overrides mandatory consumer-protection rights that apply in your jurisdiction.
      </p>

      <h2 id="user-content">13. User-created invoices and client information</h2>
      <p>
        You are solely responsible for the accuracy and legality of the invoices, client information, and other
        content you create using MakeInvo, including any personal data about your clients that you choose to
        enter.
      </p>

      <h2 id="responsibilities">14. User responsibilities</h2>
      <ul>
        <li>Provide accurate account and billing information</li>
        <li>Keep your login credentials secure</li>
        <li>Have a lawful basis for any client personal data you enter</li>
        <li>Verify the accuracy of tax rates, totals, and legal content on your invoices before sending them</li>
        <li>Use MakeInvo in accordance with the <Link href={LEGAL_ROUTES.acceptableUse}>Acceptable Use Policy</Link></li>
      </ul>

      <h2 id="acceptable-use">15. Acceptable use</h2>
      <p>
        Prohibited uses of MakeInvo, and the actions we may take in response, are set out in full in the{" "}
        <Link href={LEGAL_ROUTES.acceptableUse}>Acceptable Use Policy</Link>, which forms part of these terms.
      </p>

      <h2 id="shared-links">16. Shared invoice links</h2>
      <p>
        When you share an invoice link with a client, anyone with that link can view that specific invoice. You are
        responsible for sharing invoice links only with their intended recipient.
      </p>

      <h2 id="ip">17. Intellectual property</h2>
      <p>
        The MakeInvo name, logo, website, and underlying software are owned by MakeInvo or its licensors. These
        terms do not grant you any rights to MakeInvo's trademarks, branding, or source code beyond what is
        necessary to use the service as intended.
      </p>

      <h2 id="ownership">18. User content ownership</h2>
      <p>
        You retain full ownership of the invoices, client information, logos, and other content you create or
        upload in MakeInvo.
      </p>

      <h2 id="permission">19. Permission needed to operate the service</h2>
      <p>
        By using MakeInvo, you grant us only the limited permission needed to store, process, and display your
        content in order to provide the service to you - for example, generating a PDF, displaying your dashboard,
        or rendering a shared invoice link. We do not use your invoice or client content to train third-party AI
        models or sell it to third parties.
      </p>

      <h2 id="third-party">20. Third-party services</h2>
      <p>
        MakeInvo relies on third-party providers (such as payment processors and hosting/database infrastructure)
        listed on the <Link href={LEGAL_ROUTES.subprocessors}>Subprocessors page</Link>. Your use of features
        involving these providers (for example, checkout via Stripe or PayPal) is also subject to that provider's
        own terms.
      </p>

      <h2 id="tax-disclaimer">21. Tax, legal and accounting disclaimer</h2>
      <p>
        MakeInvo is software, not an accounting, tax, or legal adviser. Any general information about invoices,
        tax, VAT, or GST shown in the product or on the website is provided for convenience only and is not
        professional advice. You are responsible for verifying your own tax rates, invoice requirements, and legal
        obligations, including by consulting a qualified professional where appropriate.
      </p>

      <h2 id="availability">22. Service availability and changes</h2>
      <p>
        We aim to keep MakeInvo available and reliable but do not guarantee uninterrupted access. We may modify,
        add, or remove features over time; we will make reasonable efforts to communicate material changes that
        affect existing paid subscribers.
      </p>

      <h2 id="suspension">23. Suspension and termination</h2>
      <p>
        We may suspend or terminate access to accounts that violate these terms or the{" "}
        <Link href={LEGAL_ROUTES.acceptableUse}>Acceptable Use Policy</Link>, including for fraud, abuse, or
        unlawful use. Where practical, we will provide notice and an opportunity to resolve the issue first, except
        where immediate action is necessary to protect the service or other users.
      </p>

      <h2 id="export-closure">24. Data export and account closure</h2>
      <p>
        See the <Link href={LEGAL_ROUTES.dataDeletion}>Data and Account Deletion page</Link> for how to close an
        account and what happens to your data afterward.
      </p>

      <h2 id="disclaimers">25. Disclaimers</h2>
      <p>
        MakeInvo is provided "as is" and "as available," without warranties of any kind, express or implied,
        including implied warranties of merchantability, fitness for a particular purpose, or non-infringement,
        to the extent permitted by law.
      </p>

      <h2 id="liability">26. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, MakeInvo will not be liable for any indirect, incidental, special,
        or consequential damages, or for loss of profits, revenue, or data, arising from your use of the service.
        Nothing in these terms limits liability that cannot be limited under applicable law.
      </p>

      <h2 id="governing-law">27. Governing law</h2>
      <p>
        <em>
          The governing law and jurisdiction for these terms have not yet been confirmed by the business owner and
          are marked here as requiring confirmation before publication: [GOVERNING LAW / JURISDICTION REQUIRED —
          OWNER CONFIRMATION NEEDED].
        </em>
      </p>

      <h2 id="disputes">28. Dispute resolution</h2>
      <p>
        If a dispute arises, we encourage you to contact us first via the{" "}
        <Link href={LEGAL_ROUTES.contact}>Contact page</Link> so we can try to resolve it directly.
      </p>

      <h2 id="changes">29. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The "Last updated" date at the top reflects when they were
        last materially changed. Continued use of MakeInvo after an update means you accept the revised terms.
      </p>

      <h2 id="contact">30. Contact details</h2>
      <p>
        Questions about these terms can be sent to{" "}
        <a href={`mailto:${SITE_INFO.supportEmail}`}>{SITE_INFO.supportEmail}</a> or via the{" "}
        <Link href={LEGAL_ROUTES.contact}>Contact page</Link>.
      </p>
    </LegalPageLayout>
  )
}
