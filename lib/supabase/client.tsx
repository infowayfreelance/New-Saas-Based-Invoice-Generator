import { createBrowserClient } from "@supabase/ssr"

let cachedClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Return cached client if it exists
  if (cachedClient) {
    return cachedClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = `
      ❌ Supabase configuration error:
      ${!supabaseUrl ? "- NEXT_PUBLIC_SUPABASE_URL is missing\n" : ""}
      ${!supabaseAnonKey ? "- NEXT_PUBLIC_SUPABASE_ANON_KEY is missing\n" : ""}
      
      Please add these environment variables to connect your Supabase project.
    `
    console.error(errorMessage)
    throw new Error("Missing Supabase environment variables. Check console for details.")
  }

  try {
    cachedClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
    return cachedClient
  } catch (error) {
    console.error("[v0] Error creating Supabase browser client:", error)
    throw error
  }
  // </CHANGE>
}
