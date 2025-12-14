"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function checkAuth() {
      try {
        const supabase = createClient()

        const { data, error: authError } = await supabase.auth.getUser()

        if (!mounted) return

        if (authError) {
          console.error("[v0] Auth error:", authError)
          setError(`Authentication failed: ${authError.message}. Check browser extensions or network settings.`)
          setLoading(false)
          return
        }

        if (!data?.user) {
          router.push("/login")
          return
        }

        setUser(data.user)
      } catch (err) {
        console.error("[v0] Error checking auth:", err)
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error"
          setError(`Connection failed: ${errorMessage}. Check your network connection and browser extensions.`)
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>{error}</p>
              <p className="text-sm">This may be caused by browser extensions blocking requests or network issues.</p>
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => window.location.reload()} className="flex-1">
              Retry
            </Button>
            <Button onClick={() => router.push("/login")} variant="outline" className="flex-1">
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
