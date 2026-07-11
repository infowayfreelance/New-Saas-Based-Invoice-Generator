import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"

const siteUrl = getSiteUrl()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/app",
        "/app/",
        "/admin",
        "/admin/",
        "/billing",
        "/billing/",
        "/invoice/",
        "/auth/",
        "/api/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
