"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"
import { toast } from "sonner"

export default function EmailSettingsPage() {
  const [replyToEmail, setReplyToEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const loadSettings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from("user_email_settings").select("*").eq("user_id", user.id).single()
        if (data) {
          setReplyToEmail(data.reply_to_email || user.email || "")
        } else {
          setReplyToEmail(user.email || "")
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

      const { error } = await supabase
        .from("user_email_settings")
        .update({ reply_to_email: replyToEmail })
        .eq("user_id", user.id)

      if (error) throw error

      toast.success("Email settings saved")
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Email Settings"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Settings", href: "/app/settings" },
          { label: "Email" },
        ]}
      />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reply-To Email</CardTitle>
              <CardDescription>When clients reply to invoice emails, replies will go to this address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="replyToEmail">Reply-To Address</Label>
                <Input
                  id="replyToEmail"
                  type="email"
                  value={replyToEmail}
                  onChange={(e) => setReplyToEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </form>

        {/* Coming Soon Features */}
        <Card className="opacity-75">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Custom Email Domain</CardTitle>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
            <CardDescription>Send emails from your own domain (e.g., invoices@yourdomain.com)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span className="text-sm">This feature is coming in a future update</span>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Custom SMTP</CardTitle>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
            <CardDescription>Use your own SMTP server for sending emails</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span className="text-sm">This feature is coming in a future update</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
