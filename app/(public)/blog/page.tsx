import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getSiteUrl } from "@/lib/utils/site-url"
import { BLOG_POSTS } from "@/lib/data/blog-posts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const siteUrl = getSiteUrl()
const pageUrl = `${siteUrl}/blog`

export const metadata: Metadata = {
  title: "Invoicing Blog | Guides for Freelancers & Small Businesses",
  description:
    "Practical guides on invoicing, getting paid faster and running a freelance or small business - from creating your first invoice to avoiding common billing mistakes.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Invoicing Blog | Guides for Freelancers & Small Businesses | MakeInvo",
    description:
      "Practical guides on invoicing, getting paid faster and running a freelance or small business - from creating your first invoice to avoiding common billing mistakes.",
    url: pageUrl,
    type: "website",
  },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Blog", item: pageUrl },
  ],
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">MakeInvo Blog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Practical, no-fluff guides on invoicing, getting paid faster and running a freelance or small business.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                  <Image
                    src={post.coverImage}
                    alt={post.coverImageAlt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {formatDate(post.publishedDate)} &middot; {post.readingTime}
                  </p>
                  <CardTitle className="text-xl leading-snug group-hover:text-primary">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Read the guide
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
