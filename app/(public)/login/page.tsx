"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const urlError = searchParams.get("error")
    if (urlError === "auth_callback_failed") {
      setError("Authentication failed. Please try signing in again.")
    } else if (urlError === "no_code") {
      setError("Invalid authentication link. Please try signing in again.")
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setShowSignUpPrompt(false)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await signIn(formData)

      // Only set error if result exists and has an error property
      if (result?.error) {
        setError(result.error)
        if (result.suggestion === "register") {
          setShowSignUpPrompt(true)
        }
        setIsLoading(false)
      }
      // If successful, signIn redirects to /app (no result returned)
    } catch (err: any) {
      // Next.js redirect throws a special error - let it propagate
      if (err?.digest?.startsWith("NEXT_REDIRECT")) {
        throw err
      }
      // Only show error for actual failures
      console.error("[v0] Login error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-muted-foreground">Sign in to your InvoiceFlow account</p>
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>Enter your email and password to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4" variant={showSignUpPrompt ? "default" : "destructive"}>
                <AlertDescription>
                  {error}
                  {showSignUpPrompt && (
                    <div className="mt-2">
                      <Link href="/register" className="font-medium text-primary hover:underline">
                        Create an account →
                      </Link>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {"Don't have an account? "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <GoogleSignInButton />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
