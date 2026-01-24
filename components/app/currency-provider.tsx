"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { getDefaultEnabledCurrencies } from "@/lib/utils/currency"

interface CurrencyContextType {
  enabledCurrencies: string[]
  defaultCurrency: string
  setEnabledCurrencies: (currencies: string[]) => void
  setDefaultCurrency: (currency: string) => void
  isCurrencyEnabled: (currency: string) => boolean
  toggleCurrency: (currency: string) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [defaultCurrency, setDefaultCurrency] = useState<string>("USD")
  const [enabledCurrencies, setEnabledCurrenciesState] = useState<string[]>([])

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedDefault = localStorage.getItem("defaultCurrency")
    const storedEnabled = localStorage.getItem("enabledCurrencies")

    if (storedDefault) {
      setDefaultCurrency(storedDefault)
    }

    if (storedEnabled) {
      setEnabledCurrenciesState(JSON.parse(storedEnabled))
    } else {
      // Set default enabled currencies
      const defaults = getDefaultEnabledCurrencies(storedDefault || "USD")
      setEnabledCurrenciesState(defaults)
      localStorage.setItem("enabledCurrencies", JSON.stringify(defaults))
    }
  }, [])

  const setEnabledCurrencies = (currencies: string[]) => {
    setEnabledCurrenciesState(currencies)
    localStorage.setItem("enabledCurrencies", JSON.stringify(currencies))
  }

  const setDefaultCurrencyWrapper = (currency: string) => {
    setDefaultCurrency(currency)
    localStorage.setItem("defaultCurrency", currency)
  }

  const isCurrencyEnabled = (currency: string): boolean => {
    return enabledCurrencies.includes(currency)
  }

  const toggleCurrency = (currency: string) => {
    // Can't disable the default currency
    if (currency === defaultCurrency && enabledCurrencies.includes(currency)) {
      return
    }

    const newEnabled = enabledCurrencies.includes(currency)
      ? enabledCurrencies.filter(c => c !== currency)
      : [...enabledCurrencies, currency]

    setEnabledCurrencies(newEnabled)
  }

  return (
    <CurrencyContext.Provider
      value={{
        enabledCurrencies,
        defaultCurrency,
        setEnabledCurrencies,
        setDefaultCurrency: setDefaultCurrencyWrapper,
        isCurrencyEnabled,
        toggleCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
