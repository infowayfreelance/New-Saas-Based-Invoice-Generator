"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Design {
  id: string
  label: string
}

export const INVOICE_DESIGNS: Design[] = [
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
  { id: "classic", label: "Classic" },
  { id: "bold", label: "Bold" },
  { id: "creative", label: "Creative" },
  { id: "compact", label: "Compact" },
]

interface DesignSliderProps {
  value: string
  primaryColor?: string
  accentColor?: string
  onChange: (value: string) => void
}

export function DesignSlider({ value, primaryColor, accentColor, onChange }: DesignSliderProps) {
  const dark = primaryColor || "#171717"
  const accent = accentColor || "#3b82f6"

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
              "relative flex w-24 shrink-0 flex-col items-center gap-1.5 rounded-lg border-2 p-2 transition-colors",
              isSelected ? "border-primary" : "border-border hover:border-primary/50",
            )}
          >
            {isSelected && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-2.5 w-2.5" />
              </span>
            )}
            <div className="h-28 w-full overflow-hidden rounded bg-white shadow-sm">
              {design.id === "classic" && <ClassicThumbnail dark={dark} accent={accent} />}
              {design.id === "modern" && <ModernThumbnail dark={dark} accent={accent} />}
              {design.id === "minimal" && <MinimalThumbnail dark={dark} accent={accent} />}
              {design.id === "bold" && <BoldThumbnail dark={dark} accent={accent} />}
              {design.id === "creative" && <CreativeThumbnail dark={dark} accent={accent} />}
              {design.id === "compact" && <CompactThumbnail dark={dark} accent={accent} />}
            </div>
            <span className="text-xs font-medium">{design.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Thumbnails ───────────────────────────────────────────────────────────────

function ClassicThumbnail({ dark, accent }: { dark: string; accent: string }) {
  return (
    <div className="flex h-full w-full flex-col p-2">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <div className="h-2 w-8 rounded-sm font-bold" style={{ backgroundColor: accent }} />
          <div className="h-0.5 w-5 rounded-sm bg-gray-300" />
        </div>
        <div className="space-y-0.5 text-right">
          <div className="h-0.5 w-6 rounded-sm bg-gray-300 ml-auto" />
          <div className="h-0.5 w-4 rounded-sm bg-gray-200 ml-auto" />
        </div>
      </div>
      <div className="mt-2 h-px w-full bg-gray-200" />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="space-y-0.5">
          <div className="h-0.5 w-5 rounded-sm bg-gray-300" />
          <div className="h-0.5 w-8 rounded-sm bg-gray-200" />
          <div className="h-0.5 w-6 rounded-sm bg-gray-100" />
        </div>
        <div className="space-y-0.5">
          <div className="h-0.5 w-4 rounded-sm bg-gray-200 ml-auto" />
          <div className="h-0.5 w-6 rounded-sm bg-gray-100 ml-auto" />
        </div>
      </div>
      <div className="mt-2 h-px w-full" style={{ backgroundColor: accent, opacity: 0.6 }} />
      <div className="mt-1.5 space-y-0.5">
        <div className="flex justify-between">
          <div className="h-0.5 w-8 rounded-sm bg-gray-200" />
          <div className="h-0.5 w-6 rounded-sm bg-gray-200" />
        </div>
        <div className="flex justify-between">
          <div className="h-0.5 w-10 rounded-sm bg-gray-100" />
          <div className="h-0.5 w-5 rounded-sm bg-gray-100" />
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <div className="h-2 w-12 rounded-sm" style={{ backgroundColor: accent, opacity: 0.8 }} />
      </div>
    </div>
  )
}

function ModernThumbnail({ dark, accent }: { dark: string; accent: string }) {
  return (
    <div className="flex h-full w-full flex-col p-2">
      <div className="h-1 w-5 rounded-sm bg-gray-300 mb-1" />
      <div className="flex items-center gap-1">
        <div className="h-1 flex-1 rounded-sm" style={{ backgroundColor: accent }} />
        <div className="h-2 w-6 rounded-sm bg-gray-700 text-[3px] text-white flex items-center justify-center">INV</div>
        <div className="h-1 w-3 rounded-sm" style={{ backgroundColor: dark }} />
      </div>
      <div className="mt-0.5 flex items-center justify-end">
        <div className="h-0.5 flex-1 rounded-sm" style={{ backgroundColor: accent }} />
        <div className="h-0.5 w-3 rounded-sm" style={{ backgroundColor: dark }} />
      </div>
      <div className="mt-2 h-2 w-full rounded-sm" style={{ backgroundColor: dark }} />
      <div className="mt-1.5 flex-1 space-y-0.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1 w-full rounded-sm" style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f5f5f5" }} />
        ))}
      </div>
      <div className="mt-1 flex justify-end">
        <div className="h-2 w-10 rounded-sm" style={{ backgroundColor: accent, opacity: 0.8 }} />
      </div>
    </div>
  )
}

function MinimalThumbnail({ dark, accent }: { dark: string; accent: string }) {
  return (
    <div className="flex h-full w-full flex-col p-2.5">
      <div className="flex items-start justify-between">
        <div>
          <div className="h-1 w-6 rounded-sm bg-gray-200" />
          <div className="h-0.5 w-4 rounded-sm bg-gray-100 mt-0.5" />
        </div>
        <div className="h-4 w-10 rounded-sm" style={{ backgroundColor: "#e5e7eb" }} />
      </div>
      <div className="mt-2 h-px w-full bg-gray-100" />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="space-y-0.5">
          <div className="h-0.5 w-8 rounded-sm bg-gray-200" />
          <div className="h-0.5 w-5 rounded-sm bg-gray-100" />
        </div>
        <div className="space-y-0.5 text-right">
          <div className="h-0.5 w-4 rounded-sm bg-gray-100 ml-auto" />
          <div className="h-0.5 w-6 rounded-sm bg-gray-100 ml-auto" />
        </div>
      </div>
      <div className="mt-2 flex-1 space-y-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex justify-between py-0.5" style={{ borderBottom: "0.5px solid #f3f4f6" }}>
            <div className="h-0.5 w-10 rounded-sm bg-gray-200" />
            <div className="h-0.5 w-5 rounded-sm bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-end">
        <div className="flex justify-between w-16">
          <div className="h-1 w-5 rounded-sm bg-gray-100" />
          <div className="h-1 w-5 rounded-sm" style={{ backgroundColor: accent }} />
        </div>
      </div>
    </div>
  )
}

function BoldThumbnail({ dark, accent }: { dark: string; accent: string }) {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Dark header */}
      <div className="px-2 py-2" style={{ backgroundColor: dark }}>
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <div className="h-1 w-6 rounded-sm bg-white opacity-80" />
            <div className="h-0.5 w-4 rounded-sm bg-white opacity-50" />
          </div>
          <div className="h-4 w-8 rounded-sm font-black text-[5px] flex items-center justify-center"
            style={{ color: accent, backgroundColor: "transparent", fontWeight: 900 }}>
            <div className="h-2 w-8 rounded-sm" style={{ backgroundColor: accent }} />
          </div>
        </div>
      </div>
      {/* Accent bar */}
      <div className="h-0.5 w-full" style={{ backgroundColor: accent }} />
      <div className="flex-1 p-2 space-y-1.5">
        <div className="grid grid-cols-2 gap-1">
          <div className="h-5 rounded-sm bg-gray-100" />
          <div className="h-5 rounded-sm bg-gray-100" />
        </div>
        <div className="space-y-0.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-1">
              <div className="h-0.5 flex-1 rounded-sm bg-gray-200" />
              <div className="h-0.5 w-5 rounded-sm bg-gray-200" />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <div className="h-3 w-12 rounded-sm" style={{ backgroundColor: accent, opacity: 0.9 }} />
        </div>
      </div>
    </div>
  )
}

function CreativeThumbnail({ dark, accent }: { dark: string; accent: string }) {
  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <div className="w-8 flex flex-col p-1.5" style={{ backgroundColor: dark }}>
        <div className="h-2 w-5 rounded-sm bg-white opacity-80 mb-1" />
        <div className="h-0.5 w-4 rounded-sm bg-white opacity-40 mb-0.5" />
        <div className="h-0.5 w-3 rounded-sm bg-white opacity-30 mb-2" />
        <div className="h-0.5 w-5 rounded-sm mb-0.5" style={{ backgroundColor: accent }} />
        <div className="space-y-0.5">
          <div className="h-0.5 w-4 rounded-sm bg-white opacity-40" />
          <div className="h-0.5 w-3 rounded-sm bg-white opacity-30" />
          <div className="h-0.5 w-4 rounded-sm bg-white opacity-40" />
        </div>
        <div className="flex-1" />
        <div className="h-3 w-5 rounded-sm" style={{ backgroundColor: accent, opacity: 0.5 }} />
      </div>
      {/* Main */}
      <div className="flex-1 p-2 space-y-1.5">
        <div className="flex items-start justify-between">
          <div className="h-3 w-8 rounded-sm font-black" style={{ backgroundColor: "#1e293b" }} />
          <div className="h-1 w-5 rounded-sm bg-gray-200" />
        </div>
        <div className="h-0.5 w-5 rounded-sm" style={{ backgroundColor: accent }} />
        <div className="space-y-0.5">
          <div className="h-0.5 w-6 rounded-sm bg-gray-200" />
          <div className="h-0.5 w-4 rounded-sm bg-gray-100" />
        </div>
        <div className="space-y-0.5 pt-0.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-1">
              <div className="h-0.5 flex-1 rounded-sm bg-gray-200" />
              <div className="h-0.5 w-5 rounded-sm bg-gray-200" />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <div className="h-3 w-12 rounded-sm" style={{ backgroundColor: dark, opacity: 0.9 }} />
        </div>
      </div>
    </div>
  )
}

function CompactThumbnail({ dark, accent }: { dark: string; accent: string }) {
  return (
    <div className="flex h-full w-full flex-col p-2">
      {/* Header row */}
      <div className="flex items-center justify-between pb-1" style={{ borderBottom: `1.5px solid ${accent}` }}>
        <div className="space-y-0.5">
          <div className="h-1 w-7 rounded-sm bg-gray-300" />
          <div className="h-0.5 w-5 rounded-sm bg-gray-200" />
        </div>
        <div className="h-2 w-8 rounded-sm font-black" style={{ backgroundColor: accent }} />
      </div>
      {/* Info row */}
      <div className="grid grid-cols-3 gap-1 py-1" style={{ borderBottom: "0.5px solid #e5e7eb" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-0.5">
            <div className="h-0.5 w-4 rounded-sm bg-gray-300" />
            <div className="h-0.5 w-5 rounded-sm bg-gray-200" />
            <div className="h-0.5 w-3 rounded-sm bg-gray-100" />
          </div>
        ))}
      </div>
      {/* Table — tight rows */}
      <div className="mt-1 flex-1 space-y-0.5">
        <div className="flex gap-1 px-0.5 py-0.5 rounded-sm" style={{ backgroundColor: `${accent}20` }}>
          <div className="h-0.5 w-2 rounded-sm" style={{ backgroundColor: accent }} />
          <div className="h-0.5 flex-1 rounded-sm" style={{ backgroundColor: accent }} />
          <div className="h-0.5 w-5 rounded-sm" style={{ backgroundColor: accent }} />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex gap-1 px-0.5"
            style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
            <div className="h-0.5 w-2 rounded-sm bg-gray-200" />
            <div className="h-0.5 flex-1 rounded-sm bg-gray-200" />
            <div className="h-0.5 w-5 rounded-sm bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-1">
        <div className="h-2 w-10 rounded-sm" style={{ backgroundColor: accent, opacity: 0.8 }} />
      </div>
    </div>
  )
}
