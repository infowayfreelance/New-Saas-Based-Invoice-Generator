import { createBrowserClient } from '@supabase/ssr'
import { normalizeSupabaseUrl } from './env'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Several client pages create this client in the component body, which also
  // runs during build-time prerendering. If the env vars are absent at build
  // time, fall back to placeholder values on the server so `next build`
  // doesn't crash — real browser requests still require the actual values.
  if ((!url || !key) && typeof window === 'undefined') {
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-anon-key')
  }

  return createBrowserClient(normalizeSupabaseUrl(url!), key!)
}
