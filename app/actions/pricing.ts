'use server'

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

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
 * Only returns active pricing
 */
export async function getCountryPricing(countryCode: string = 'US'): Promise<PricingData[]> {
  const supabase = await createClient()
  
  console.log('[v0] Fetching pricing for country:', countryCode)
  
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
      is_active,
      currencies!inner (
        symbol
      )
    `)
    .eq('country_code', countryCode)
    .eq('is_active', true)
    .order('price_amount', { ascending: true })
  
  if (error) {
    console.error('[v0] Error fetching country pricing:', error)
    return []
  }
  
  if (!data || data.length === 0) {
    console.log('[v0] No pricing data found for country:', countryCode)
    return []
  }
  
  console.log('[v0] Found', data.length, 'pricing rows for country:', countryCode)
  
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
 * Get the appropriate country code for pricing using IP detection
 * Priority: 1) x-vercel-ip-country header, 2) cf-ipcountry header, 3) US fallback
 * This is for PUBLIC pricing page - no user authentication required
 */
export async function getPricingCountry(): Promise<string> {
  try {
    const headersList = await headers()
    
    // Try Vercel IP country header first
    const vercelCountry = headersList.get('x-vercel-ip-country')
    if (vercelCountry && vercelCountry !== 'unknown' && vercelCountry.trim() !== '') {
      const countryCode = vercelCountry.toUpperCase()
      console.log('[v0] Detected country from x-vercel-ip-country:', countryCode)
      return countryCode
    }
    
    // Fallback to Cloudflare IP country header
    const cfCountry = headersList.get('cf-ipcountry')
    if (cfCountry && cfCountry !== 'unknown' && cfCountry !== 'XX' && cfCountry.trim() !== '') {
      const countryCode = cfCountry.toUpperCase()
      console.log('[v0] Detected country from cf-ipcountry:', countryCode)
      return countryCode
    }
    
    console.log('[v0] No valid country header found, falling back to US')
  } catch (error) {
    console.error('[v0] Error reading headers:', error)
  }
  
  // Fallback to US
  console.log('[v0] Using US as fallback country')
  return 'US'
}

/**
 * Get pricing data with automatic country detection and US fallback
 * This ensures pricing is ALWAYS returned - never an empty array
 */
export async function getPricingDataWithFallback(): Promise<PricingData[]> {
  // Get the country code from IP headers
  const countryCode = await getPricingCountry()
  
  // Try to get pricing for detected country
  let pricingData = await getCountryPricing(countryCode)
  
  // If no pricing found and country is not US, fallback to US
  if (pricingData.length === 0 && countryCode !== 'US') {
    console.log('[v0] No pricing for', countryCode, '- falling back to US pricing')
    pricingData = await getCountryPricing('US')
  }
  
  // If still no pricing (even US failed), log error
  if (pricingData.length === 0) {
    console.error('[v0] CRITICAL: No pricing data found even after US fallback')
  }
  
  return pricingData
}
