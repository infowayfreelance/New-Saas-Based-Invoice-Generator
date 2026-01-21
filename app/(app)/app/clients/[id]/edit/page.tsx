"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function EditClientPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    company_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    notes: "",
  })

  useEffect(() => {
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return router.push("/login")
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single()
      if (error || !data) {
        toast.error("Client not found")
        router.push("/app/clients")
        return
      }
      setForm({
        name: data.name ?? "",
        email: data.email ?? "",
        company_name: data.company_name ?? "",
        phone: data.phone ?? "",
        address_line1: data.address_line1 ?? "",
        address_line2: data.address_line2 ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        postcode: data.postcode ?? "",
        country: data.country ?? "",
        notes: data.notes ?? "",
      })
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    // Build update object with only valid columns and convert empty strings to null
    const updateData = {
      name: form.name || null,
      email: form.email || null,
      company_name: form.company_name || null,
      phone: form.phone || null,
      address_line1: form.address_line1 || null,
      address_line2: form.address_line2 || null,
      city: form.city || null,
      state: form.state || null,
      postcode: form.postcode || null,
      country: form.country || null,
      notes: form.notes || null,
      updated_at: new Date().toISOString(),
    }
    
    // Remove null values for required fields (name is required)
    if (!updateData.name) {
      toast.error("Name is required")
      setSaving(false)
      return
    }
    
    console.log("[v0] Updating client with data:", updateData)
    
    const { error } = await supabase.from("clients").update(updateData).eq("id", params.id).eq("user_id", user!.id)
    
    setSaving(false)
    
    if (error) {
      console.error("[v0] Supabase error:", error)
      return toast.error(`Failed to save client: ${error.message}`)
    }
    
    toast.success("Client updated")
    router.push(`/app/clients/${params.id}`)
  }

  async function onDelete() {
    if (!confirm("Delete this client? Invoices will be kept but unlinked.")) return
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { error } = await supabase.from("clients").delete().eq("id", params.id).eq("user_id", user!.id)
    if (error) return toast.error("Failed to delete client")
    toast.success("Client deleted")
    router.push("/app/clients")
  }

  if (loading) return null

  return (
    <>
      <PageHeader
        title="Edit Client"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Clients", href: "/app/clients" },
          { label: form.name || "Edit" },
        ]}
      >
        <Link href={`/app/clients/${params.id}`}>
          <Button variant="outline" className="bg-transparent">
            Cancel
          </Button>
        </Link>
      </PageHeader>
      <div className="p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Client details</CardTitle>
            <CardDescription>Update client info</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSave} className="space-y-4">
              {[
                ["name", "Full Name", true],
                ["email", "Email", false],
                ["company_name", "Company", false],
                ["phone", "Phone", false],
                ["address_line1", "Address line 1", false],
                ["address_line2", "Address line 2", false],
                ["city", "City", false],
                ["state", "State/Province", false],
                ["postcode", "Postal Code", false],
                ["country", "Country", false],
              ].map(([k, label, req]) => (
                <div className="space-y-2" key={k as string}>
                  <Label htmlFor={k as string}>{label}</Label>
                  <Input
                    id={k as string}
                    required={!!req}
                    value={(form as any)[k as string]}
                    onChange={(e) => set(k as any, e.target.value)}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
                <Button type="button" variant="destructive" onClick={onDelete}>
                  Delete
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
