import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout } from "@/components/legal/legal-page-layout"
import { SITE_INFO, LEGAL_ROUTES } from "@/lib/site-info"

export const metadata: Metadata = {
  title: "Security and Data Protection | MakeInvo",
  description:
    "Learn about the practical security measures MakeInvo uses to protect accounts, invoices, client information and shared invoice links.",
  alternates: { canonical: LEGAL_ROUTES.security },
}

const sections = [
  { id: "overview", title: "Security overview" },
  { id: "transit", title: "Encryption in transit" },
  { id: "at-rest", title: "Encryption at rest" },
  { id: "auth", title: "Authentication and account access" },
  { id: "passwords", title: "Password handling" },
  { id: "access-controls", title: "Access controls" },
  { id: "infrastructure", title: "Database and infrastructure security" },
  { id: "shared-links", title: "Shared invoice link security" },
  { id: "backups", title: "Backups and recovery" },
  { id: "monitoring", title: "Monitoring and logging" },
  { id: "vulnerability", title: "Vulnerability management" },
  { id: "third-party", title: "Third-party service providers" },
  { id: "user-responsibilities", title: "User security responsibilities" },
  { id: "reporting", title: "Reporting a security issue" },
  { id: "disclosure", title: "Responsible disclosure" },
]

export default function SecurityPage() {
  return (
    <LegalPageLayout
      title="Security at MakeInvo"
      path={LEGAL_ROUTES.security}
      intro="This page describes, in plain language, the practical measures MakeInvo uses to help protect your account, invoices, and client information."
      sections={sections}
      related={[
        { href: LEGAL_ROUTES.privacy, label: "Privacy Policy" },
        { href: LEGAL_ROUTES.contact, label: "Contact" },
      ]}
    >
      <h2 id="overview">1. Security overview</h2>
      <p>
        MakeInvo is built on established, security-audited infrastructure providers - Vercel for hosting and
        Supabase for our database and authentication - rather than custom, self-managed servers. We combine that
        with our own access controls and secure coding practices.
      </p>

      <h2 id="transit">2. Encryption in transit</h2>
      <p>
        Every connection to makeinvo.com and the MakeInvo application is encrypted using HTTPS/TLS, so data
        travelling between your browser and our servers can't be read in transit.
      </p>

      <h2 id="at-rest">3. Encryption at rest</h2>
      <p>
        Our database provider, Supabase (built on PostgreSQL), encrypts data at rest as part of its standard
        managed-infrastructure offering. We have not independently audited or certified this beyond relying on our
        provider's own security documentation, so we describe it here rather than claiming a specific certification
        we do not hold.
      </p>

      <h2 id="auth">4. Authentication and account access</h2>
      <p>
        Account sign-in is handled by Supabase Auth. Your invoices, clients, and account data are only accessible
        after you authenticate - each request is checked against your account, so one user cannot see another
        user's data through the application.
      </p>

      <h2 id="passwords">5. Password handling</h2>
      <p>
        MakeInvo does not store your raw password. Password storage and verification are handled by our
        authentication provider using industry-standard hashing, not by MakeInvo's own application code.
      </p>

      <h2 id="access-controls">6. Access controls</h2>
      <p>
        Application code enforces that every invoice, client, and account record is scoped to the signed-in user
        who owns it. A shared invoice link only exposes the single invoice it points to - never your client list,
        other invoices, or your dashboard.
      </p>

      <h2 id="infrastructure">7. Database and infrastructure security</h2>
      <p>
        We do not publish detailed internal infrastructure or architecture information, as doing so could create
        unnecessary risk. In general terms: our database and hosting are provided by established third-party
        infrastructure companies (see the <Link href={LEGAL_ROUTES.subprocessors}>Subprocessors page</Link>), and
        access to production systems is restricted.
      </p>

      <h2 id="shared-links">8. Shared invoice link security</h2>
      <p>
        A shared invoice link uses a long, hard-to-guess identifier and is not indexed by search engines or
        listed anywhere publicly discoverable. Anyone who has the exact link can view that one invoice - do not
        share an invoice link anywhere it could be seen by someone other than the intended recipient.
      </p>

      <h2 id="backups">9. Backups and recovery</h2>
      <p>
        Our database provider maintains its own backup and recovery processes as part of its managed hosting
        service. MakeInvo does not operate a separate, custom backup system of its own.
      </p>

      <h2 id="monitoring">10. Monitoring and logging</h2>
      <p>
        Our hosting and database providers log standard request and error information as part of operating the
        service reliably and securely. We use this operationally; we do not currently run a dedicated third-party
        error-monitoring or security-information tool beyond our providers' built-in tooling.
      </p>

      <h2 id="vulnerability">11. Vulnerability management</h2>
      <p>
        We keep our application dependencies up to date and address security issues as they're identified,
        including issues reported through the responsible-disclosure process below.
      </p>

      <h2 id="third-party">12. Third-party service providers</h2>
      <p>
        MakeInvo relies on a small number of established providers (hosting, database/auth, and payments) rather
        than building everything in-house. See the full list on the{" "}
        <Link href={LEGAL_ROUTES.subprocessors}>Subprocessors page</Link>.
      </p>

      <h2 id="user-responsibilities">13. User security responsibilities</h2>
      <ul>
        <li>Use a strong, unique password for your MakeInvo account</li>
        <li>Never share your password or reuse it across other sites</li>
        <li>Sign out of MakeInvo on shared or public devices</li>
        <li>Only share invoice links with their intended recipient</li>
        <li>Report anything that looks suspicious using the process below</li>
      </ul>

      <h2 id="reporting">14. Reporting a security issue</h2>
      <p>
        If you discover a security vulnerability, please report it to{" "}
        <a href={`mailto:${SITE_INFO.securityEmail}`}>{SITE_INFO.securityEmail}</a> with enough detail for us to
        reproduce and understand the issue.
      </p>

      <h2 id="disclosure">15. Responsible disclosure</h2>
      <p>
        Please report issues privately and give us a reasonable opportunity to investigate and fix them before any
        public disclosure. When testing, only use your own MakeInvo account and test data - do not access, modify,
        or download another user's data, and do not run automated scans or load-testing against the production
        service without contacting us first. We do not currently commit to a specific response-time guarantee for
        security reports, but we treat them as a priority.
      </p>
    </LegalPageLayout>
  )
}
