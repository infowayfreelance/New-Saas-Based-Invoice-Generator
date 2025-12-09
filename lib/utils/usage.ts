import { createClient } from "@/lib/supabase/server"

interface UsageLimits {
  canCreate: boolean
  dailyUsed: number
  dailyLimit: number | null
  monthlyUsed: number
  monthlyLimit: number | null
  message?: string
}

export async function checkUsageLimits(userId: string | null, ipAddress: string): Promise<UsageLimits> {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]
  const month = today.substring(0, 7) // YYYY-MM

  // Get global settings
  const { data: globalSettings } = await supabase.from("global_settings").select("*").single()

  if (!userId) {
    // Guest user - check by IP
    const { data: usageLog } = await supabase
      .from("usage_logs")
      .select("*")
      .eq("ip_address", ipAddress)
      .eq("date", today)
      .is("user_id", null)
      .single()

    const dailyLimit = globalSettings?.free_guest_daily_limit ?? 3
    const monthlyLimit = globalSettings?.free_guest_monthly_limit ?? 15

    // Get monthly count
    const { count: monthlyCount } = await supabase
      .from("usage_logs")
      .select("invoices_today", { count: "exact" })
      .eq("ip_address", ipAddress)
      .like("month", month)
      .is("user_id", null)

    const dailyUsed = usageLog?.invoices_today ?? 0
    const monthlyUsed = monthlyCount ?? 0

    if (dailyUsed >= dailyLimit) {
      return {
        canCreate: false,
        dailyUsed,
        dailyLimit,
        monthlyUsed,
        monthlyLimit,
        message: `You've reached your daily limit of ${dailyLimit} invoices. Sign up to create more!`,
      }
    }

    if (monthlyUsed >= monthlyLimit) {
      return {
        canCreate: false,
        dailyUsed,
        dailyLimit,
        monthlyUsed,
        monthlyLimit,
        message: `You've reached your monthly limit of ${monthlyLimit} invoices. Sign up to create more!`,
      }
    }

    return {
      canCreate: true,
      dailyUsed,
      dailyLimit,
      monthlyUsed,
      monthlyLimit,
    }
  }

  // Logged-in user - check plan limits
  const { data: user } = await supabase.from("users").select("*, plan:plans(*)").eq("id", userId).single()

  if (!user?.plan) {
    return {
      canCreate: false,
      dailyUsed: 0,
      dailyLimit: 0,
      monthlyUsed: 0,
      monthlyLimit: 0,
      message: "No active plan found",
    }
  }

  const dailyLimit = user.plan.invoice_limit_per_day
  const monthlyLimit = user.plan.invoice_limit_per_month

  // Unlimited plans
  if (dailyLimit === null && monthlyLimit === null) {
    return {
      canCreate: true,
      dailyUsed: 0,
      dailyLimit: null,
      monthlyUsed: 0,
      monthlyLimit: null,
    }
  }

  // Get usage for this user
  const { data: usageLog } = await supabase
    .from("usage_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .single()

  const dailyUsed = usageLog?.invoices_today ?? 0

  // Get monthly count
  const { count: monthlyCount } = await supabase
    .from("invoices")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .gte("created_at", `${month}-01`)

  const monthlyUsed = monthlyCount ?? 0

  if (dailyLimit !== null && dailyUsed >= dailyLimit) {
    return {
      canCreate: false,
      dailyUsed,
      dailyLimit,
      monthlyUsed,
      monthlyLimit,
      message: `You've reached your daily limit of ${dailyLimit} invoices. Upgrade your plan for more!`,
    }
  }

  if (monthlyLimit !== null && monthlyUsed >= monthlyLimit) {
    return {
      canCreate: false,
      dailyUsed,
      dailyLimit,
      monthlyUsed,
      monthlyLimit,
      message: `You've reached your monthly limit of ${monthlyLimit} invoices. Upgrade your plan for more!`,
    }
  }

  return {
    canCreate: true,
    dailyUsed,
    dailyLimit,
    monthlyUsed,
    monthlyLimit,
  }
}

export async function incrementUsage(userId: string | null, ipAddress: string): Promise<void> {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]
  const month = today.substring(0, 7)

  if (!userId) {
    // Guest user
    const { data: existing } = await supabase
      .from("usage_logs")
      .select("*")
      .eq("ip_address", ipAddress)
      .eq("date", today)
      .is("user_id", null)
      .single()

    if (existing) {
      await supabase
        .from("usage_logs")
        .update({
          invoices_today: existing.invoices_today + 1,
          invoices_this_month: existing.invoices_this_month + 1,
          last_invoice_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("usage_logs").insert({
        ip_address: ipAddress,
        date: today,
        month,
        invoices_today: 1,
        invoices_this_month: 1,
        last_invoice_at: new Date().toISOString(),
      })
    }
  } else {
    // Logged-in user
    const { data: existing } = await supabase
      .from("usage_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single()

    if (existing) {
      await supabase
        .from("usage_logs")
        .update({
          invoices_today: existing.invoices_today + 1,
          invoices_this_month: existing.invoices_this_month + 1,
          last_invoice_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("usage_logs").insert({
        user_id: userId,
        ip_address: ipAddress,
        date: today,
        month,
        invoices_today: 1,
        invoices_this_month: 1,
        last_invoice_at: new Date().toISOString(),
      })
    }
  }
}
