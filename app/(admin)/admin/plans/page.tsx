import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { revalidatePath } from "next/cache"

async function updatePlan(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const planId = formData.get("planId") as string
  const name = formData.get("name") as string
  const price = formData.get("price") as string
  const dailyLimit = formData.get("dailyLimit") as string
  const monthlyLimit = formData.get("monthlyLimit") as string

  await supabase
    .from("plans")
    .update({
      name,
      price_monthly: Number.parseFloat(price),
      invoice_limit_per_day: dailyLimit ? Number.parseInt(dailyLimit) : null,
      invoice_limit_per_month: monthlyLimit ? Number.parseInt(monthlyLimit) : null,
    })
    .eq("id", planId)

  revalidatePath("/admin/plans")
}

export default async function AdminPlansPage() {
  const supabase = await createClient()

  const { data: plans } = await supabase.from("plans").select("*").order("price_monthly", { ascending: true })

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <AdminHeader title="Plans" description="Manage subscription plans" />
      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-6">
          {plans?.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  <Badge variant={plan.code === "PRO" ? "default" : plan.code === "STANDARD" ? "secondary" : "outline"}>
                    {plan.code}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <form action={updatePlan} className="grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="planId" value={plan.id} />
                  <div className="space-y-2">
                    <Label>Plan Name</Label>
                    <Input name="name" defaultValue={plan.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (Monthly)</Label>
                    <Input name="price" type="number" step="0.01" defaultValue={plan.price_monthly} />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Invoice Limit</Label>
                    <Input
                      name="dailyLimit"
                      type="number"
                      placeholder="Unlimited"
                      defaultValue={plan.invoice_limit_per_day || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Invoice Limit</Label>
                    <Input
                      name="monthlyLimit"
                      type="number"
                      placeholder="Unlimited"
                      defaultValue={plan.invoice_limit_per_month || ""}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
