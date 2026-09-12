import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"

const siteUrl = getSiteUrl()

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes = [
    "",
    "/features",
    "/pricing",
    "/invoice-templates",
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
    "/invoice-generator-for-freelancers",
    "/invoice-generator-for-contractors",
    "/invoice-generator-for-consultants",
    "/invoice-generator-for-designers",
    "/invoice-generator-for-photographers",
    "/invoice-generator-for-agencies",
    "/invoice-generator-for-small-businesses",
    "/invoice-generator-for-tradespeople",
    "/invoice-generator-for-self-employed",
  ]

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }))
}
