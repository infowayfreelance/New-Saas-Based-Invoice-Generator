export interface CookieConsentPreferences {
  necessary: true
  preferences: boolean
  analytics: boolean
  marketing: boolean
}

export interface CookieConsentRecord {
  preferences: CookieConsentPreferences
  timestamp: string
}

export const COOKIE_CONSENT_STORAGE_KEY = "makeinvo-cookie-consent"
export const COOKIE_CONSENT_COOKIE_NAME = "makeinvo_cookie_consent"
export const COOKIE_CONSENT_EVENT = "makeinvo-cookie-consent-change"

export const DEFAULT_CONSENT_PREFERENCES: CookieConsentPreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
}

export function readStoredConsent(): CookieConsentRecord | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CookieConsentRecord
    if (!parsed?.preferences) return null
    return parsed
  } catch {
    return null
  }
}

export function writeStoredConsent(preferences: CookieConsentPreferences): CookieConsentRecord {
  const record: CookieConsentRecord = {
    preferences: { ...preferences, necessary: true },
    timestamp: new Date().toISOString(),
  }

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record))
    } catch {
      // localStorage unavailable (private mode, disabled storage) - the
      // first-party cookie below is the fallback persistence mechanism.
    }

    const maxAgeSeconds = 60 * 60 * 24 * 365
    document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=${encodeURIComponent(
      JSON.stringify(record.preferences),
    )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`

    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: record }))
  }

  return record
}

export function hasConsent(category: keyof CookieConsentPreferences): boolean {
  if (category === "necessary") return true
  const stored = readStoredConsent()
  return stored?.preferences[category] === true
}
