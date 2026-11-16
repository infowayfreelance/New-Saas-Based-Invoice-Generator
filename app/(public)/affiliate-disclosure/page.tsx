import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { SITE_INFO, LEGAL_ROUTES } from "@/lib/site-info"

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "Learn how MakeInvo's affiliate relationships, referral links and commission disclosures are handled.",
  alternates: { canonical: LEGAL_ROUTES.affiliateDisclosure },
}

const sections = [
  { id: "what-are", title: "What affiliate links are" },
  { id: "when-commission", title: "When MakeInvo may earn commission" },
  { id: "price", title: "Whether commission changes the user's price" },
  { id: "disclosure", title: "How affiliate relationships are disclosed" },
  { id: "independence", title: "Editorial independence" },
  { id: "program-terms", title: "Affiliate programme terms" },
  { id: "contact", title: "Contact information" },
]

export default function AffiliateDisclosurePage() {
  return (
    <LegalPageLayout
      title="Affiliate Disclosure"
      path={LEGAL_ROUTES.affiliateDisclosure}
      intro="MakeInvo runs its own affiliate programme, where approved partners can refer new customers to MakeInvo and earn a commission. This page explains how that works."
      sections={sections}
      related={[{ href: "/affiliate-program", label: "Affiliate Programme" }]}
    >
      <h2 id="what-are">1. What affiliate links are</h2>
      <p>
        An affiliate (or referral) link is a link that identifies who referred a visitor to MakeInvo, so that person
        can be credited if the visitor becomes a paying customer.
      </p>

      <h2 id="when-commission">2. When MakeInvo may earn commission</h2>
      <p>
        This disclosure covers <strong>outgoing</strong> affiliate relationships where someone else earns a
        commission for referring customers to MakeInvo, under the{" "}
        <Link href="/affiliate-program">Affiliate Programme</Link>. MakeInvo does not currently place other
        companies' paid affiliate links on this website.
      </p>

      <h2 id="price">3. Whether commission changes the user's price</h2>
      <p>
        Signing up through an affiliate link does not change the price you pay for a MakeInvo subscription. Any
        commission is paid by MakeInvo to the affiliate and is not added to your subscription cost.
      </p>

      <h2 id="disclosure">4. How affiliate relationships are disclosed</h2>
      <p>
        Content that includes an affiliate link to MakeInvo (for example, a blog post or video made by one of our
        affiliates) should disclose that relationship near the beginning of the content, not only in a footer -
        this is a requirement of our{" "}
        <Link href="/affiliate-program">Affiliate Programme</Link> terms for our partners.
      </p>

      <h2 id="independence">5. Editorial independence</h2>
      <p>
        Being part of the MakeInvo affiliate programme does not entitle a partner to control or influence MakeInvo's
        own product decisions, pricing, or editorial content on makeinvo.com.
      </p>

      <h2 id="program-terms">6. Affiliate programme terms</h2>
      <p>
        Full eligibility, commission, and payout terms for becoming a MakeInvo affiliate are described on the{" "}
        <Link href="/affiliate-program">Affiliate Programme</Link> page.
      </p>

      <h2 id="contact">7. Contact information</h2>
      <p>
        Questions about the affiliate programme or this disclosure:{" "}
        <a href={`mailto:${SITE_INFO.supportEmail}`}>{SITE_INFO.supportEmail}</a> or the{" "}
        <Link href={LEGAL_ROUTES.contact}>Contact page</Link>.
      </p>
    </LegalPageLayout>
  )
}
