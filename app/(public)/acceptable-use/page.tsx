import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { SITE_INFO, LEGAL_ROUTES } from "@/lib/site-info"

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description:
    "Read the rules for using MakeInvo's invoice generation, account, email, sharing and subscription features responsibly.",
  alternates: { canonical: LEGAL_ROUTES.acceptableUse },
}

const sections = [
  { id: "purpose", title: "Purpose" },
  { id: "prohibited", title: "Prohibited activities" },
  { id: "actions", title: "Actions we may take" },
  { id: "reporting", title: "Reporting abuse" },
  { id: "your-content", title: "Your content stays yours" },
  { id: "contact", title: "Contact information" },
]

const prohibited = [
  "Creating or sending fraudulent invoices, or invoices for goods/services that were never provided",
  "Making false or misleading payment demands",
  "Impersonating another person, business, or MakeInvo itself",
  "Using MakeInvo to facilitate money laundering or other unlawful financial transactions",
  "Phishing or attempting to deceive recipients of an invoice or shared link",
  "Uploading or distributing malware or other harmful code",
  "Sending spam, or using MakeInvo's email/WhatsApp delivery features to send unsolicited bulk messages",
  "Harassing, threatening, or abusing another person",
  "Infringing copyright, trademark, or other intellectual property rights",
  "Uploading logos, signatures, or other content you don't have permission to use",
  "Using MakeInvo to invoice for illegal goods or services",
  "Attempting to access another user's account or data without authorization",
  "Security testing, scanning, or penetration testing against MakeInvo without prior written permission",
  "Scraping or automated data collection that degrades or harms the service",
  "Abusing the email or WhatsApp delivery features (for example, to bulk-spam recipients)",
  "Attempting to bypass or circumvent free-plan or account usage limits",
  "Creating accounts through automated means or in bulk to evade limits",
  "Reselling or white-labeling the MakeInvo service without our prior written permission",
]

export default function AcceptableUsePage() {
  return (
    <LegalPageLayout
      title="Acceptable Use Policy"
      path={LEGAL_ROUTES.acceptableUse}
      intro="This policy sets out what you may not do when using MakeInvo. It applies to the free invoice generator, registered accounts, and paid plans, and forms part of our Terms and Conditions."
      sections={sections}
      related={[
        { href: LEGAL_ROUTES.terms, label: "Terms and Conditions" },
        { href: LEGAL_ROUTES.security, label: "Security" },
      ]}
    >
      <h2 id="purpose">1. Purpose</h2>
      <p>
        MakeInvo is built for creating and managing legitimate business invoices. This policy exists to keep the
        service safe and usable for everyone.
      </p>

      <h2 id="prohibited">2. Prohibited activities</h2>
      <p>You may not use MakeInvo to:</p>
      <ul>
        {prohibited.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 id="actions">3. Actions we may take</h2>
      <p>Depending on the nature and severity of a violation, we may take one or more of the following actions:</p>
      <ul>
        <li>Send a warning</li>
        <li>Remove or restrict access to specific content</li>
        <li>Restrict specific features (for example, email/WhatsApp delivery)</li>
        <li>Suspend an account temporarily</li>
        <li>Terminate an account permanently</li>
        <li>Report unlawful activity to the relevant authorities where required</li>
      </ul>
      <p>Where practical, we will give notice and a chance to resolve the issue before taking action.</p>

      <h2 id="reporting">4. Reporting abuse</h2>
      <p>
        If you become aware of MakeInvo being used in a way that violates this policy, please report it via the{" "}
        <Link href={LEGAL_ROUTES.contact}>Contact page</Link>.
      </p>

      <h2 id="your-content">5. Your content stays yours</h2>
      <p>
        This policy restricts how MakeInvo may be used - it does not give MakeInvo any additional ownership or
        rights over your legitimate invoices, client data, or other content beyond what's needed to provide the
        service to you, as described in the <Link href={LEGAL_ROUTES.terms}>Terms and Conditions</Link>.
      </p>

      <h2 id="contact">6. Contact information</h2>
      <p>
        Questions about this policy: <a href={`mailto:${SITE_INFO.supportEmail}`}>{SITE_INFO.supportEmail}</a> or
        the <Link href={LEGAL_ROUTES.contact}>Contact page</Link>.
      </p>
    </LegalPageLayout>
  )
}
