"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, ChevronDown, ChevronUp } from "lucide-react"
import type { InvoiceFormData } from "@/lib/utils/invoice"

type FromMode = "settings" | "manual"

interface InvoiceFromSectionProps {
  isPaid: boolean
  alwaysManual?: boolean
  fromName: string
  fromEmail: string
  fromAddress: string
  fromPhone?: string
  fromWebsite?: string
  fromBusinessReg?: string
  fromTaxId?: string
  logoUrl?: string
  settingsSnapshot: { name: string; email: string; address: string }
  onChange: (field: keyof InvoiceFormData, value: string) => void
  onLogoChange?: (logoUrl: string | undefined) => void
}

export function InvoiceFromSection({
  isPaid,
  alwaysManual = false,
  fromName,
  fromEmail,
  fromAddress,
  fromPhone,
  fromWebsite,
  fromBusinessReg,
  fromTaxId,
  logoUrl,
  settingsSnapshot,
  onChange,
  onLogoChange,
}: InvoiceFromSectionProps) {
  const [mode, setMode] = useState<FromMode>("settings")
  const [showExtra, setShowExtra] = useState(false)
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
        {/* Logo upload — available for all users */}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Business logo"
                className="h-14 w-auto max-w-[140px] rounded-md border border-border object-contain"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="absolute inset-0 hidden rounded-md bg-black/40 text-xs font-medium text-white group-hover:flex items-center justify-center"
              >
                Change
              </button>
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
              <span>Add Logo</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">From (Your Business)</CardTitle>
          {isPaid && !alwaysManual && (
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
                Manual
              </Button>
            </div>
          )}
        </div>
        <CardDescription className="text-xs">
          {isManual ? "Enter sender details for this invoice" : "Update these in Settings"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fromName">Business / Full Name</Label>
          <Input
            id="fromName"
            value={fromName}
            disabled={!isManual}
            className={!isManual ? "bg-muted" : ""}
            onChange={(e) => onChange("fromName", e.target.value)}
            placeholder="Your name or business name"
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
            placeholder="you@example.com"
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
            placeholder="Street, City, Postcode, Country"
          />
        </div>

        {/* Optional extra fields — collapsed by default */}
        <button
          type="button"
          onClick={() => setShowExtra((v) => !v)}
          className="flex w-full items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showExtra ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {showExtra ? "Hide optional fields" : "Phone, website, tax ID…"}
        </button>

        {showExtra && (
          <div className="space-y-4 pt-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fromPhone">Phone (optional)</Label>
                <Input
                  id="fromPhone"
                  type="tel"
                  value={fromPhone || ""}
                  onChange={(e) => onChange("fromPhone", e.target.value)}
                  placeholder="+1 555 000 0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromWebsite">Website (optional)</Label>
                <Input
                  id="fromWebsite"
                  type="url"
                  value={fromWebsite || ""}
                  onChange={(e) => onChange("fromWebsite", e.target.value)}
                  placeholder="https://yoursite.com"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fromTaxId">Tax / VAT Number (optional)</Label>
                <Input
                  id="fromTaxId"
                  value={fromTaxId || ""}
                  onChange={(e) => onChange("fromTaxId", e.target.value)}
                  placeholder="GB 123 4567 89"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromBusinessReg">Business Reg. No. (optional)</Label>
                <Input
                  id="fromBusinessReg"
                  value={fromBusinessReg || ""}
                  onChange={(e) => onChange("fromBusinessReg", e.target.value)}
                  placeholder="12345678"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}