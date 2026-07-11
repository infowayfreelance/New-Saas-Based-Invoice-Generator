"use client"

import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ALL_CURRENCIES } from "@/lib/utils/currency"
import { useCurrencyOrDefault } from "@/components/app/currency-provider"
import { toast } from "sonner"

export default function SetupCurrenciesPage() {
  const { enabledCurrencies, defaultCurrency, toggleCurrency, setDefaultCurrency } = useCurrencyOrDefault()

  const handleSetDefault = (code: string) => {
    setDefaultCurrency(code)
    toast.success(`${code} is now your default currency`)
  }

  return (
    <>
      <PageHeader
        title="Setup Currencies"
        breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Currencies" }]}
      />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Currencies</CardTitle>
            <CardDescription>
              Enable or disable currencies for your invoices. Your default currency cannot be disabled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ALL_CURRENCIES.map((currency) => {
                const isEnabled = enabledCurrencies.includes(currency.code)
                const isDefault = currency.code === defaultCurrency

                return (
                  <div
                    key={currency.code}
                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`currency-${currency.code}`}
                          className="text-base font-medium cursor-pointer"
                        >
                          {currency.code} — {currency.name}
                        </Label>
                        {isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Symbol: {currency.symbol}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {isEnabled && !isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefault(currency.code)}>
                          Set as default
                        </Button>
                      )}
                      <Switch
                        id={`currency-${currency.code}`}
                        checked={isEnabled}
                        onCheckedChange={() => toggleCurrency(currency.code)}
                        disabled={isDefault}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default Currency</CardTitle>
            <CardDescription>
              Your default currency is <strong>{defaultCurrency}</strong>. New invoices start with this currency,
              and it is automatically enabled and cannot be disabled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The following currencies are enabled by default when you sign up: your country's default currency,
              USD, GBP, and EUR.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
