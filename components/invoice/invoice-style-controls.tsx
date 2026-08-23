"use client"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DesignSlider } from "@/components/invoice/design-slider"
import { FONT_OPTIONS } from "@/lib/utils/fonts"
import { Check, Palette } from "lucide-react"

interface InvoiceStyleControlsProps {
  layoutStyle: string
  primaryColor?: string
  accentColor?: string
  fontFamily?: string
  onLayoutStyleChange: (value: string) => void
  onPrimaryColorChange: (value: string) => void
  onAccentColorChange: (value: string) => void
  onFontFamilyChange: (value: string) => void
}

const COLOR_PRESETS = [
  { label: "Slate & Gold", primary: "#1e293b", accent: "#f5c518" },
  { label: "Midnight & Teal", primary: "#0f172a", accent: "#14b8a6" },
  { label: "Charcoal & Coral", primary: "#27272a", accent: "#fb7185" },
  { label: "Navy & Sky", primary: "#1e3a5f", accent: "#38bdf8" },
  { label: "Forest & Lime", primary: "#14532d", accent: "#a3e635" },
  { label: "Plum & Amber", primary: "#3b0764", accent: "#f59e0b" },
]

export function InvoiceStyleControls({
  layoutStyle,
  primaryColor,
  accentColor,
  fontFamily,
  onLayoutStyleChange,
  onPrimaryColorChange,
  onAccentColorChange,
  onFontFamilyChange,
}: InvoiceStyleControlsProps) {
  const primary = primaryColor || "#171717"
  const accent = accentColor || "#f5c518"

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Design</Label>
        <DesignSlider value={layoutStyle} primaryColor={primary} accentColor={accent} onChange={onLayoutStyleChange} />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="w-full justify-start gap-3 bg-transparent">
            <span className="flex shrink-0 overflow-hidden rounded-full border">
              <span className="h-5 w-5" style={{ backgroundColor: primary }} />
              <span className="h-5 w-5" style={{ backgroundColor: accent }} />
            </span>
            <span className="flex-1 text-left">Customize colors &amp; font</span>
            <Palette className="h-4 w-4 text-muted-foreground" />
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
                      "relative flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    )}
                    style={{ fontFamily: font.stack }}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                    {font.label}
                  </button>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
