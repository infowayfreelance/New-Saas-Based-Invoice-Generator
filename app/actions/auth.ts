"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const plan = (formData.get("plan") as string) || "basic"
  const redirectUrl = formData.get("redirectUrl") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
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
