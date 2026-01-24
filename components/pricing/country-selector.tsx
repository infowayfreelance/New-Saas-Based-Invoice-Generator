'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CountryOption } from '@/app/actions/pricing'

interface CountrySelectorProps {
  countries: CountryOption[]
  selectedCountry: string
}

export function CountrySelector({ countries, selectedCountry }: CountrySelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCountryChange = (countryCode: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('country', countryCode)
    router.push(`?${params.toString()}`)
  }

  const selectedCountryName = countries.find(c => c.code === selectedCountry)?.name || 'Select Country'

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">Pricing for:</span>
      <Select value={selectedCountry} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue>{selectedCountryName}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
