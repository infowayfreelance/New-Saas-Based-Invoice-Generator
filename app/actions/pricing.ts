'use server'

import { createClient } from "@/lib/supabase/server"
import { getClientIp } from "@/lib/utils/ip"

export interface PricingData {
  plan_code: string
  plan_name: string
  plan_description: string | null
  country_code: string
  country_name: string
  currency_code: string
  currency_symbol: string
  price_amount: number
  price_yearly: number
}

export interface CountryOption {
  code: string
  name: string
}

/**
 * Get pricing data for a specific country from Supabase
 * Fetches from country_pricing table with join to currencies
 */
export async function getCountryPricing(countryCode: string = 'US'): Promise<PricingData[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('country_pricing')
    .select(`
      country_code,
      country_name,
      plan_code,
      plan_name,
      currency_code,
      price_amount,
      price_yearly,
      currencies!inner (
        symbol
      )
    `)
    .eq('country_code', countryCode)
    .order('price_amount', { ascending: true })
  
  if (error) {
    console.error('[v0] Error fetching country pricing:', error)
    return []
  }
  
  if (!data || data.length === 0) {
    console.log('[v0] No pricing data found for country:', countryCode)
    return []
  }
  
  // Transform database response
  return data.map(item => ({
    plan_code: item.plan_code,
    plan_name: item.plan_name,
    plan_description: null, // Can be added to schema later if needed
    country_code: item.country_code,
    country_name: item.country_name,
    currency_code: item.currency_code,
    currency_symbol: (item.currencies as any).symbol,
    price_amount: item.price_amount,
    price_yearly: item.price_yearly,
  }))
}

/**
 * Get list of all available countries with pricing data
 */
export async function getAvailableCountries(): Promise<CountryOption[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('country_pricing')
    .select('country_code, country_name')
    .order('country_name', { ascending: true })
  
  if (error) {
    console.error('[v0] Error fetching countries:', error)
    return [{ code: 'US', name: 'United States' }]
  }
  
  // Remove duplicates by grouping by country_code
  const uniqueCountries = data.reduce((acc, curr) => {
    if (!acc.find(c => c.code === curr.country_code)) {
      acc.push({
        code: curr.country_code,
        name: curr.country_name
      })
    }
    return acc
  }, [] as CountryOption[])
  
  return uniqueCountries
}

/**
 * Detect user's country based on IP address
 * Uses an external API service to get country from IP
 * Falls back to US if detection fails
 */
export async function getUserCountryFromIp(): Promise<string> {
  try {
    const ip = await getClientIp()
    
    // Skip country detection for local/unknown IPs
    if (ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
      return 'US'
    }
    
    // Use ipapi.co for IP geolocation (free tier: 1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ip}/country/`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!response.ok) {
      console.log('[v0] IP geolocation failed, using default country')
      return 'US'
    }
    
    const countryCode = await response.text()
    
    // Validate country code format (should be 2 letters)
    if (countryCode && countryCode.length === 2) {
      console.log('[v0] Detected country from IP:', countryCode)
      return countryCode.toUpperCase()
    }
    
    return 'US'
  } catch (error) {
    console.error('[v0] Error detecting country from IP:', error)
    return 'US'
  }
}
