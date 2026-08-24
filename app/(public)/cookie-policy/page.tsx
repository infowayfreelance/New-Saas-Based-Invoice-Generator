import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { SITE_INFO, LEGAL_ROUTES } from "@/lib/site-info"

export const metadata: Metadata = {
  title: "Cookie Policy | MakeInvo",
  description:
    "Learn which cookies and similar technologies MakeInvo uses for security, authentication, preferences, analytics and payments.",
  alternates: { canonical: LEGAL_ROUTES.cookiePolicy },
}

const sections = [
  { id: "what-are-cookies", title: "What cookies are" },
  { id: "necessary", title: "Strictly necessary cookies" },
  { id: "auth", title: "Authentication and security cookies" },
  { id: "preference", title: "Preference cookies" },
  { id: "analytics", title: "Analytics cookies" },
  { id: "payment", title: "Payment-provider cookies" },
  { id: "affiliate", title: "Affiliate or marketing cookies" },
  { id: "third-party", title: "Third-party cookies" },
  { id: "duration", title: "Cookie duration" },
  { id: "managing", title: "How users manage consent" },
  { id: "browser-controls", title: "Browser controls" },
  { id: "updates", title: "Policy updates" },
  { id: "contact", title: "Contact information" },
]

const cookieTable = [
  {
    name: "sb-access-token / sb-refresh-token (naming varies by project)",
    provider: "Supabase Auth (MakeInvo's authentication provider)",
    purpose: "Keeps you signed in to your MakeInvo account between visits",
    category: "Strictly necessary",
    expiry: "Session / short-lived, refreshed automatically while you're signed in",
    party: "First-party (set by makeinvo.com, issued by our authentication provider)",
  },
  {
    name: "sidebar_state (or similar UI-state cookie)",
    provider: "MakeInvo application",
    purpose: "Remembers whether your dashboard sidebar is expanded or collapsed",
    category: "Preference / functional",
    expiry: "Persistent, until changed or cleared",
    party: "First-party",
  },
  {
    name: "Stripe / PayPal checkout cookies",
    provider: "Stripe, PayPal",
    purpose: "Set on Stripe's or PayPal's own hosted checkout/portal pages to process your subscription payment securely",
    category: "Strictly necessary (payment)",
    expiry: "Set and controlled by Stripe/PayPal, not by MakeInvo",
    party: "Third-party (Stripe.com / PayPal.com domains during checkout)",
  },
]

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      path={LEGAL_ROUTES.cookiePolicy}
      intro="This page lists the cookies and similar technologies MakeInvo actually uses. It does not list technologies we don't use."
      sections={sections}
      related={[
        { href: LEGAL_ROUTES.privacy, label: "Privacy Policy" },
        { href: LEGAL_ROUTES.security, label: "Security" },
      ]}
    >
      <h2 id="what-are-cookies">1. What cookies are</h2>
      <p>
        Cookies are small text files stored in your browser that let a website remember information between visits,
        such as whether you're signed in.
      </p>

      <h2 id="necessary">2. Strictly necessary cookies</h2>
      <p>
        These cookies are required for MakeInvo to function - primarily keeping you signed in - and cannot be
        switched off without breaking core features like your dashboard.
      </p>

      <h2 id="auth">3. Authentication and security cookies</h2>
      <p>
        MakeInvo uses Supabase Auth for account sign-in. Supabase sets a session cookie in your browser so the
        server can recognize you're signed in on each request, instead of asking you to log in on every page.
      </p>

      <h2 id="preference">4. Preference cookies</h2>
      <p>
        A small cookie remembers interface preferences, such as whether the dashboard sidebar is expanded. This is
        not used for tracking or advertising.
      </p>

      <h2 id="analytics">5. Analytics cookies</h2>
      <p>
        MakeInvo uses Vercel Analytics for aggregate website usage statistics (for example, how many people visit a
        page). Vercel's Web Analytics, as implemented on this site, does not use cookies - it measures traffic
        without setting a cookie in your browser.
      </p>

      <h2 id="payment">6. Payment-provider cookies</h2>
      <p>
        When you subscribe to a paid plan, checkout and subscription management happen on Stripe's or PayPal's own
        hosted pages. Those providers may set their own cookies on their domains during that process, governed by
        their own cookie and privacy policies, not by MakeInvo.
      </p>

      <h2 id="affiliate">7. Affiliate or marketing cookies</h2>
      <p>
        MakeInvo's affiliate program is currently an informational page describing the program; the website does
        not currently set an affiliate-tracking or marketing cookie. If cookie-based affiliate tracking is added in
        the future, this page will be updated to describe it and, if required, a consent option will be added
        before it is set.
      </p>

      <h2 id="third-party">8. Third-party cookies</h2>
      <p>
        Aside from cookies set directly by Stripe or PayPal during checkout (Section 6), MakeInvo does not currently
        embed third-party advertising, social-media, or tracking scripts that set cookies.
      </p>

      <h2 id="duration">9. Cookie duration</h2>
      <p>See the "Expiry" column in the table above for how long each cookie we set persists.</p>

      <h2 id="managing">10. How users manage consent</h2>
      <p>
        Because MakeInvo currently only sets strictly necessary and functional cookies (no advertising, tracking,
        or non-essential analytics cookies), a cookie-consent banner is not shown. If that changes, we will add a
        consent banner that lets you accept or reject non-essential cookies by category before they are set, and
        this page will be updated accordingly.
      </p>

      <h2 id="browser-controls">11. Browser controls</h2>
      <p>
        You can block or delete cookies through your browser settings at any time. Blocking the authentication
        cookie will sign you out and prevent staying signed in to your MakeInvo account.
      </p>

      <h2 id="updates">12. Policy updates</h2>
      <p>
        We will update this page if the cookies MakeInvo sets change. The "Last updated" date at the top reflects
        the last material change.
      </p>

      <h2 id="contact">13. Contact information</h2>
      <p>
        Questions about cookies: <a href={`mailto:${SITE_INFO.privacyEmail}`}>{SITE_INFO.privacyEmail}</a> or the{" "}
        <Link href={LEGAL_ROUTES.contact}>Contact page</Link>.
      </p>

      <div className="not-prose my-10 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 font-semibold">Cookie</th>
              <th className="px-4 py-3 font-semibold">Provider</th>
              <th className="px-4 py-3 font-semibold">Purpose</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Expiry</th>
              <th className="px-4 py-3 font-semibold">Party</th>
            </tr>
          </thead>
          <tbody>
            {cookieTable.map((row, i) => (
              <tr key={row.name} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="px-4 py-3 align-top font-medium">{row.name}</td>
                <td className="px-4 py-3 align-top text-muted-foreground">{row.provider}</td>
                <td className="px-4 py-3 align-top text-muted-foreground">{row.purpose}</td>
                <td className="px-4 py-3 align-top text-muted-foreground">{row.category}</td>
                <td className="px-4 py-3 align-top text-muted-foreground">{row.expiry}</td>
                <td className="px-4 py-3 align-top text-muted-foreground">{row.party}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LegalPageLayout>
  )
}
