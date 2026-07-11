const PRODUCTION_SITE_URL = "https://makeinvo.com"

// Guards against NEXT_PUBLIC_SITE_URL accidentally being left pointed at a
// local dev server (e.g. http://localhost:3000) in a deployed environment,
// which would otherwise leak into public-facing URLs like the sitemap.
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  if (!configured || /localhost|127\.0\.0\.1/.test(configured)) {
    return PRODUCTION_SITE_URL
  }
  return configured.replace(/\/$/, "")
}
