/**
 * Single source of truth for MakeInvo's verified company/contact details,
 * used across every legal and policy page so the name, emails, and dates
 * stay consistent. Fields marked "owner confirmation required" are
 * intentionally left as visible placeholders — do not invent a legal name,
 * address, company number, or support hours. See the audit notes in the
 * PR description for what was confirmed directly from the codebase vs. what
 * still needs the business owner to confirm before these pages are
 * considered final.
 */

export const SITE_INFO = {
  productName: "MakeInvo",
  tradingName: "MakeInvo",

  // Not present anywhere in the codebase, environment, or existing pages -
  // cannot be inferred from product behavior. Do not publish without this.
  legalBusinessName: "[LEGAL BUSINESS NAME REQUIRED — OWNER CONFIRMATION NEEDED]",
  businessType: "[BUSINESS TYPE REQUIRED — OWNER CONFIRMATION NEEDED]",
  companyNumber: "[COMPANY NUMBER REQUIRED, IF APPLICABLE — OWNER CONFIRMATION NEEDED]",
  registeredCountry: "[REGISTERED COUNTRY REQUIRED — OWNER CONFIRMATION NEEDED]",
  registeredAddress: "[REGISTERED / BUSINESS ADDRESS REQUIRED — OWNER CONFIRMATION NEEDED]",

  // Confirmed: used consistently across the existing site (footer, schema,
  // Contact & Support copy) prior to this change.
  supportEmail: "support@makeinvo.com",
  // Not confirmed as a separate live inbox - falling back to the general
  // support address until the owner confirms a dedicated one exists.
  privacyEmail: "support@makeinvo.com",
  securityEmail: "support@makeinvo.com",
  billingEmail: "support@makeinvo.com",

  supportHours: "[SUPPORT HOURS REQUIRED — OWNER CONFIRMATION NEEDED]",
  responseTime: "[TYPICAL RESPONSE TIME REQUIRED — OWNER CONFIRMATION NEEDED]",

  // The date these policy pages were actually (re)written. Update this by
  // hand when the wording changes materially - do not wire it to a build
  // timestamp, since that would silently "update" the date on every deploy
  // even when nothing legally relevant changed.
  legalLastUpdated: "November 2026",
} as const

export const LEGAL_ROUTES = {
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  refundPolicy: "/refund-policy",
  cookiePolicy: "/cookie-policy",
  security: "/security",
  dataDeletion: "/data-deletion",
  acceptableUse: "/acceptable-use",
  subprocessors: "/subprocessors",
  affiliateDisclosure: "/affiliate-disclosure",
} as const
