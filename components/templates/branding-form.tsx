"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function BrandingForm() {
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [primaryColor, setPrimaryColor] = useState("#171717")
  const [accentColor, setAccentColor] = useState("#171717")
  const [logoUrl, setLogoUrl] = useState("")
  const [watermarkText, setWatermarkText] = useState("")
  const [signatureUrl, setSignatureUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      const { data } = await supabase
        .from("invoice_templates")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data) {
        setTemplateId(data.id)
        setPrimaryColor(data.primary_color || "#171717")
        setAccentColor(data.accent_color || "#171717")
        setLogoUrl(data.logo_url || "")
        setWatermarkText(data.watermark_text || "")
        setSignatureUrl(data.signature_url || "")
      }
      setIsLoading(false)
    }
    load()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Not authenticated")
        return
      }

      const payload = {
        primary_color: primaryColor || null,
        accent_color: accentColor || null,
        logo_url: logoUrl || null,
        watermark_text: watermarkText || null,
        signature_url: signatureUrl || null,
      }

      const { error } = templateId
        ? await supabase.from("invoice_templates").update(payload).eq("id", templateId)
        : await supabase
            .from("invoice_templates")
            .insert({ user_id: user.id, name: "My Brand", is_default: true, ...payload })
            .select()
            .single()
            .then((result) => {
              if (result.data) setTemplateId(result.data.id)
              return result
            })

      if (error) {
        toast.error(error.message || "Failed to save branding")
        return
      }

      toast.success("Branding saved — it will now appear on your invoices")
    } catch (err) {
      console.error("[v0] Failed to save branding:", err)
      toast.error("Failed to save branding")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex items-center gap-2">
            <Input
              id="primaryColor"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-10 w-14 p-1"
            />
            <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#171717" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="accentColor">Accent Color</Label>
          <div className="flex items-center gap-2">
            <Input
              id="accentColor"
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-10 w-14 p-1"
            />
            <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} placeholder="#171717" />
          </div>
          <p className="text-xs text-muted-foreground">Used for the INVOICE heading and total amount.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input
          id="logoUrl"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://example.com/your-logo.png"
        />
        <p className="text-xs text-muted-foreground">Link to an image of your logo, shown on every invoice.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signatureUrl">Signature Image URL (optional)</Label>
        <Input
          id="signatureUrl"
          value={signatureUrl}
          onChange={(e) => setSignatureUrl(e.target.value)}
          placeholder="https://example.com/your-signature.png"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="watermarkText">Watermark Text (optional)</Label>
        <Input
          id="watermarkText"
          value={watermarkText}
          onChange={(e) => setWatermarkText(e.target.value)}
          placeholder="e.g. your business name"
        />
        <p className="text-xs text-muted-foreground">Faint diagonal text shown across the invoice background.</p>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Branding"}
      </Button>
    </form>
  )
}
