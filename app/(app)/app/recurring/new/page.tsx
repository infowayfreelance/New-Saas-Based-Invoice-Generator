"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

function computeNextRunAt(day: number, base = new Date()) {
  const y = base.getUTCFullYear(),
    m = base.getUTCMonth()
  const d = new Date(Date.UTC(y, m, day, 0, 0, 0, 0))
  if (base.getUTCDate() > day) d.setUTCMonth(m + 1)
  return d.toISOString() // Return full timestamp, not just date
}

export default function NewRulePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [form, setForm] = useState({
    client_id: "",
    base_invoice_id: "",
    day_of_month: 1,
    auto_send: false,
    reminder_days: "3,5,7",
    is_active: true,
  })

  useEffect(() => {
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return router.push("/login")
      const { data: cs } = await supabase.from("clients").select("id,name").eq("user_id", user.id).order("name")
      const { data: invoices } = await supabase
        .from("invoices")
        .select("id,invoice_number")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)
      setClients(cs ?? [])
      // default base invoice if any
      setForm((f) => ({ ...f, base_invoice_id: invoices?.[0]?.id ?? "" }))
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return router.push("/login")
      if (!form.client_id) return toast.error("Select a client")
      const day = Math.min(28, Math.max(1, Number(form.day_of_month)))

      const payload = {
        user_id: user.id,
        client_id: form.client_id,
        base_invoice_id: form.base_invoice_id || null,
        frequency: "MONTHLY",
        day_of_month: day,
        auto_send: !!form.auto_send,
        reminder_days: form.reminder_days,
        next_run_at: computeNextRunAt(day), // Changed from next_run_date
        active: !!form.is_active,
      }

      console.log("[v0] Creating recurring rule with payload:", payload)

      const { error } = await supabase.from("recurring_invoice_rules").insert(payload)

      if (error) {
        console.error("[v0] Supabase insert error:", error)
        toast.error(`Failed to create rule: ${error.message}`)
        return
      }

      toast.success("Recurring rule created")
      router.push("/app/recurring")
    } catch (err) {
      console.error("[v0] Exception creating rule:", err)
      toast.error("Failed to create rule")
    }
  }

  if (loading) return null

  return (
    <>
      <PageHeader
        title="New Recurring Rule"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Recurring", href: "/app/recurring" },
          { label: "New" },
        ]}
      />
      <div className="p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Monthly schedule</CardTitle>
            <CardDescription>Pick a client and (optionally) a base invoice to clone each month.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={form.client_id} onValueChange={(v) => setForm((f) => ({ ...f, client_id: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Base invoice ID (optional)</Label>
                <Input
                  value={form.base_invoice_id}
                  onChange={(e) => setForm((f) => ({ ...f, base_invoice_id: e.target.value }))}
                  placeholder="UUID or leave empty"
                />
              </div>
              <div className="space-y-2">
                <Label>Day of month (1–28)</Label>
                <Input
                  type="number"
                  min={1}
                  max={28}
                  value={form.day_of_month}
                  onChange={(e) => setForm((f) => ({ ...f, day_of_month: Number(e.target.value) }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={form.auto_send}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, auto_send: !!v }))}
                />
                <Label>Auto-send invoice emails</Label>
              </div>
              <div className="space-y-2">
                <Label>Reminder days (comma-separated)</Label>
                <Input
                  value={form.reminder_days}
                  onChange={(e) => setForm((f) => ({ ...f, reminder_days: e.target.value }))}
                  placeholder="3,5,7"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: !!v }))}
                />
                <Label>Active</Label>
              </div>
              <div className="flex gap-3">
                <Button type="submit">Create rule</Button>
                <Button type="button" variant="outline" className="bg-transparent" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
