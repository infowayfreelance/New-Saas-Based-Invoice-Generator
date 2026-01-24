"use client"

import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ALL_CURRENCIES } from "@/lib/utils/currency"
import { useCurrency } from "@/components/app/currency-provider"

export default function SetupCurrenciesPage() {
  const { enabledCurrencies, defaultCurrency, toggleCurrency } = useCurrency()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Setup Currencies"
        description="Choose which currencies you want to use for invoices."
      />

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
                  className="flex items-center justify-between rounded-lg border p-4"
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
                    <p className="text-sm text-muted-foreground mt-1">
                      Symbol: {currency.symbol}
                    </p>
                  </div>
                  <Switch
                    id={`currency-${currency.code}`}
                    checked={isEnabled}
                    onCheckedChange={() => toggleCurrency(currency.code)}
                    disabled={isDefault}
                  />
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
            Your default currency is <strong>{defaultCurrency}</strong>. This currency is automatically enabled and cannot be disabled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The following currencies are enabled by default when you sign up: your country's default currency, USD, GBP, and EUR.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
