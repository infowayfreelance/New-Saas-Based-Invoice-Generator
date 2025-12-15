import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

function computeNextRunAt(day: number, base = new Date()) {
  const y = base.getUTCFullYear(),
    m = base.getUTCMonth()
  const d = new Date(Date.UTC(y, m, Math.min(28, Math.max(1, day)), 0, 0, 0, 0))
  if (base.getUTCDate() > day) d.setUTCMonth(m + 1)
  return d.toISOString() // Return full timestamp, not just date
}

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export default async function EditRecurringRule({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!isValidUUID(id)) {
    redirect("/app/recurring")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: rule } = await supabase
    .from("recurring_invoice_rules")
    .select("*, client:clients(id,name)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!rule) {
    redirect("/app/recurring")
  }

  async function updateRule(formData: FormData) {
    "use server"
    const s = await createClient()
    const {
      data: { user },
    } = await s.auth.getUser()
    if (!user) redirect("/login")
    const day = Math.min(28, Math.max(1, Number(formData.get("day_of_month"))))

    const patch = {
      client_id: String(formData.get("client_id") || rule.client_id),
      base_invoice_id: String(formData.get("base_invoice_id") || "") || null,
      day_of_month: day,
      auto_send: formData.get("auto_send") === "on",
      reminder_days: String(formData.get("reminder_days") || "3,5,7"),
      active: formData.get("is_active") === "on", // Column is 'active' not 'is_active'
      next_run_at: computeNextRunAt(day), // Changed from next_run_date
      updated_at: new Date().toISOString(),
    }
    const { error } = await s.from("recurring_invoice_rules").update(patch).eq("id", id).eq("user_id", user.id)
    if (error) throw error
    redirect("/app/recurring")
  }

  async function deleteRule() {
    "use server"
    const s = await createClient()
    const {
      data: { user },
    } = await s.auth.getUser()
    if (!user) redirect("/login")
    await s.from("recurring_invoice_rules").delete().eq("id", id).eq("user_id", user.id)
    redirect("/app/recurring")
  }

  return (
    <>
      <PageHeader
        title="Edit Recurring Rule"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Recurring", href: "/app/recurring" },
          { label: "Edit" },
        ]}
      />
      <div className="p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{rule.client?.name || "Recurring Rule"}</CardTitle>
            <CardDescription>Update schedule & options</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateRule} className="space-y-4">
              <input type="hidden" name="client_id" defaultValue={rule.client_id} />
              <div className="space-y-2">
                <Label htmlFor="base_invoice_id">Base invoice ID (optional)</Label>
                <Input id="base_invoice_id" name="base_invoice_id" defaultValue={rule.base_invoice_id ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="day_of_month">Day of month (1–28)</Label>
                <Input
                  id="day_of_month"
                  name="day_of_month"
                  type="number"
                  min={1}
                  max={28}
                  defaultValue={rule.day_of_month}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="auto_send" name="auto_send" defaultChecked={!!rule.auto_send} />
                <Label htmlFor="auto_send">Auto-send invoice emails</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminder_days">Reminder days (comma-separated)</Label>
                <Input
                  id="reminder_days"
                  name="reminder_days"
                  defaultValue={rule.reminder_days ?? "3,5,7"}
                  placeholder="3,5,7"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="is_active" name="is_active" defaultChecked={!!rule.active} />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex gap-3">
                <Button type="submit">Save changes</Button>
                <form action={deleteRule}>
                  <Button variant="destructive">Delete</Button>
                </form>
                <Link href="/app/recurring">
                  <Button variant="outline" className="bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
