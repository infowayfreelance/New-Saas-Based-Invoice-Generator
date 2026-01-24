export interface Country {
  code: string
  name: string
  defaultCurrency: string
}

export interface Currency {
  code: string
  name: string
  symbol: string
}

export const COUNTRIES: Country[] = [
  // Asia
  { code: "PK", name: "Pakistan", defaultCurrency: "PKR" },
  { code: "IN", name: "India", defaultCurrency: "INR" },
  { code: "CN", name: "China", defaultCurrency: "CNY" },
  { code: "JP", name: "Japan", defaultCurrency: "JPY" },
  { code: "AE", name: "United Arab Emirates", defaultCurrency: "AED" },
  { code: "SA", name: "Saudi Arabia", defaultCurrency: "SAR" },
  { code: "SG", name: "Singapore", defaultCurrency: "SGD" },
  
  // Europe
  { code: "GB", name: "United Kingdom", defaultCurrency: "GBP" },
  { code: "DE", name: "Germany", defaultCurrency: "EUR" },
  { code: "FR", name: "France", defaultCurrency: "EUR" },
  { code: "IT", name: "Italy", defaultCurrency: "EUR" },
  { code: "ES", name: "Spain", defaultCurrency: "EUR" },
  { code: "NL", name: "Netherlands", defaultCurrency: "EUR" },
  { code: "CH", name: "Switzerland", defaultCurrency: "CHF" },
  { code: "SE", name: "Sweden", defaultCurrency: "SEK" },
  { code: "NO", name: "Norway", defaultCurrency: "NOK" },
  
  // Americas
  { code: "US", name: "United States", defaultCurrency: "USD" },
  { code: "CA", name: "Canada", defaultCurrency: "CAD" },
  { code: "MX", name: "Mexico", defaultCurrency: "MXN" },
  { code: "BR", name: "Brazil", defaultCurrency: "BRL" },
  
  // Oceania
  { code: "AU", name: "Australia", defaultCurrency: "AUD" },
  { code: "NZ", name: "New Zealand", defaultCurrency: "NZD" },
  
  // Africa
  { code: "ZA", name: "South Africa", defaultCurrency: "ZAR" },
]

export const ALL_CURRENCIES: Currency[] = [
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
]

export function getDefaultCurrencyForCountry(countryCode: string): string {
  const country = COUNTRIES.find(c => c.code === countryCode)
  return country?.defaultCurrency || "USD"
}

export function getDefaultEnabledCurrencies(userDefaultCurrency: string): string[] {
  const defaultCurrencies = new Set([userDefaultCurrency, "USD", "GBP", "EUR"])
  return Array.from(defaultCurrencies)
}

export function getCurrencyByCode(code: string): Currency | undefined {
  return ALL_CURRENCIES.find(c => c.code === code)
}
