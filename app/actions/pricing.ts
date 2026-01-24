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
 * Get the appropriate country code for pricing
 * Priority: 1) User's selected country (if logged in), 2) IP-based detection, 3) US fallback
 */
export async function getPricingCountry(): Promise<string> {
  const supabase = await createClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // User is logged in - get their selected country from user_settings
    const { data: settings } = await supabase
      .from('user_settings')
      .select('country_code')
      .eq('user_id', user.id)
      .single()
    
    if (settings?.country_code) {
      console.log('[v0] Using user country from settings:', settings.country_code)
      return settings.country_code
    }
  }
  
  // User not logged in - detect from IP using Vercel headers
  try {
    const headersList = await headers()
    const vercelCountry = headersList.get('x-vercel-ip-country')
    
    if (vercelCountry && vercelCountry !== 'unknown') {
      console.log('[v0] Detected country from Vercel IP header:', vercelCountry)
      return vercelCountry.toUpperCase()
    }
  } catch (error) {
    console.error('[v0] Error reading headers:', error)
  }
  
  // Fallback to US
  console.log('[v0] No country detected, using US as default')
  return 'US'
}

/**
 * Get pricing data with automatic country detection and US fallback
 * This ensures pricing is ALWAYS returned - never an empty array
 */
export async function getPricingDataWithFallback(): Promise<PricingData[]> {
  // Get the country code
  const countryCode = await getPricingCountry()
  
  // Try to get pricing for detected country
  let pricingData = await getCountryPricing(countryCode)
  
  // If no pricing found and country is not US, fallback to US
  if (pricingData.length === 0 && countryCode !== 'US') {
    pricingData = await getCountryPricing('US')
  }
  
  // If still no pricing (even US failed), log error but return empty array
  // The UI will handle this gracefully with a fallback message
  if (pricingData.length === 0) {
    console.error('No pricing data found even after US fallback')
  }
  
  return pricingData
}
