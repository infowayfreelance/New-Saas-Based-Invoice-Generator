import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function createClient() {
  if (!supabaseUrl) {
    console.error("[Supabase Server] NEXT_PUBLIC_SUPABASE_URL is not set.")
    throw new Error("Supabase URL is missing. Please configure NEXT_PUBLIC_SUPABASE_URL.")
  }

  if (!supabaseAnonKey) {
    console.error("[Supabase Server] NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.")
    throw new Error("Supabase Anon Key is missing. Please configure NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have proxy refreshing user sessions.
        }
      },
    },
  })
}
