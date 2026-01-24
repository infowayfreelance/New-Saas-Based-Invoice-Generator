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
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
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
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isYearly
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Yearly
        </button>
      </div>
      <span className="text-sm text-emerald-600 dark:text-emerald-500">
        Save 20% with yearly billing
      </span>
    </div>
  )
}
