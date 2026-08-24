import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { LEGAL_ROUTES } from "@/lib/site-info"

export const metadata: Metadata = {
  title: "MakeInvo Subprocessors and Service Providers",
  description:
    "View the third-party infrastructure, payment, email, analytics and support providers used to operate MakeInvo.",
  alternates: { canonical: LEGAL_ROUTES.subprocessors },
}

const providers = [
  {
    provider: "Vercel Inc.",
    service: "Application hosting and deployment",
    dataType: "Request/traffic metadata needed to serve the website and application (e.g. IP address, request logs)",
    location: "Not yet confirmed for publication",
    link: "https://vercel.com/legal/privacy-policy",
  },
  {
    provider: "Supabase",
    service: "Database, and account authentication",
    dataType: "Account, client, and invoice data; authentication credentials (passwords are hashed by Supabase, not visible to MakeInvo)",
    location: "United Kingdom (eu-west-2)",
    link: "https://supabase.com/privacy",
  },
  {
    provider: "Stripe, Inc.",
    service: "Subscription payment processing (one of two supported payment methods)",
    dataType: "Payment card details, billing name/email, and subscription/payment status - handled directly by Stripe",
    location: "Processed per Stripe's own infrastructure",
    link: "https://stripe.com/privacy",
  },
  {
    provider: "PayPal, Inc.",
    service: "Subscription payment processing (one of two supported payment methods)",
    dataType: "PayPal account and payment details, and subscription status - handled directly by PayPal",
    location: "Processed per PayPal's own infrastructure",
    link: "https://www.paypal.com/privacy",
  },
  {
    provider: "Vercel Analytics",
    service: "Aggregate, cookieless website usage analytics",
    dataType: "Aggregated page-view/traffic statistics; does not use cookies as implemented on this site",
    location: "Not yet confirmed for publication",
    link: "https://vercel.com/legal/privacy-policy",
  },
]

export default function SubprocessorsPage() {
  return (
    <LegalPageLayout
      title="MakeInvo Subprocessors"
      path={LEGAL_ROUTES.subprocessors}
      intro="These are the third-party providers we use to operate MakeInvo, and the category of information each can access. This list only includes providers actually in use - not every package or tool referenced in our codebase."
      related={[
        { href: LEGAL_ROUTES.privacy, label: "Privacy Policy" },
        { href: LEGAL_ROUTES.security, label: "Security" },
      ]}
    >
      <p>
        We have not identified an active third-party email-delivery provider, error-monitoring tool, customer
        support platform, or CAPTCHA/anti-spam service in the current product, so none are listed here. If that
        changes, this page will be updated.
      </p>

      <div className="not-prose my-8 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 font-semibold">Provider</th>
              <th className="px-4 py-3 font-semibold">Service provided</th>
              <th className="px-4 py-3 font-semibold">Type of information processed</th>
              <th className="px-4 py-3 font-semibold">Processing location</th>
              <th className="px-4 py-3 font-semibold">Privacy information</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((row, i) => (
              <tr key={row.provider} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="px-4 py-3 align-top font-medium">{row.provider}</td>
                <td className="px-4 py-3 align-top text-muted-foreground">{row.service}</td>
                <td className="px-4 py-3 align-top text-muted-foreground">{row.dataType}</td>
                <td className="px-4 py-3 align-top text-muted-foreground">{row.location}</td>
                <td className="px-4 py-3 align-top">
                  <a href={row.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Privacy policy
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground">
        Our database is hosted in the United Kingdom (eu-west-2). Vercel's hosting/CDN can serve requests from
        multiple regions globally; the specific regions used have not yet been confirmed for publication here. See
        the <Link href={LEGAL_ROUTES.privacy}>Privacy Policy</Link> for how this fits into our overall data
        handling.
      </p>
    </LegalPageLayout>
  )
}
