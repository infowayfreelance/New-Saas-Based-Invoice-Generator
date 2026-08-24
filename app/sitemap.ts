import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"

const siteUrl = getSiteUrl()

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes = [
    "",
    "/features",
    "/pricing",
    "/free-invoice",
    "/login",
    "/register",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/refund-policy",
    "/billing-disputes",
    "/cookie-policy",
    "/security",
    "/data-deletion",
    "/acceptable-use",
    "/subprocessors",
    "/affiliate-program",
    "/affiliate-disclosure",
  ]

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }))
}
