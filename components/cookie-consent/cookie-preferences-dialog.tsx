"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import type { CookieConsentPreferences } from "@/lib/cookie-consent"

interface CookieCategory {
  key: keyof Omit<CookieConsentPreferences, "necessary">
  title: string
  description: string
}

const OPTIONAL_CATEGORIES: CookieCategory[] = [
  {
    key: "preferences",
    title: "Preferences",
    description: "Used to remember user interface and website preferences.",
  },
  {
    key: "analytics",
    title: "Analytics",
    description: "Used to understand how visitors use MakeInvo and improve the website.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description: "Used for advertising, conversion tracking, and remarketing if these tools are added in future.",
  },
]

export function CookiePreferencesDialog({
  open,
  onOpenChange,
  preferences,
  onSave,
  onAcceptAll,
  onRejectAll,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  preferences: CookieConsentPreferences
  onSave: (preferences: CookieConsentPreferences) => void
  onAcceptAll: () => void
  onRejectAll: () => void
}) {
  const [draft, setDraft] = useState<CookieConsentPreferences>(preferences)

  useEffect(() => {
    if (open) setDraft(preferences)
  }, [open, preferences])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage cookie preferences</DialogTitle>
          <DialogDescription>
            Choose which optional cookies MakeInvo can use. You can change these settings at any time from the
            Cookie Settings link in the footer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Necessary Cookies</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Used for login, security, sessions, and essential website functionality.
              </p>
            </div>
            <span className="mt-0.5 shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Always Active
            </span>
          </div>

          {OPTIONAL_CATEGORIES.map((category, index) => (
            <div key={category.key}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
                <div>
                  <label htmlFor={`cookie-toggle-${category.key}`} className="text-sm font-semibold text-foreground">
                    {category.title}
                  </label>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                </div>
                <Switch
                  id={`cookie-toggle-${category.key}`}
                  checked={draft[category.key]}
                  onCheckedChange={(checked) => setDraft((prev) => ({ ...prev, [category.key]: checked }))}
                  aria-label={`Toggle ${category.title.toLowerCase()} cookies`}
                  className="mt-0.5 shrink-0"
                />
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onRejectAll} className="sm:order-1">
            Reject All
          </Button>
          <Button type="button" variant="outline" onClick={onAcceptAll} className="sm:order-2">
            Accept All
          </Button>
          <Button type="button" onClick={() => onSave(draft)} className="sm:order-3">
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
