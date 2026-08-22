"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Design {
  id: string
  label: string
}

export const INVOICE_DESIGNS: Design[] = [
  { id: "classic", label: "Simple" },
  { id: "banner", label: "Banner" },
]

interface DesignSliderProps {
  value: string
  primaryColor?: string
  accentColor?: string
  onChange: (value: string) => void
}

export function DesignSlider({ value, primaryColor, accentColor, onChange }: DesignSliderProps) {
  const dark = primaryColor || "#171717"
  const accent = accentColor || "#171717"

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {INVOICE_DESIGNS.map((design) => {
        const isSelected = value === design.id || (!value && design.id === "classic")
        return (
          <button
            key={design.id}
            type="button"
            onClick={() => onChange(design.id)}
            className={cn(
              "relative flex w-28 shrink-0 flex-col items-center gap-1.5 rounded-lg border-2 p-2 transition-colors",
              isSelected ? "border-primary" : "border-border hover:border-primary/50",
            )}
          >
            {isSelected && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-2.5 w-2.5" />
              </span>
            )}
            <div className="h-32 w-full overflow-hidden rounded bg-white shadow-sm">
              {design.id === "banner" ? (
                <BannerThumbnail dark={dark} accent={accent} />
              ) : (
                <ClassicThumbnail dark={dark} accent={accent} />
              )}
            </div>
            <span className="text-xs font-medium">{design.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function ClassicThumbnail({ dark, accent }: { dark: string; accent: string }) {
  return (
    <div className="flex h-full w-full flex-col p-2">
      <div className="flex items-start justify-between">
        <div className="h-2 w-8 rounded-sm" style={{ backgroundColor: accent }} />
        <div className="space-y-0.5">
          <div className="h-1 w-6 rounded-sm bg-gray-300" />
          <div className="h-1 w-8 rounded-sm bg-gray-200" />
        </div>
      </div>
      <div className="mt-2 h-px w-full bg-gray-200" />
      <div className="mt-2 flex-1 space-y-1">
        <div className="h-1 w-full rounded-sm bg-gray-100" style={{ borderBottom: `1px solid ${accent}` }} />
        <div className="h-1 w-full rounded-sm bg-gray-100" />
        <div className="h-1 w-3/4 rounded-sm bg-gray-100" />
        <div className="h-1 w-full rounded-sm bg-gray-100" />
      </div>
      <div className="mt-1 flex justify-end">
        <div className="h-2 w-10 rounded-sm" style={{ backgroundColor: dark }} />
      </div>
    </div>
  )
}

function BannerThumbnail({ dark, accent }: { dark: string; accent: string }) {
  return (
    <div className="flex h-full w-full flex-col p-2">
      <div className="h-1.5 w-6 rounded-sm bg-gray-300" />
      <div className="mt-1.5 flex items-center gap-1">
        <div className="h-1 flex-1 rounded-sm" style={{ backgroundColor: accent }} />
        <div className="h-2 w-8 rounded-sm bg-gray-700" />
      </div>
      <div className="mt-2 h-2 w-full rounded-sm" style={{ backgroundColor: dark }} />
      <div className="mt-1 flex-1 space-y-1">
        <div className="h-1 w-full rounded-sm bg-gray-100" />
        <div className="h-1 w-full rounded-sm bg-gray-200" />
        <div className="h-1 w-3/4 rounded-sm bg-gray-100" />
      </div>
      <div className="mt-1 h-2 w-full rounded-sm" style={{ backgroundColor: accent }} />
    </div>
  )
}
