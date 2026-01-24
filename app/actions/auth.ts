"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const plan = (formData.get("plan") as string) || "basic"
  const redirectUrl = formData.get("redirectUrl") as string
  const countryCode = formData.get("country_code") as string
  const city = formData.get("city") as string
  const defaultCurrency = formData.get("default_currency") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  if (!countryCode) {
    return { error: "Country is required" }
  }

  if (!city) {
    return { error: "City is required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
        data: {
          name,
          plan,
          country_code: countryCode,
          city,
          default_currency: defaultCurrency || 'USD',
        },
      },
    })

    if (error) {
      return { error: error.message || "Signup failed. Please check your Supabase Auth settings." }
    }

    if (data?.user?.identities?.length === 0) {
      return { error: "This email is already registered. Please sign in instead." }
    }

    return { success: true, email }
  } catch (err: any) {
    console.error("Sign up error:", err)
    const errorMessage = typeof err === "string" ? err : err?.message || "Failed to create account. Please try again."
    return { error: errorMessage }
  }
}

/**
 * Detect user's country from IP address using Vercel headers
 */
export async function detectCountryFromIp(): Promise<string> {
  try {
    const headersList = await headers()
    
    // Use Vercel's x-vercel-ip-country header (most reliable on Vercel)
    const vercelCountry = headersList.get('x-vercel-ip-country')
    if (vercelCountry && vercelCountry !== 'unknown') {
      console.log('[v0] Detected country from Vercel header:', vercelCountry)
      return vercelCountry.toUpperCase()
    }
    
    // Fallback to US
    console.log('[v0] No country detected, using US as default')
    return 'US'
  } catch (error) {
    console.error('[v0] Error detecting country:', error)
    return 'US'
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return {
          error: "Invalid email or password. If you haven't created an account yet, please sign up first.",
          suggestion: "register",
        }
      }
      return { error: error.message }
    }

    redirect("/app")
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err
    }
    console.error("Sign in error:", err)
    return { error: err?.message || "Failed to sign in. Please try again." }
  }
}

export async function signOut() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/login")
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err
    }
    redirect("/login")
  }
}
