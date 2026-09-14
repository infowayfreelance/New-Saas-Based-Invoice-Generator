"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"

type FromMode = "settings" | "manual"

interface InvoiceFromSectionProps {
  isPaid: boolean
  /**
   * No account to lock these fields to (e.g. the homepage demo generator) -
   * skip the Settings/Manual toggle entirely and just show plain, always-
   * editable fields.
   */
  alwaysManual?: boolean
  fromName: string
  fromEmail: string
  fromAddress: string
  logoUrl?: string
  settingsSnapshot: { name: string; email: string; address: string }
  onChange: (field: "fromName" | "fromEmail" | "fromAddress", value: string) => void
  onLogoChange?: (logoUrl: string | undefined) => void
}

/**
 * Paid plans can toggle between the business details saved in Settings
 * (locked, auto-filled) and typing different details manually for a single
 * invoice. Free/guest users only ever see the auto-filled Settings values,
 * unless there's no account at all (alwaysManual), in which case every
 * field is simply editable.
 */
export function InvoiceFromSection({
  isPaid,
  alwaysManual = false,
  fromName,
  fromEmail,
  fromAddress,
  logoUrl,
  settingsSnapshot,
  onChange,
  onLogoChange,
}: InvoiceFromSectionProps) {
  const [mode, setMode] = useState<FromMode>("settings")
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onLogoChange?.(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    onLogoChange?.(undefined)
    if (logoInputRef.current) logoInputRef.current.value = ""
  }

  const handleModeChange = (nextMode: FromMode) => {
    if (nextMode === "settings") {
      onChange("fromName", settingsSnapshot.name)
      onChange("fromEmail", settingsSnapshot.email)
      onChange("fromAddress", settingsSnapshot.address)
    }
    setMode(nextMode)
  }

  const isManual = alwaysManual || (isPaid && mode === "manual")

  return (
    <Card>
      <CardHeader className="pb-4">
        {/* Logo upload — top-left of the From card, gated to paid plans */}
        {isPaid && (
          <div className="mb-3">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoFile}
              aria-label="Upload business logo"
            />
            {logoUrl ? (
              <div className="group relative inline-block">
                <img
                  src={logoUrl}
                  alt="Business logo"
                  className="h-14 w-auto max-w-[140px] rounded-md border border-border object-contain"
                />
                {/* Change overlay — rendered first so the remove button stacks above it */}
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute inset-0 hidden rounded-md bg-black/40 text-xs font-medium text-white group-hover:flex items-center justify-center"
                >
                  Change
                </button>
                {/* Remove button — z-10 keeps it above the Change overlay */}
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -right-2 -top-2 z-10 hidden h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
                  aria-label="Remove logo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="flex h-14 w-[140px] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-muted/40 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                <ImagePlus className="h-4 w-4" />
                <span>Add Your Logo</span>
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">From (Your Business)</CardTitle>
          {isPaid && (
            <div className="flex gap-1 rounded-md border p-0.5 text-xs">
              <Button
                type="button"
                size="sm"
                variant={mode === "settings" ? "default" : "ghost"}
                className="h-7 px-2 text-xs"
                onClick={() => handleModeChange("settings")}
              >
                Use Settings
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "manual" ? "default" : "ghost"}
                className="h-7 px-2 text-xs"
                onClick={() => handleModeChange("manual")}
              >
                Enter Manually
              </Button>
            </div>
          )}
        </div>
        <CardDescription className="text-xs">
          {isManual ? "Type the sender details for this invoice only" : "Update these details in Settings"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fromName">Business Name</Label>
          <Input
            id="fromName"
            value={fromName}
            disabled={!isManual}
            className={!isManual ? "bg-muted" : ""}
            onChange={(e) => onChange("fromName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fromEmail">Email</Label>
          <Input
            id="fromEmail"
            type="email"
            value={fromEmail}
            disabled={!isManual}
            className={!isManual ? "bg-muted" : ""}
            onChange={(e) => onChange("fromEmail", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fromAddress">Address</Label>
          <Textarea
            id="fromAddress"
            value={fromAddress}
            disabled={!isManual}
            className={!isManual ? "bg-muted" : ""}
            rows={3}
            onChange={(e) => onChange("fromAddress", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
