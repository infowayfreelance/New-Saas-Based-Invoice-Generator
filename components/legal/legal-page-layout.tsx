import type { ReactNode } from "react"
import Link from "next/link"
import { getSiteUrl } from "@/lib/utils/site-url"
import { SITE_INFO } from "@/lib/site-info"

interface LegalSection {
  id: string
  title: string
}

interface RelatedLink {
  href: string
  label: string
}

interface LegalPageLayoutProps {
  title: string
  path: string
  intro?: string
  sections?: LegalSection[]
  related?: RelatedLink[]
  children: ReactNode
}

/**
 * Shared shell for every legal/policy page: breadcrumb schema, H1, a
 * consistent "Last updated" date sourced from SITE_INFO (not a build
 * timestamp), an optional table of contents for longer policies, and a
 * "Related" links row at the bottom. Deliberately has no hero imagery or
 * decorative animation - legal pages should be plain and easy to scan.
 */
export function LegalPageLayout({ title, path, intro, sections, related, children }: LegalPageLayoutProps) {
  const siteUrl = getSiteUrl()
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: title, item: `${siteUrl}${path}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span aria-current="page">{title}</span>
          </nav>

          <h1 className="mt-4 text-4xl font-bold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {SITE_INFO.legalLastUpdated}</p>

          {intro && <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">{intro}</p>}

          {sections && sections.length > 3 && (
            <nav aria-label="Table of contents" className="mt-8 rounded-xl border border-border bg-muted/30 p-5">
              <p className="text-sm font-semibold">On this page</p>
              <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-primary hover:underline">
                      {i + 1}. {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold">
            {children}
          </div>

          {related && related.length > 0 && (
            <div className="mt-12 border-t border-border pt-8">
              <p className="text-sm font-semibold">Related policies</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {related.map((link) => (
                  <Link key={link.href} href={link.href} className="text-primary hover:underline">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
