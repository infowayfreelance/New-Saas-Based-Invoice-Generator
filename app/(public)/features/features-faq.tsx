"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import type { ProfessionFaq } from "./types"

export function FeaturesFaqAccordion({ faqs, keepAnswersMounted = false }: { faqs: ProfessionFaq[]; keepAnswersMounted?: boolean }) {
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
            {(isOpen || keepAnswersMounted) && <div hidden={!isOpen} className="px-4 pb-4 leading-relaxed text-muted-foreground">{index === 0 ? <>You can start without a credit card. For what is included in each plan, see the <Link href="/pricing">pricing page</Link>, which always shows the current details.</> : item.answer}</div>}
          </div>
        )
      })}
    </div>
  )
}
