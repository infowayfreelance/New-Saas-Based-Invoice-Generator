"use client"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DesignSlider } from "@/components/invoice/design-slider"
import { FONT_OPTIONS } from "@/lib/utils/fonts"
import { Check, Palette, Eye } from "lucide-react"
import type { InvoiceVisibility } from "@/lib/utils/invoice"
import { getDefaultVisibility } from "@/lib/utils/invoice"

interface InvoiceStyleControlsProps {
  layoutStyle: string
  primaryColor?: string
  accentColor?: string
  fontFamily?: string
  visibility?: Partial<InvoiceVisibility>
  onLayoutStyleChange: (value: string) => void
  onPrimaryColorChange: (value: string) => void
  onAccentColorChange: (value: string) => void
  onFontFamilyChange: (value: string) => void
  onVisibilityChange?: (key: keyof InvoiceVisibility, value: boolean) => void
}

const COLOR_PRESETS = [
  { label: "Slate & Blue", primary: "#1e293b", accent: "#3b82f6" },
  { label: "Slate & Gold", primary: "#1e293b", accent: "#f5c518" },
  { label: "Midnight & Teal", primary: "#0f172a", accent: "#14b8a6" },
  { label: "Charcoal & Coral", primary: "#27272a", accent: "#fb7185" },
  { label: "Navy & Sky", primary: "#1e3a5f", accent: "#38bdf8" },
  { label: "Forest & Lime", primary: "#14532d", accent: "#a3e635" },
  { label: "Plum & Amber", primary: "#3b0764", accent: "#f59e0b" },
  { label: "Teal & Orange", primary: "#134e4a", accent: "#f97316" },
  { label: "Purple & Pink", primary: "#4c1d95", accent: "#e879f9" },
]

const VISIBILITY_LABELS: { key: keyof InvoiceVisibility; label: string }[] = [
  { key: "logo", label: "Logo" },
  { key: "projectDetails", label: "Project details" },
  { key: "fromPhone", label: "Your phone" },
  { key: "fromWebsite", label: "Your website" },
  { key: "clientPhone", label: "Client phone" },
  { key: "taxNumbers", label: "Tax / VAT numbers" },
  { key: "paymentDetails", label: "Payment details" },
  { key: "notes", label: "Notes" },
  { key: "termsAndConditions", label: "Terms & Conditions" },
  { key: "invoiceStatus", label: "Invoice status stamp" },
  { key: "footer", label: "Footer" },
]

export function InvoiceStyleControls({
  layoutStyle,
  primaryColor,
  accentColor,
  fontFamily,
  visibility,
  onLayoutStyleChange,
  onPrimaryColorChange,
  onAccentColorChange,
  onFontFamilyChange,
  onVisibilityChange,
}: InvoiceStyleControlsProps) {
  const primary = primaryColor || "#171717"
  const accent = accentColor || "#3b82f6"
  const mergedVis = { ...getDefaultVisibility(), ...visibility }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Template</Label>
        <DesignSlider value={layoutStyle} primaryColor={primary} accentColor={accent} onChange={onLayoutStyleChange} />
      </div>

      {/* Colors & Font */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-auto w-full justify-start gap-3 bg-transparent py-2.5 shadow-sm hover:shadow"
          >
            <span className="relative flex h-7 w-9 shrink-0 items-center">
              <span className="absolute left-0 h-7 w-7 rounded-full border-2 border-background shadow-sm"
                style={{ backgroundColor: primary }} />
              <span className="absolute left-3.5 h-7 w-7 rounded-full border-2 border-background shadow-sm"
                style={{ backgroundColor: accent }} />
            </span>
            <span className="flex-1 text-left">
              <span className="block text-sm font-medium leading-none">Colors &amp; font</span>
              <span className="mt-1 block text-xs font-normal text-muted-foreground">
                {FONT_OPTIONS.find((f) => f.id === (fontFamily || "sans"))?.label} font
              </span>
            </span>
            <Palette className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 space-y-5 p-5" align="start">
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Color presets
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = primary === preset.primary && accent === preset.accent
                return (
                  <button
                    key={preset.label}
                    type="button"
                    title={preset.label}
                    onClick={() => {
                      onPrimaryColorChange(preset.primary)
                      onAccentColorChange(preset.accent)
                    }}
                    className={cn(
                      "relative flex h-10 overflow-hidden rounded-md border-2 transition-colors",
                      isSelected ? "border-primary" : "border-transparent hover:border-border",
                    )}
                  >
                    <span className="h-full w-1/2" style={{ backgroundColor: preset.primary }} />
                    <span className="h-full w-1/2" style={{ backgroundColor: preset.accent }} />
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <Check className="h-4 w-4 text-white drop-shadow" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2.5 border-t pt-4">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Custom colors
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="invoice-primary-color" className="text-xs font-normal text-muted-foreground">
                  Primary
                </Label>
                <div className="flex items-center gap-2 rounded-md border px-2 py-1.5">
                  <input
                    id="invoice-primary-color"
                    type="color"
                    value={primary}
                    onChange={(e) => onPrimaryColorChange(e.target.value)}
                    className="h-6 w-6 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span className="truncate text-xs text-muted-foreground">{primary}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invoice-accent-color" className="text-xs font-normal text-muted-foreground">
                  Accent
                </Label>
                <div className="flex items-center gap-2 rounded-md border px-2 py-1.5">
                  <input
                    id="invoice-accent-color"
                    type="color"
                    value={accent}
                    onChange={(e) => onAccentColorChange(e.target.value)}
                    className="h-6 w-6 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span className="truncate text-xs text-muted-foreground">{accent}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 border-t pt-4">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Font</Label>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((font) => {
                const isSelected = (fontFamily || "sans") === font.id
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => onFontFamilyChange(font.id)}
                    className={cn(
                      "relative flex flex-col items-center gap-0.5 rounded-md border px-3 py-2 transition-colors",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    )}
                  >
                    {isSelected && <Check className="absolute right-1.5 top-1.5 h-3 w-3 text-primary" />}
                    <span className="text-base" style={{ fontFamily: font.stack }}>Aa</span>
                    <span className="text-xs text-muted-foreground">{font.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Visibility toggles */}
      {onVisibilityChange && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-auto w-full justify-start gap-3 bg-transparent py-2.5 shadow-sm hover:shadow"
            >
              <Eye className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 text-left">
                <span className="block text-sm font-medium leading-none">Show / hide sections</span>
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  Control what appears on the invoice
                </span>
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="start">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Visible on invoice
            </p>
            <div className="space-y-2.5">
              {VISIBILITY_LABELS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <Label htmlFor={`vis-${key}`} className="text-sm font-normal cursor-pointer">
                    {label}
                  </Label>
                  <Switch
                    id={`vis-${key}`}
                    checked={mergedVis[key]}
                    onCheckedChange={(checked) => onVisibilityChange(key, checked)}
                  />
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}