"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type FloatingDownloadButtonProps = {
  onClick: () => void
  isVisible?: boolean
}

export function FloatingDownloadButton({ onClick, isVisible = true }: FloatingDownloadButtonProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center pointer-events-auto">
      {/* Exact same button as the main Download PDF button */}
      <Button onClick={onClick}>
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
    </div>
  )
}
