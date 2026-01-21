"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadUserSession() {
      try {
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()

        if (!mounted) return

        if (data?.user) {
          setUser(data.user)
        }
      } catch (err) {
        console.error("[v0] Error loading user session:", err)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadUserSession()

    return () => {
      mounted = false
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
