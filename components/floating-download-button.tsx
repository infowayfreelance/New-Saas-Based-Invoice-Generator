"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingDownloadButtonProps {
  onClick: () => void
  isVisible: boolean
}

export function FloatingDownloadButton({ onClick, isVisible }: FloatingDownloadButtonProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center pointer-events-none">
      <div className="relative pointer-events-auto">
        <span
          className="absolute -inset-3 rounded-full bg-emerald-400"
          style={{
            animation: "soft-wave 3s ease-out infinite",
            opacity: 0,
          }}
        />
        <span
          className="absolute -inset-3 rounded-full bg-emerald-400"
          style={{
            animation: "soft-wave 3s ease-out infinite 1s",
            opacity: 0,
          }}
        />

        <Button
          size="lg"
          onClick={onClick}
          className="
            relative px-8 py-3 h-auto
            text-base font-semibold 
            rounded-full shadow-2xl
            bg-emerald-600 hover:bg-emerald-700
            text-white
            transition-all duration-300 
            hover:scale-105 hover:shadow-emerald-500/25
          "
        >
          <Download className="mr-2 h-5 w-5" />
          Download Invoice
        </Button>
      </div>

      <style jsx>{`
        @keyframes soft-wave {
          0% {
            transform: scale(1);
            opacity: 0.15;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
