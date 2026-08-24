import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { SITE_INFO, LEGAL_ROUTES } from "@/lib/site-info"

export const metadata: Metadata = {
  title: "Privacy Policy | MakeInvo",
  description:
    "Read how MakeInvo collects, uses, stores, protects and deletes account, invoice, client and website usage information.",
  alternates: { canonical: LEGAL_ROUTES.privacy },
}

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "controller", title: "Who controls your information" },
  { id: "info-provided", title: "Information users provide" },
  { id: "account-info", title: "Account information" },
  { id: "client-invoice-info", title: "Client and invoice information" },
  { id: "payment-info", title: "Payment and subscription information" },
  { id: "support-messages", title: "Contact and support messages" },
  { id: "technical-info", title: "Automatically collected technical information" },
  { id: "cookies", title: "Cookies and analytics" },
  { id: "how-used", title: "How information is used" },
  { id: "legal-bases", title: "Legal bases for processing" },
  { id: "guest-invoices", title: "How guest invoices are processed" },
  { id: "registered-invoices", title: "How registered-user invoices are stored" },
  { id: "shared-links", title: "Shared invoice links" },
  { id: "payment-processing", title: "Payment processing" },
  { id: "subprocessors", title: "Service providers and subprocessors" },
  { id: "international-transfers", title: "International data transfers" },
  { id: "retention", title: "Data retention" },
  { id: "deletion", title: "Account and data deletion" },
  { id: "security", title: "Data security" },
  { id: "rights", title: "User privacy rights" },
  { id: "children", title: "Children's privacy" },
  { id: "automated-decisions", title: "Automated decision-making" },
  { id: "business-transfers", title: "Business transfers" },
  { id: "legal-disclosures", title: "Legal disclosures" },
  { id: "changes", title: "Changes to this Privacy Policy" },
  { id: "contact", title: "How to contact MakeInvo" },
  { id: "complaints", title: "How to complain to a data authority" },
]

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      path={LEGAL_ROUTES.privacy}
      intro="This Privacy Policy explains what information MakeInvo collects, why, how it is used, who it may be shared with, and the choices you have. It applies to makeinvo.com and the MakeInvo invoicing platform."
      sections={sections}
      related={[
        { href: LEGAL_ROUTES.cookiePolicy, label: "Cookie Policy" },
        { href: LEGAL_ROUTES.security, label: "Security" },
        { href: LEGAL_ROUTES.dataDeletion, label: "Data Deletion" },
        { href: LEGAL_ROUTES.subprocessors, label: "Subprocessors" },
        { href: LEGAL_ROUTES.terms, label: "Terms and Conditions" },
      ]}
    >
      <h2 id="introduction">1. Introduction</h2>
      <p>
        MakeInvo ("MakeInvo", "we", "us") provides an online invoice generator and invoicing platform. This policy
        describes our privacy practices for the makeinvo.com website and the MakeInvo application, including the
        free invoice generator, registered accounts, and paid subscription features.
      </p>

      <h2 id="controller">2. Who controls your information</h2>
      <p>
        The entity responsible for your information as "data controller" (or equivalent role under your local law)
        is: <strong>{SITE_INFO.legalBusinessName}</strong>, trading as MakeInvo, {SITE_INFO.registeredAddress}.{" "}
        <em>
          This entity and address are placeholders pending confirmation from the business owner and must be
          completed with verified details before this page is treated as final.
        </em>
      </p>

      <h2 id="info-provided">3. Information users provide</h2>
      <p>
        Depending on how you use MakeInvo, you may provide: your name and email address (account registration);
        your business details (business name, address, tax ID, logo); your clients' names, email addresses,
        billing addresses, and tax numbers (when you create an invoice or save a client); invoice content such as
        line items, prices, notes, and payment terms; and messages you send us for support.
      </p>

      <h2 id="account-info">4. Account information</h2>
      <p>
        Creating a MakeInvo account stores your email address, authentication credentials (managed by our
        authentication provider, Supabase Auth - MakeInvo does not see or store your raw password), and any
        business/profile details you add in account settings.
      </p>

      <h2 id="client-invoice-info">5. Client and invoice information</h2>
      <p>
        When you use MakeInvo to create an invoice, you may enter personal information about your own clients (for
        example, a client's name, email, address, and tax number). You are responsible for having a lawful basis
        to enter and process your clients' personal information through MakeInvo - see Section 21.
      </p>

      <h2 id="payment-info">6. Payment and subscription information</h2>
      <p>
        MakeInvo's own subscription billing (what <em>you</em> pay MakeInvo for a paid plan) is handled by Stripe
        and/or PayPal. MakeInvo does not receive or store your full card number, CVV, or PayPal login credentials -
        payment is entered directly with Stripe or PayPal, and MakeInvo only stores references such as your Stripe
        customer ID, subscription/plan status, and PayPal subscription ID, used to manage your subscription.
      </p>
      <p>
        This is separate from any <strong>invoice payment records</strong> you choose to enter yourself on an
        invoice (for example, your own bank details shown to your client, or a payment you mark as received) -
        MakeInvo does not process or collect payment from your clients on your behalf.
      </p>

      <h2 id="support-messages">7. Contact and support messages</h2>
      <p>
        If you contact us through the <Link href={LEGAL_ROUTES.contact}>Contact page</Link>, we store the details
        you submit (name, email, category, message, and any optional account/invoice reference) so we can respond
        to and keep a record of the request.
      </p>

      <h2 id="technical-info">8. Automatically collected technical information</h2>
      <p>
        Like most web applications, our hosting and security infrastructure automatically logs standard technical
        information, including your IP address and request metadata. We use IP addresses specifically to apply
        usage limits to the free invoice generator (so a guest cannot bypass the daily/monthly limit) and for
        general security and abuse prevention.
      </p>

      <h2 id="cookies">9. Cookies and analytics</h2>
      <p>
        MakeInvo uses strictly necessary cookies to keep you signed in (set by our authentication provider) and a
        small preference cookie for interface state. We use Vercel Analytics for aggregate, privacy-conscious
        website usage statistics. See the <Link href={LEGAL_ROUTES.cookiePolicy}>Cookie Policy</Link> for the full
        list and how to manage your choices.
      </p>

      <h2 id="how-used">10. How information is used</h2>
      <ul>
        <li>To provide the invoice generator, dashboard, and account features you use</li>
        <li>To generate, store, and let you retrieve invoices and client records you create</li>
        <li>To process and manage your MakeInvo subscription, via Stripe/PayPal</li>
        <li>To respond to support, privacy, and security requests</li>
        <li>To maintain security, prevent abuse, and enforce usage limits</li>
        <li>To send account-related and, where applicable, service communications</li>
      </ul>

      <h2 id="legal-bases">11. Legal bases for processing</h2>
      <p>
        Where a legal basis is required by your local law (for example, under EU/UK data protection law), we rely
        on: performance of a contract (providing the service you sign up for), legitimate interests (security,
        abuse prevention, service improvement), consent (where you give it, such as optional cookies), and
        compliance with legal obligations.
      </p>

      <h2 id="guest-invoices">12. How guest invoices are processed</h2>
      <p>
        The free invoice generator can be used without an account. When used this way, the invoice content you
        type is processed in your browser to generate a PDF and is <strong>not saved to any MakeInvo database</strong>{" "}
        - we do not persist guest invoice content server-side. We do record a lightweight, IP-based usage counter
        (not the invoice content itself) so guest usage limits can be enforced.
      </p>

      <h2 id="registered-invoices">13. How registered-user invoices are stored</h2>
      <p>
        Once you create a free account and generate an invoice while signed in, the invoice and any saved client
        details are stored in our database, tied to your account, so you can view, edit, resend, or track them
        later from your dashboard.
      </p>

      <h2 id="shared-links">14. Shared invoice links</h2>
      <p>
        Registered users can share a specific invoice with a client via a unique link. Anyone with that exact link
        can view that one invoice - it is not indexed by search engines and is not discoverable without the link.
        Sharing an invoice link only exposes that single invoice, never your client list, other invoices, or
        dashboard. There is currently no self-service option to revoke or expire an individual shared link after
        it has been sent; if you need a shared invoice link disabled, contact us via the{" "}
        <Link href={LEGAL_ROUTES.contact}>Contact page</Link>.
      </p>

      <h2 id="payment-processing">15. Payment processing</h2>
      <p>
        Subscription payments to MakeInvo are processed by Stripe and/or PayPal under their own privacy policies
        and security standards. Card and PayPal account details are entered directly with these providers - they
        do not pass through, and are not stored on, MakeInvo's own servers.
      </p>

      <h2 id="subprocessors">16. Service providers and subprocessors</h2>
      <p>
        We use a small number of third-party providers to operate MakeInvo, listed with the category of
        information each can access on the <Link href={LEGAL_ROUTES.subprocessors}>Subprocessors page</Link>.
      </p>

      <h2 id="international-transfers">17. International data transfers</h2>
      <p>
        Our database is hosted in the United Kingdom. Our hosting/CDN provider, Vercel, can serve requests from
        multiple regions globally, which may mean data is processed in a country other than your own. Where a
        cross-border transfer requires additional safeguards under your local law, we rely on the safeguards our
        providers offer as part of their own compliance programs.
      </p>

      <h2 id="retention">18. Data retention</h2>
      <p>
        We retain account, client, and invoice data for as long as your account remains active, so the service
        continues to work as expected. Exact retention periods after account deletion have not yet been confirmed
        by the business owner - see Section 19 for what we can currently confirm about deletion.
      </p>

      <h2 id="deletion">19. Account and data deletion</h2>
      <p>
        See the dedicated <Link href={LEGAL_ROUTES.dataDeletion}>Data and Account Deletion page</Link> for exactly
        what you can delete yourself today (individual invoices), and how to request deletion of an account or
        other data that does not yet have a self-service option.
      </p>

      <h2 id="security">20. Data security</h2>
      <p>
        All connections to MakeInvo are encrypted using HTTPS/TLS. See the <Link href={LEGAL_ROUTES.security}>
        Security page</Link> for details on how your account and data are protected, and how to report a security
        concern.
      </p>

      <h2 id="rights">21. User privacy rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct, export, or request deletion of your
        personal information, and to object to or restrict certain processing. You can exercise these rights by
        contacting us via the <Link href={LEGAL_ROUTES.contact}>Contact page</Link>. If you enter your own clients'
        personal information into MakeInvo, you are responsible for having a lawful basis to do so and for
        responding to any privacy requests your clients make to you directly.
      </p>

      <h2 id="children">22. Children's privacy</h2>
      <p>MakeInvo is intended for business use and is not directed to, or knowingly used by, children.</p>

      <h2 id="automated-decisions">23. Automated decision-making</h2>
      <p>
        MakeInvo does not use your personal information to make automated decisions that produce legal or similarly
        significant effects about you.
      </p>

      <h2 id="business-transfers">24. Business transfers</h2>
      <p>
        If MakeInvo is involved in a merger, acquisition, or sale of assets, your information may be transferred as
        part of that transaction. We will provide notice before your information becomes subject to a different
        privacy policy.
      </p>

      <h2 id="legal-disclosures">25. Legal disclosures</h2>
      <p>
        We may disclose information if required to do so by law, or if we believe in good faith that disclosure is
        necessary to comply with a legal obligation, protect our rights or property, or protect the safety of our
        users or the public.
      </p>

      <h2 id="changes">26. Changes to this Privacy Policy</h2>
      <p>
        We may update this policy from time to time. The "Last updated" date at the top reflects when it was last
        materially changed. Continued use of MakeInvo after an update means you accept the revised policy.
      </p>

      <h2 id="contact">27. How to contact MakeInvo</h2>
      <p>
        For privacy questions or requests, contact us at{" "}
        <a href={`mailto:${SITE_INFO.privacyEmail}`}>{SITE_INFO.privacyEmail}</a> or via the{" "}
        <Link href={LEGAL_ROUTES.contact}>Contact page</Link>.
      </p>

      <h2 id="complaints">28. How to complain to a data authority</h2>
      <p>
        If you believe we have not handled your personal information properly, you have the right to lodge a
        complaint with your local data protection authority. We ask that you contact us first so we can try to
        resolve the issue directly.
      </p>
    </LegalPageLayout>
  )
}
