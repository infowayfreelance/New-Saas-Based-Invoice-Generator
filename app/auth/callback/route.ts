import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_callback_failed`)
      }

      // Successful authentication - redirect to app dashboard
      return NextResponse.redirect(`${requestUrl.origin}/app`)
    } catch (err) {
      console.error("Auth callback exception:", err)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_callback_failed`)
    }
  }

  // No code present - redirect to login with error
  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
}
