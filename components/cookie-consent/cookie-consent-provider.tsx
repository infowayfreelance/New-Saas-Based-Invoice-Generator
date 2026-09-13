"use client"

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import {
  DEFAULT_CONSENT_PREFERENCES,
  readStoredConsent,
  writeStoredConsent,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent"
import { CookieConsentContext } from "./cookie-consent-context"
import { CookieConsentBanner } from "./cookie-consent-banner"
import { CookiePreferencesDialog } from "./cookie-preferences-dialog"

const ACCEPT_ALL_PREFERENCES: CookieConsentPreferences = {
  necessary: true,
  preferences: true,
  analytics: true,
  marketing: true,
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [hasStoredChoice, setHasStoredChoice] = useState(true)
  const [preferences, setPreferences] = useState<CookieConsentPreferences>(DEFAULT_CONSENT_PREFERENCES)
  const [showBanner, setShowBanner] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    const stored = readStoredConsent()
    if (stored) {
      setPreferences(stored.preferences)
      setHasStoredChoice(true)
      setShowBanner(false)
    } else {
      setHasStoredChoice(false)
      setShowBanner(true)
    }
  }, [])

  const persist = useCallback((next: CookieConsentPreferences) => {
    const record = writeStoredConsent(next)
    setPreferences(record.preferences)
    setHasStoredChoice(true)
    setShowBanner(false)
    setShowDialog(false)
  }, [])

  const handleAcceptAll = useCallback(() => persist(ACCEPT_ALL_PREFERENCES), [persist])
  const handleRejectAll = useCallback(
    () => persist({ ...DEFAULT_CONSENT_PREFERENCES }),
    [persist],
  )
  const handleSave = useCallback((next: CookieConsentPreferences) => persist(next), [persist])

  const openPreferences = useCallback(() => setShowDialog(true), [])

  const contextValue = useMemo(() => ({ openPreferences }), [openPreferences])

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}

      {hasStoredChoice === false && showBanner && (
        <CookieConsentBanner
          onAcceptAll={handleAcceptAll}
          onRejectAll={handleRejectAll}
          onManagePreferences={() => setShowDialog(true)}
        />
      )}

      <CookiePreferencesDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        preferences={preferences}
        onSave={handleSave}
        onAcceptAll={handleAcceptAll}
        onRejectAll={handleRejectAll}
      />
    </CookieConsentContext.Provider>
  )
}
