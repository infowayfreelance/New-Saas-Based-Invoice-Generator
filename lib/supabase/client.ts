import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let clientInstance: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  // Return cached instance if it exists
  if (clientInstance) {
    return clientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.",
    )
  }

  // Create and cache the client instance
  clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return clientInstance
}

// Export a function to reset the client (useful for testing)
export function resetClient() {
  clientInstance = null
}
