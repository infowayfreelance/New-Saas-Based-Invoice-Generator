import { redirect } from "next/navigation"
import Link from "next/link"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default async function NewAccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Check if user has PRO plan
  const { data: userData } = await supabase.from("users").select(`*, plan:plans(*)`).eq("id", user.id).single()

  const planCode = userData?.plan?.code || "GUEST"
  if (planCode !== "PRO") {
    redirect("/app/accounts")
  }

  async function createAccount(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const payload = {
      user_id: user.id,
      account_name: String(formData.get("account_name") || "").trim(),
      bank_name: String(formData.get("bank_name") || "").trim(),
      account_number: String(formData.get("account_number") || "").trim(),
      routing_number: String(formData.get("routing_number") || "").trim() || null,
      swift_code: String(formData.get("swift_code") || "").trim() || null,
      currency: String(formData.get("currency") || "USD").trim(),
      is_default: formData.get("is_default") === "on",
    }

    if (!payload.account_name || !payload.bank_name || !payload.account_number) {
      throw new Error("Missing required fields")
    }

    // If setting as default, unset other defaults first
    if (payload.is_default) {
      await supabase.from("bank_accounts").update({ is_default: false }).eq("user_id", user.id).eq("is_default", true)
    }

    const { error } = await supabase.from("bank_accounts").insert(payload)
    if (error) throw error

    revalidatePath("/app/accounts")
    redirect("/app/accounts")
  }

  return (
    <>
      <PageHeader
        title="Add Bank Account"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Accounts", href: "/app/accounts" },
          { label: "New" },
        ]}
      />

      <div className="p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>New bank account</CardTitle>
            <CardDescription>
              Details will be masked on invoices (only last 4 digits of account number).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createAccount} className="space-y-4">
              <div>
                <Label htmlFor="account_name">Account name</Label>
                <Input id="account_name" name="account_name" required placeholder="Business Checking" />
              </div>
              <div>
                <Label htmlFor="bank_name">Bank name</Label>
                <Input id="bank_name" name="bank_name" required placeholder="Chase Bank" />
              </div>
              <div>
                <Label htmlFor="account_number">Account number</Label>
                <Input id="account_number" name="account_number" required placeholder="1234567890" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="routing_number">Routing number (optional)</Label>
                  <Input id="routing_number" name="routing_number" placeholder="021000021" />
                </div>
                <div>
                  <Label htmlFor="swift_code">SWIFT (optional)</Label>
                  <Input id="swift_code" name="swift_code" placeholder="CHASUS33" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" name="currency" defaultValue="USD" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox id="is_default" name="is_default" />
                  <Label htmlFor="is_default">Make default for invoices</Label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit">Save</Button>
                <Link href="/app/accounts">
                  <Button variant="outline" type="button">
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
