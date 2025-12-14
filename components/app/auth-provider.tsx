"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let supabase: ReturnType<typeof createClient> | null = null
    let mounted = true

    async function checkAuth() {
      try {
        console.log("[v0] Checking auth...")
        supabase = createClient()

        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Auth timeout")), 5000))

        const authPromise = supabase.auth.getUser()

        const result = (await Promise.race([authPromise, timeoutPromise])) as any

        if (!mounted) return

        const { data, error: authError } = result

        if (authError) {
          console.error("[v0] Auth error:", authError.message)
          console.log("[v0] Enabling demo mode due to auth error")
          setDemoMode(true)
          setLoading(false)
          return
        }

        if (!data?.user) {
          console.log("[v0] No user, redirecting to login")
          router.push("/login")
          return
        }

        console.log("[v0] User authenticated:", data.user.email)
        setUser(data.user)
      } catch (err) {
        console.error("[v0] Error checking auth:", err)
        if (mounted) {
          console.log("[v0] Enabling demo mode due to connection error")
          setDemoMode(true)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (demoMode) {
    return (
      <>
        <div className="fixed left-0 right-0 top-0 z-50 bg-yellow-500 px-4 py-2 text-center text-sm font-medium text-white">
          Demo Mode: Database connection unavailable. Using demo data.
        </div>
        <div className="pt-10">{children}</div>
      </>
    )
  }

  return <>{children}</>
}
