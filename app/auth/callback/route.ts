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
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=auth_callback_failed&error_description=${encodeURIComponent(error.message)}`,
        )
      }

      // Successful authentication - redirect to app dashboard
      return NextResponse.redirect(`${requestUrl.origin}/app`)
    } catch (err) {
      console.error("Auth callback exception:", err)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_callback_failed`)
    }
  }

  // No code present - Supabase/the OAuth provider returned an error instead of a
  // code (e.g. redirect URI mismatch, expired PKCE state, denied consent).
  // Surface the real reason instead of a generic "no code" message.
  const providerError = requestUrl.searchParams.get("error")
  const providerErrorDescription = requestUrl.searchParams.get("error_description")
  if (providerError) {
    console.error("Auth callback provider error:", providerError, providerErrorDescription)
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=provider_error&error_description=${encodeURIComponent(
        providerErrorDescription || providerError,
      )}`,
    )
  }

  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
}
