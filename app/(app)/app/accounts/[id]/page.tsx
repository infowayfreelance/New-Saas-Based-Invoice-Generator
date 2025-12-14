import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export default async function EditAccountPage({ params }: { params: { id: string } }) {
  if (!isValidUUID(params.id)) {
    notFound()
  }

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

  const { data: account } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!account) notFound()

  async function updateAccount(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const accountId = String(formData.get("id") || "")

    const patch = {
      account_name: String(formData.get("account_name") || "").trim(),
      bank_name: String(formData.get("bank_name") || "").trim(),
      account_number: String(formData.get("account_number") || "").trim(),
      routing_number: String(formData.get("routing_number") || "").trim() || null,
      swift_code: String(formData.get("swift_code") || "").trim() || null,
      currency: String(formData.get("currency") || "USD").trim(),
      is_default: formData.get("is_default") === "on",
      updated_at: new Date().toISOString(),
    }

    // If setting as default, unset other defaults first
    if (patch.is_default) {
      await supabase
        .from("bank_accounts")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .eq("is_default", true)
        .neq("id", accountId) // Don't unset the one we're updating
    }

    const { error } = await supabase.from("bank_accounts").update(patch).eq("id", accountId).eq("user_id", user.id)

    if (error) throw error

    revalidatePath("/app/accounts")
    redirect("/app/accounts")
  }

  async function deleteAccount(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const accountId = String(formData.get("id") || "")

    await supabase.from("bank_accounts").delete().eq("id", accountId).eq("user_id", user.id)

    revalidatePath("/app/accounts")
    redirect("/app/accounts")
  }

  return (
    <>
      <PageHeader
        title="Edit Bank Account"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Accounts", href: "/app/accounts" },
          { label: "Edit" },
        ]}
      />

      <div className="p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{account.account_name}</CardTitle>
            <CardDescription>Update or remove this account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateAccount} className="space-y-4">
              <input type="hidden" name="id" defaultValue={account.id} />
              <div>
                <Label htmlFor="account_name">Account name</Label>
                <Input id="account_name" name="account_name" defaultValue={account.account_name} required />
              </div>
              <div>
                <Label htmlFor="bank_name">Bank name</Label>
                <Input id="bank_name" name="bank_name" defaultValue={account.bank_name} required />
              </div>
              <div>
                <Label htmlFor="account_number">Account number</Label>
                <Input id="account_number" name="account_number" defaultValue={account.account_number} required />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="routing_number">Routing number</Label>
                  <Input id="routing_number" name="routing_number" defaultValue={account.routing_number ?? ""} />
                </div>
                <div>
                  <Label htmlFor="swift_code">SWIFT</Label>
                  <Input id="swift_code" name="swift_code" defaultValue={account.swift_code ?? ""} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" name="currency" defaultValue={account.currency ?? "USD"} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox id="is_default" name="is_default" defaultChecked={!!account.is_default} />
                  <Label htmlFor="is_default">Make default</Label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit">Save changes</Button>
                <Link href="/app/accounts">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>

            <form action={deleteAccount} className="mt-6 border-t pt-6">
              <input type="hidden" name="id" defaultValue={account.id} />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-destructive">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground">Permanently delete this bank account.</p>
                </div>
                <Button variant="destructive" type="submit">
                  Delete Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
