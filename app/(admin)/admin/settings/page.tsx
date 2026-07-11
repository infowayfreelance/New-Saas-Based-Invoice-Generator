import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { revalidatePath } from "next/cache"

async function updateSettings(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const settingsId = formData.get("settingsId") as string
  const freeDailyLimit = formData.get("freeDailyLimit") as string
  const freeMonthlyLimit = formData.get("freeMonthlyLimit") as string
  const basicDailyLimit = formData.get("basicDailyLimit") as string
  const basicMonthlyLimit = formData.get("basicMonthlyLimit") as string

  await supabase
    .from("global_settings")
    .update({
      free_guest_daily_limit: Number.parseInt(freeDailyLimit),
      free_guest_monthly_limit: Number.parseInt(freeMonthlyLimit),
      basic_daily_limit: Number.parseInt(basicDailyLimit),
      basic_monthly_limit: Number.parseInt(basicMonthlyLimit),
    })
    .eq("id", settingsId)

  revalidatePath("/admin/settings")
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase.from("global_settings").select("*").single()

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <AdminHeader title="Settings" description="Manage global application settings" />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateSettings} className="space-y-6">
              <input type="hidden" name="settingsId" value={settings?.id} />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Free / Guest Users</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Daily Limit</Label>
                    <Input name="freeDailyLimit" type="number" defaultValue={settings?.free_guest_daily_limit || 3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Limit</Label>
                    <Input
                      name="freeMonthlyLimit"
                      type="number"
                      defaultValue={settings?.free_guest_monthly_limit || 15}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Basic Plan Users</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Daily Limit</Label>
                    <Input name="basicDailyLimit" type="number" defaultValue={settings?.basic_daily_limit || 5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Limit</Label>
                    <Input name="basicMonthlyLimit" type="number" defaultValue={settings?.basic_monthly_limit || 30} />
                  </div>
                </div>
              </div>

              <Button type="submit">Save Settings</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
