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
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have proxy refreshing user sessions.
        }
      },
    },
  })

  return client
}
