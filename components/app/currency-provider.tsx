"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { getDefaultEnabledCurrencies } from "@/lib/utils/currency"
import { createClient } from "@/lib/supabase/client"

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
  const [userId, setUserId] = useState<string | null>(null)

  // Initialize: localStorage first for a fast paint, then the database
  // (user_currencies / user_settings) as the source of truth for signed-in users.
  useEffect(() => {
    const storedDefault = localStorage.getItem("defaultCurrency")
    const storedEnabled = localStorage.getItem("enabledCurrencies")

    if (storedDefault) {
      setDefaultCurrency(storedDefault)
    }

    if (storedEnabled) {
      setEnabledCurrenciesState(JSON.parse(storedEnabled))
    } else {
      const defaults = getDefaultEnabledCurrencies(storedDefault || "USD")
      setEnabledCurrenciesState(defaults)
      localStorage.setItem("enabledCurrencies", JSON.stringify(defaults))
    }

    let mounted = true

    const loadFromDatabase = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user || !mounted) return
        setUserId(user.id)

        const [{ data: currencies }, { data: settings }] = await Promise.all([
          supabase.from("user_currencies").select("currency_code, is_default").eq("user_id", user.id),
          supabase.from("user_settings").select("currency").eq("user_id", user.id).maybeSingle(),
        ])

        if (!mounted) return

        if (currencies && currencies.length > 0) {
          const enabled = currencies.map((c) => c.currency_code)
          const dbDefault =
            currencies.find((c) => c.is_default)?.currency_code || settings?.currency || enabled[0]

          setEnabledCurrenciesState(enabled)
          setDefaultCurrency(dbDefault)
          localStorage.setItem("enabledCurrencies", JSON.stringify(enabled))
          localStorage.setItem("defaultCurrency", dbDefault)
        } else if (settings?.currency) {
          const dbDefault = settings.currency
          const defaults = getDefaultEnabledCurrencies(dbDefault)

          setDefaultCurrency(dbDefault)
          setEnabledCurrenciesState(defaults)
          localStorage.setItem("defaultCurrency", dbDefault)
          localStorage.setItem("enabledCurrencies", JSON.stringify(defaults))
        }
      } catch (err) {
        console.error("[v0] Error loading currency settings from database:", err)
      }
    }

    loadFromDatabase()

    return () => {
      mounted = false
    }
  }, [])

  const setEnabledCurrencies = (currencies: string[]) => {
    setEnabledCurrenciesState(currencies)
    localStorage.setItem("enabledCurrencies", JSON.stringify(currencies))
  }

  const setDefaultCurrencyWrapper = (currency: string) => {
    setDefaultCurrency(currency)
    localStorage.setItem("defaultCurrency", currency)

    // Ensure the default currency is always enabled
    if (!enabledCurrencies.includes(currency)) {
      setEnabledCurrencies([...enabledCurrencies, currency])
    }

    // Persist to the database for signed-in users
    if (userId) {
      const supabase = createClient()
      Promise.all([
        supabase.from("user_settings").update({ currency }).eq("user_id", userId),
        supabase.from("user_currencies").update({ is_default: false }).eq("user_id", userId),
      ])
        .then(() =>
          supabase
            .from("user_currencies")
            .upsert(
              { user_id: userId, currency_code: currency, is_default: true },
              { onConflict: "user_id,currency_code" },
            ),
        )
        .then(({ error }: any) => {
          if (error) console.error("[v0] Error saving default currency:", error)
        })
        .catch((err) => console.error("[v0] Error saving default currency:", err))
    }
  }

  const isCurrencyEnabled = (currency: string): boolean => {
    return enabledCurrencies.includes(currency)
  }

  const toggleCurrency = (currency: string) => {
    // Can't disable the default currency
    if (currency === defaultCurrency && enabledCurrencies.includes(currency)) {
      return
    }

    const isEnabling = !enabledCurrencies.includes(currency)
    const newEnabled = isEnabling
      ? [...enabledCurrencies, currency]
      : enabledCurrencies.filter((c) => c !== currency)

    setEnabledCurrencies(newEnabled)

    // Persist to the database for signed-in users
    if (userId) {
      const supabase = createClient()
      const op = isEnabling
        ? supabase
            .from("user_currencies")
            .upsert(
              { user_id: userId, currency_code: currency, is_default: false },
              { onConflict: "user_id,currency_code" },
            )
        : supabase.from("user_currencies").delete().eq("user_id", userId).eq("currency_code", currency)

      op.then(({ error }: any) => {
        if (error) console.error("[v0] Error saving currency toggle:", error)
      })
    }
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
  return context
}

export function useCurrencyOrDefault() {
  const context = useContext(CurrencyContext)
  // Return default values if not in a provider (e.g., public pages)
  if (!context) {
    return {
      enabledCurrencies: ["USD", "EUR", "GBP", "PKR"], // All currencies available on public pages
      defaultCurrency: "USD",
      setEnabledCurrencies: () => {},
      setDefaultCurrency: () => {},
      isCurrencyEnabled: () => true,
      toggleCurrency: () => {},
    }
  }
  return context
}
