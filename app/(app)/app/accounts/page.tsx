import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Lock, Building2, Wallet } from "lucide-react"

export default async function AccountsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Bank accounts feature coming soon
  const { data: userData } = await supabase.from("users").select(`*, plan:plans(*)`).eq("id", user.id).single()

  const planCode = userData?.plan?.code || "BASIC"
  const canAccessAccounts = planCode === "PRO"

  let accounts = null

  if (canAccessAccounts) {
    const { data: fetchedAccounts } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
    accounts = fetchedAccounts
  }

}
