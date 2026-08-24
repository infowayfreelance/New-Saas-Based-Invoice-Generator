import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { SITE_INFO, LEGAL_ROUTES } from "@/lib/site-info"

export const metadata: Metadata = {
  title: "About MakeInvo | Free Online Invoicing Platform",
  description:
    "Learn why MakeInvo was created and how we help freelancers, contractors and small businesses create and manage professional invoices.",
  alternates: { canonical: LEGAL_ROUTES.about },
}

export default function AboutPage() {
  return (
    <LegalPageLayout
      title="About MakeInvo"
      path={LEGAL_ROUTES.about}
      related={[
        { href: LEGAL_ROUTES.contact, label: "Contact" },
        { href: LEGAL_ROUTES.security, label: "Security" },
        { href: LEGAL_ROUTES.privacy, label: "Privacy Policy" },
      ]}
    >
      <h2>Why MakeInvo was created</h2>
      <p>
        MakeInvo was built around a simple idea: creating a professional invoice shouldn't require learning
        accounting software, paying for tools you'll use a few times a month, or fighting with a spreadsheet
        template. It started as a free, no-signup invoice generator and has grown from there.
      </p>

      <h2>The problem MakeInvo solves</h2>
      <p>
        Freelancers, contractors, agencies, and small businesses need to send invoices regularly, but many either
        rebuild the same invoice by hand every time or pay for full accounting software they don't need. MakeInvo
        gives you a fast, focused way to create a clean invoice PDF - and, if you want it, a place to keep clients,
        track payments, and manage recurring billing without the overhead of a full accounting suite.
      </p>

      <h2>Who the platform is for</h2>
      <p>
        MakeInvo is built for freelancers, designers and creatives, consultants, contractors and tradespeople,
        agencies, and small business owners - anyone who bills clients for their time, services, or products.
      </p>

      <h2>What users can do with MakeInvo</h2>
      <ul>
        <li>Create a professional PDF invoice with the free invoice generator, no account required</li>
        <li>Register a free account to save clients and access invoice history</li>
        <li>Track invoice status (paid, unpaid, partially paid, overdue)</li>
        <li>Use recurring invoices and other paid-plan features on a subscription</li>
      </ul>
      <p>
        See the <Link href="/features">Features page</Link> and <Link href="/pricing">Pricing page</Link> for the
        current, authoritative list of what's included on each plan.
      </p>

      <h2>Who owns and operates MakeInvo</h2>
      <p>
        <em>
          {SITE_INFO.legalBusinessName} - this is a placeholder pending confirmation from the business owner and
          will be replaced with verified legal entity and ownership information before this page is considered
          final.
        </em>
      </p>

      <h2>Our approach to simplicity and privacy</h2>
      <p>
        We try to keep MakeInvo straightforward: a genuinely free generator you can use immediately, clear pricing
        for paid features, and plain-language policies instead of buried fine print. See our{" "}
        <Link href={LEGAL_ROUTES.security}>Security page</Link> and{" "}
        <Link href={LEGAL_ROUTES.privacy}>Privacy Policy</Link> for exactly how your data is handled.
      </p>

      <h2>Contact MakeInvo</h2>
      <p>
        Questions, feedback, or partnership enquiries are welcome via the{" "}
        <Link href={LEGAL_ROUTES.contact}>Contact page</Link> or{" "}
        <a href={`mailto:${SITE_INFO.supportEmail}`}>{SITE_INFO.supportEmail}</a>.
      </p>
    </LegalPageLayout>
  )
}
