import { createClient } from "@/lib/supabase/server"

interface UsageLimits {
  canCreate: boolean
  dailyUsed: number
  dailyLimit: number | null
  monthlyUsed: number
  monthlyLimit: number | null
  message?: string
}

const DEFAULT_GUEST_DAILY_LIMIT = 3
const DEFAULT_GUEST_MONTHLY_LIMIT = 15

async function safeQuery<T>(queryFn: () => Promise<{ data: T | null; error: any }>): Promise<T | null> {
  try {
    const { data, error } = await queryFn()
    if (error) {
      // Table doesn't exist or other schema error - return null
      if (error.code === "PGRST205" || error.code === "42P01" || error.code === "PGRST116") {
        return null
      }
      // Log other errors but don't throw
      console.error("Query error:", error)
      return null
    }
    return data
  } catch (e) {
    console.error("Query exception:", e)
    return null
  }
}

export async function checkUsageLimits(userId: string | null, ipAddress: string): Promise<UsageLimits> {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]
  const month = today.substring(0, 7)

  try {
    const globalSettings = await safeQuery(() => supabase.from("global_settings").select("*").maybeSingle())

    // If no settings (table doesn't exist), use defaults for guests
    if (!globalSettings && !userId) {
      return {
        canCreate: true,
        dailyUsed: 0,
        dailyLimit: DEFAULT_GUEST_DAILY_LIMIT,
        monthlyUsed: 0,
        monthlyLimit: DEFAULT_GUEST_MONTHLY_LIMIT,
      }
    }

    if (!userId) {
      // Guest user - check by IP
      const usageLog = await safeQuery(() =>
        supabase
          .from("usage_logs")
          .select("*")
          .eq("ip_address", ipAddress)
          .eq("date", today)
          .is("user_id", null)
          .maybeSingle(),
      )

      const dailyLimit = globalSettings?.free_guest_daily_limit ?? DEFAULT_GUEST_DAILY_LIMIT
      const monthlyLimit = globalSettings?.free_guest_monthly_limit ?? DEFAULT_GUEST_MONTHLY_LIMIT

      // If no usage log table, allow with defaults
      const dailyUsed = usageLog?.invoices_today ?? 0

      // Try to get monthly count
      let monthlyUsed = 0
      try {
        const { count } = await supabase
          .from("usage_logs")
          .select("invoices_today", { count: "exact" })
          .eq("ip_address", ipAddress)
          .like("month", month)
          .is("user_id", null)
        monthlyUsed = count ?? 0
      } catch {
        monthlyUsed = 0
      }

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
    const user = await safeQuery(() => supabase.from("users").select("*, plan:plans(*)").eq("id", userId).maybeSingle())

    // If users table doesn't exist, allow with unlimited
    if (!user) {
      return {
        canCreate: true,
        dailyUsed: 0,
        dailyLimit: null,
        monthlyUsed: 0,
        monthlyLimit: null,
      }
    }

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
    const usageLog = await safeQuery(() =>
      supabase.from("usage_logs").select("*").eq("user_id", userId).eq("date", today).maybeSingle(),
    )

    const dailyUsed = usageLog?.invoices_today ?? 0

    // Get monthly count
    let monthlyUsed = 0
    try {
      const { count } = await supabase
        .from("invoices")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .gte("created_at", `${month}-01`)
      monthlyUsed = count ?? 0
    } catch {
      monthlyUsed = 0
    }

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
  } catch (error) {
    console.error("Error checking usage limits:", error)
    return {
      canCreate: true,
      dailyUsed: 0,
      dailyLimit: DEFAULT_GUEST_DAILY_LIMIT,
      monthlyUsed: 0,
      monthlyLimit: DEFAULT_GUEST_MONTHLY_LIMIT,
    }
  }
}

export async function incrementUsage(userId: string | null, ipAddress: string): Promise<void> {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]
  const month = today.substring(0, 7)

  try {
    if (!userId) {
      // Guest user
      const existing = await safeQuery(() =>
        supabase
          .from("usage_logs")
          .select("*")
          .eq("ip_address", ipAddress)
          .eq("date", today)
          .is("user_id", null)
          .maybeSingle(),
      )

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
      const existing = await safeQuery(() =>
        supabase.from("usage_logs").select("*").eq("user_id", userId).eq("date", today).maybeSingle(),
      )

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
  } catch (error) {
    // Silently fail - usage tracking is not critical
    console.error("Error incrementing usage:", error)
  }
}
