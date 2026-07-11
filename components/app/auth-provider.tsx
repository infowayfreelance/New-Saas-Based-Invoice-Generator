"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { UserWithPlan } from "@/lib/types"

interface AuthContextType {
  user: User | null
  profile: UserWithPlan | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserWithPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadUserSession() {
      try {
        const supabase = createClient()

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Connection timeout")), 3000),
        )

        const { data } = (await Promise.race([supabase.auth.getUser(), timeoutPromise])) as any

        if (!mounted) return

        if (!data?.user) {
          setLoading(false)
          return
        }

        setUser(data.user)

        const profilePromise = supabase
          .from("users")
          .select(`*, plan:plans(*)`)
          .eq("id", data.user.id)
          .maybeSingle()

        const profileResult = (await Promise.race([
          profilePromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error("Profile timeout")), 3000)),
        ])) as any

        if (!mounted) return

        if (profileResult?.data) {
          setProfile(profileResult.data)
        } else {
          setProfile({
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.email?.split("@")[0] || "User",
            plan: { code: "BASIC", name: "Basic" },
          } as any)
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

  const signOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.error("[v0] Error signing out:", err)
    } finally {
      router.push("/login")
    }
  }

  return <AuthContext.Provider value={{ user, profile, loading, signOut }}>{children}</AuthContext.Provider>
}
