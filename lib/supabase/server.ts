import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = `
      ❌ Supabase Server configuration error:
      ${!supabaseUrl ? "- NEXT_PUBLIC_SUPABASE_URL is missing\n" : ""}
      ${!supabaseAnonKey ? "- NEXT_PUBLIC_SUPABASE_ANON_KEY is missing\n" : ""}
      
      Please add these environment variables to your Vercel project or v0 Vars section.
    `
    console.error(errorMessage)
    throw new Error("Missing Supabase environment variables. Check server logs for details.")
  }

  const cookieStore = await cookies()
  
  // Debug: Check if auth cookies exist
  const authCookies = cookieStore.getAll().filter(c => c.name.includes('sb-'))
  console.log("[v0] Auth cookies found:", authCookies.length > 0 ? "YES" : "NO", authCookies.map(c => c.name))

  const client = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const allCookies = cookieStore.getAll()
        return allCookies
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have proxy refreshing user sessions.
          console.log("[v0] Cookie setting skipped in Server Component context")
        }
      },
    },
  })

  return client
}
