"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function verifyAdmin() {
  const supabase = await createClient()

  // Get current session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("Unauthorized: Not authenticated")
  }

  // Check if user is admin
  const { data: userData, error: userError } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (userError || userData?.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required")
  }

  return { supabase, adminId: user.id }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const { supabase } = await verifyAdmin()

    // Validate role
    if (!["USER", "ADMIN"].includes(role)) {
      return { success: false, error: "Invalid role" }
    }

    // Update user role
    const { error } = await supabase
      .from("users")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (error) {
      console.error("[v0] Admin updateUserRole error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath(`/admin/users/${userId}`)
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Admin updateUserRole catch:", error)
    return { success: false, error: error.message }
  }
}

export async function updateUserPlan(userId: string, planId: string) {
  try {
    const { supabase } = await verifyAdmin()

    // Verify plan exists
    const { data: plan, error: planError } = await supabase.from("plans").select("id, code").eq("id", planId).single()

    if (planError || !plan) {
      return { success: false, error: "Invalid plan selected" }
    }

    // Update user plan
    const { error: userError } = await supabase
      .from("users")
      .update({ plan_id: planId, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (userError) {
      console.error("[v0] Admin updateUserPlan user update error:", userError)
      return { success: false, error: userError.message }
    }

    const { error: subError } = await supabase.from("subscriptions").upsert(
      {
        user_id: userId,
        current_plan_id: planId,
        status: "ACTIVE",
        current_period_start: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    )

    if (subError) {
      console.error("[v0] Admin updateUserPlan subscription error:", subError)
      // Don't fail if subscription update fails, user plan is already updated
    }

    revalidatePath(`/admin/users/${userId}`)
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Admin updateUserPlan catch:", error)
    return { success: false, error: error.message }
  }
}
