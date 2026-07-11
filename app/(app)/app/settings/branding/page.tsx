"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

const BRAND_COLORS = [
  { name: "Emerald", value: "#10b981" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Orange", value: "#f97316" },
  { name: "Slate", value: "#64748b" },
]

export default function BrandingSettingsPage() {
  const [theme, setTheme] = useState("SYSTEM")
  const [brandColor, setBrandColor] = useState("#10b981")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const loadSettings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from("user_settings").select("theme").eq("user_id", user.id).single()
        if (data) {
          setTheme(data.theme || "SYSTEM")
        }
      }
    }
    loadSettings()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("user_settings").update({ theme }).eq("user_id", user.id)

      if (error) throw error

      toast.success("Branding settings saved")
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Branding"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Settings", href: "/app/settings" },
          { label: "Branding" },
        ]}
      />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Choose your preferred theme for the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={theme} onValueChange={setTheme} className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="LIGHT" id="light" />
                  <Label htmlFor="light" className="cursor-pointer">
                    Light
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DARK" id="dark" />
                  <Label htmlFor="dark" className="cursor-pointer">
                    Dark
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SYSTEM" id="system" />
                  <Label htmlFor="system" className="cursor-pointer">
                    System
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Color</CardTitle>
              <CardDescription>Choose a primary color for your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
                {BRAND_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setBrandColor(color.value)}
                    className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors ${
                      brandColor === color.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full" style={{ backgroundColor: color.value }} />
                    <span className="text-xs">{color.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
