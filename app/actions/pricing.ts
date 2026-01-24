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
 * CORRECT SCHEMA: country_pricing(country_code, plan_id, currency_code, price_amount, price_yearly)
 * Joins with plans(id, code, name) and currencies(code, symbol)
 */
export async function getCountryPricing(countryCode: string = 'US'): Promise<PricingData[]> {
  const supabase = await createClient()
  
  console.log('[v0] === PRICING FETCH START ===')
  console.log('[v0] Detected country code:', countryCode)
  
  const { data, error } = await supabase
    .from('country_pricing')
    .select(`
      country_code,
      price_amount,
      price_yearly,
      currency_code,
      plans (
        id,
        code,
        name
      ),
      currencies (
        symbol
      )
    `)
    .eq('country_code', countryCode)
    .order('price_amount', { ascending: true })
  
  if (error) {
    console.error('[v0] ERROR fetching country pricing:', error)
    console.error('[v0] Error details:', JSON.stringify(error, null, 2))
    return []
  }
  
  console.log('[v0] Query result - Row count:', data?.length || 0)
  
  if (!data || data.length === 0) {
    console.log('[v0] WARNING: No pricing data returned for country:', countryCode)
    return []
  }
  
  console.log('[v0] Raw first row (before normalization):', JSON.stringify(data[0], null, 2))
  
  // Transform database response - handle Supabase join arrays
  const transformed = data.map(item => {
    // Supabase returns foreign key joins as arrays or objects - normalize them
    const plan = Array.isArray(item.plans) ? item.plans[0] : item.plans
    const currency = Array.isArray(item.currencies) ? item.currencies[0] : item.currencies
    
    if (!plan || !currency) {
      console.error('[v0] ERROR: Missing join data for row:', item)
      return null
    }
    
    return {
      plan_code: plan.code,
      plan_name: plan.name,
      plan_description: null,
      country_code: item.country_code,
      country_name: countryCode, // We don't have country_name in DB, use code
      currency_code: item.currency_code,
      currency_symbol: currency.symbol,
      price_amount: item.price_amount,
      price_yearly: item.price_yearly,
    }
  }).filter(Boolean) as PricingData[]
  
  console.log('[v0] Transformed row count:', transformed.length)
  if (transformed.length > 0) {
    console.log('[v0] First normalized row:', JSON.stringify(transformed[0], null, 2))
    console.log('[v0] All plan codes:', transformed.map(p => p.plan_code).join(', '))
  }
  console.log('[v0] === PRICING FETCH END ===')
  
  return transformed
}

/**
 * Get list of all available countries with pricing data
 * Note: country_pricing only has country_code, not country_name
 */
export async function getAvailableCountries(): Promise<CountryOption[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('country_pricing')
    .select('country_code')
    .order('country_code', { ascending: true })
  
  if (error) {
    console.error('[v0] Error fetching countries:', error)
    return [{ code: 'US', name: 'United States' }]
  }
  
  // Remove duplicates by grouping by country_code
  const uniqueCountries = data.reduce((acc, curr) => {
    if (!acc.find(c => c.code === curr.country_code)) {
      acc.push({
        code: curr.country_code,
        name: curr.country_code // Use code as name since we don't have a mapping
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
  console.log('[v0] ======================================')
  console.log('[v0] PRICING PAGE DATA FETCH')
  console.log('[v0] ======================================')
  
  // Get the country code from IP headers
  const countryCode = await getPricingCountry()
  console.log('[v0] Step 1: Country detection result:', countryCode)
  
  // Try to get pricing for detected country
  console.log('[v0] Step 2: Fetching pricing for detected country...')
  let pricingData = await getCountryPricing(countryCode)
  console.log('[v0] Step 2 result: Found', pricingData.length, 'pricing rows')
  
  // If no pricing found and country is not US, fallback to US
  if (pricingData.length === 0 && countryCode !== 'US') {
    console.log('[v0] Step 3: No pricing for', countryCode, '- ATTEMPTING US FALLBACK')
    pricingData = await getCountryPricing('US')
    console.log('[v0] Step 3 result: US fallback returned', pricingData.length, 'rows')
  }
  
  // If still no pricing (even US failed), log critical error
  if (pricingData.length === 0) {
    console.error('[v0] ❌ CRITICAL ERROR: No pricing data found even after US fallback!')
    console.error('[v0] This means the country_pricing table has no active rows.')
    console.error('[v0] Check database: SELECT * FROM country_pricing WHERE country_code = \'US\';')
  } else {
    console.log('[v0] ✅ SUCCESS: Returning', pricingData.length, 'pricing plans')
    console.log('[v0] Plans:', pricingData.map(p => p.plan_code).join(', '))
  }
  
  console.log('[v0] ======================================')
  
  return pricingData
}
