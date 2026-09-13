"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CookieConsentBanner({
  onAcceptAll,
  onRejectAll,
  onManagePreferences,
}: {
  onAcceptAll: () => void
  onRejectAll: () => void
  onManagePreferences: () => void
}) {
  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/90 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="max-w-2xl">
            <h2 className="text-base font-semibold text-foreground">We value your privacy</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              We use necessary cookies to keep MakeInvo working properly. With your permission, we may also use
              optional cookies to understand website usage, improve our services, and support future marketing
              features.
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <Link href="/privacy" className="text-muted-foreground underline underline-offset-2 hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/cookie-policy" className="text-muted-foreground underline underline-offset-2 hover:text-foreground">
                Cookie Policy
              </Link>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onManagePreferences}
              className="order-3 sm:order-1"
            >
              Manage Preferences
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRejectAll}
              className="order-2"
            >
              Reject All
            </Button>
            <Button type="button" size="sm" onClick={onAcceptAll} className="order-1 sm:order-3">
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
