"use client"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { DesignSlider } from "@/components/invoice/design-slider"
import { FONT_OPTIONS } from "@/lib/utils/fonts"
import { Check } from "lucide-react"

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
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Design</Label>
        <DesignSlider
          value={layoutStyle}
          primaryColor={primaryColor}
          accentColor={accentColor}
          onChange={onLayoutStyleChange}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="invoice-primary-color">Primary color</Label>
          <div className="flex items-center gap-2">
            <input
              id="invoice-primary-color"
              type="color"
              value={primaryColor || "#171717"}
              onChange={(e) => onPrimaryColorChange(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent p-1"
            />
            <span className="text-sm text-muted-foreground">{primaryColor || "#171717"}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoice-accent-color">Accent color</Label>
          <div className="flex items-center gap-2">
            <input
              id="invoice-accent-color"
              type="color"
              value={accentColor || "#f5c518"}
              onChange={(e) => onAccentColorChange(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent p-1"
            />
            <span className="text-sm text-muted-foreground">{accentColor || "#f5c518"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Font</Label>
        <div className="flex flex-wrap gap-2">
          {FONT_OPTIONS.map((font) => {
            const isSelected = (fontFamily || "sans") === font.id
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => onFontFamilyChange(font.id)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg border-2 px-3 py-2 text-sm transition-colors",
                  isSelected ? "border-primary" : "border-border hover:border-primary/50",
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
    </div>
  )
}
