"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.82-.07-1.42-.22-2.05H12v3.87h6.5c-.13 1.08-.83 2.71-2.39 3.8l-.02.15 3.47 2.69.24.02c2.21-2.04 3.49-5.04 3.49-8.48z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.78-2.93c-1.01.71-2.37 1.2-4.15 1.2-3.17 0-5.86-2.09-6.82-4.97l-.14.01-3.6 2.79-.05.14C3.36 21.3 7.35 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.18 14.39A7.4 7.4 0 0 1 4.77 12c0-.83.15-1.64.4-2.39l-.01-.16-3.65-2.83-.12.06A11.98 11.98 0 0 0 0 12c0 1.93.47 3.76 1.29 5.36l3.89-2.97z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c2.26 0 3.78.97 4.65 1.79l3.39-3.31C17.94 1.19 15.24 0 12 0 7.35 0 3.36 2.7 1.29 6.64l3.88 2.97C6.14 6.84 8.83 4.75 12 4.75z"
      />
    </svg>
  )
}

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message || "Failed to start Google sign-in")
        setIsLoading(false)
      }
      // On success, Supabase redirects the browser to Google - no further action needed here.
    } catch (err) {
      console.error("[v0] Google sign-in error:", err)
      toast.error("Failed to start Google sign-in")
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full bg-transparent"
      onClick={handleClick}
      disabled={isLoading}
    >
      <GoogleIcon />
      <span className="ml-2">{isLoading ? "Redirecting..." : "Continue with Google"}</span>
    </Button>
  )
}
