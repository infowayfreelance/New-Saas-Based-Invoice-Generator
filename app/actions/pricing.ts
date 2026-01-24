'use server'

import { createClient } from "@/lib/supabase/server"

export interface PricingData {
  plan_code: string
  plan_name: string
  country_code: string
  currency_code: string
  currency_symbol: string
  price_amount: number
  price_yearly: number
}

export async function getCountryPricing(countryCode: string = 'US'): Promise<PricingData[]> {
  const supabase = await createClient()
  
  // Try to fetch from database
  const { data, error } = await supabase
    .from('country_pricing')
    .select(`
      plan_code,
      plan_name,
      country_code,
      currency_code,
      price_amount,
      price_yearly,
      currencies!inner (
        symbol
      )
    `)
    .eq('country_code', countryCode)
    .order('price_amount', { ascending: true })
  
  if (error || !data || data.length === 0) {
    // Fallback to mock data if database not set up
    console.log('[v0] Using fallback pricing data')
    return [
      {
        plan_code: 'BASIC',
        plan_name: 'Basic',
        country_code: 'US',
        currency_code: 'USD',
        currency_symbol: '$',
        price_amount: 5,
        price_yearly: 48, // 5 * 12 * 0.8 = 48
      },
      {
        plan_code: 'STANDARD',
        plan_name: 'Standard',
        country_code: 'US',
        currency_code: 'USD',
        currency_symbol: '$',
        price_amount: 12,
        price_yearly: 115.2, // 12 * 12 * 0.8 = 115.2
      },
      {
        plan_code: 'PRO',
        plan_name: 'Pro',
        country_code: 'US',
        currency_code: 'USD',
        currency_symbol: '$',
        price_amount: 29.99,
        price_yearly: 287.9, // 29.99 * 12 * 0.8 = 287.9
      },
    ]
  }
  
  // Transform database response
  return data.map(item => ({
    plan_code: item.plan_code,
    plan_name: item.plan_name,
    country_code: item.country_code,
    currency_code: item.currency_code,
    currency_symbol: (item.currencies as any).symbol,
    price_amount: item.price_amount,
    price_yearly: item.price_yearly,
  }))
}

export async function getUserCountry(): Promise<string> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return 'US' // Default to US for unauthenticated users
  }
  
  // Try to get country from user_settings
  const { data: settings } = await supabase
    .from('user_settings')
    .select('country_code')
    .eq('user_id', user.id)
    .single()
  
  return settings?.country_code || 'US'
}
