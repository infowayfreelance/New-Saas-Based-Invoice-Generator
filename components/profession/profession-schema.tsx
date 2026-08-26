import { getSiteUrl } from "@/lib/utils/site-url"
import type { ProfessionPageData } from "./types"

export function ProfessionSchema({ data }: { data: ProfessionPageData }) {
  const siteUrl = getSiteUrl()
  const pageUrl = `${siteUrl}/${data.slug}`

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: data.h1, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: data.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  )
}
