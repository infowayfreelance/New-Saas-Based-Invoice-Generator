"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { ProfessionFaq } from "./types"

export function ProfessionFaqAccordion({ faqs }: { faqs: ProfessionFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.question} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left font-semibold text-foreground focus:outline-none"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-primary transition-transform ${isOpen ? "rotate-180" : "text-muted-foreground"}`}
              />
            </button>
            {isOpen && <div className="px-4 pb-4 leading-relaxed text-muted-foreground">{item.answer}</div>}
          </div>
        )
      })}
    </div>
  )
}
