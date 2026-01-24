'use client'

import { useState, useEffect } from 'react'

export function BillingToggle() {
  const [isYearly, setIsYearly] = useState(true)

  const updatePricing = (yearly: boolean) => {
    // Update all pricing cards
    const cards = document.querySelectorAll('[data-plan]')
    
    cards.forEach(card => {
      const monthlyPrice = card.querySelector('[data-price-monthly]')
      const yearlyPrice = card.querySelector('[data-price-yearly]')
      const monthlyPeriod = card.querySelector('[data-period-monthly]')
      const yearlyPeriod = card.querySelector('[data-period-yearly]')
      const savings = card.querySelector('[data-savings]')
      
      if (yearly) {
        // Show yearly pricing
        monthlyPrice?.classList.add('hidden')
        yearlyPrice?.classList.remove('hidden')
        monthlyPeriod?.classList.add('hidden')
        yearlyPeriod?.classList.remove('hidden')
        savings?.classList.remove('hidden')
      } else {
        // Show monthly pricing
        monthlyPrice?.classList.remove('hidden')
        yearlyPrice?.classList.add('hidden')
        monthlyPeriod?.classList.remove('hidden')
        yearlyPeriod?.classList.add('hidden')
        savings?.classList.add('hidden')
      }
    })
  }

  const handleToggle = (yearly: boolean) => {
    setIsYearly(yearly)
    updatePricing(yearly)
  }

  // Initialize with yearly pricing on mount
  useEffect(() => {
    updatePricing(true)
  }, [])

  return (
    <div className="inline-flex items-center gap-3 rounded-lg border bg-card p-1 text-card-foreground shadow-sm">
      <button
        onClick={() => handleToggle(false)}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          !isYearly
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => handleToggle(true)}
        className={`relative rounded-md px-4 py-2 pr-16 text-sm font-medium transition-colors ${
          isYearly
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Yearly
        <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
          Save 20%
        </span>
      </button>
    </div>
  )
}
