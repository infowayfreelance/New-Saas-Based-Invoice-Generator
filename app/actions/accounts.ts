"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createAccountAction(formData: FormData) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

    const accountName = String(formData.get("account_name") || "").trim()
    const bankName = String(formData.get("bank_name") || "").trim()
    const accountNumber = String(formData.get("account_number") || "").trim()

    if (!accountName || !bankName || !accountNumber) {
      return { error: "Account name, bank name, and account number are required" }
    }

    const payload = {
      user_id: user.id,
      account_name: accountName,
      bank_name: bankName,
      account_number: accountNumber,
      routing_number: String(formData.get("routing_number") || "").trim() || null,
      swift_code: String(formData.get("swift_code") || "").trim() || null,
      sort_code: String(formData.get("sort_code") || "").trim() || null,
      bank_address: String(formData.get("bank_address") || "").trim() || null,
      currency: String(formData.get("currency") || "USD").trim(),
      is_default: formData.get("is_default") === "on",
    }

    console.log("[v0] Creating bank account with payload:", {
      ...payload,
      account_number: "***" + payload.account_number.slice(-4),
    })

    // If setting as default, unset other defaults first
    if (payload.is_default) {
      await supabase.from("bank_accounts").update({ is_default: false }).eq("user_id", user.id).eq("is_default", true)
    }

    const { data, error } = await supabase.from("bank_accounts").insert(payload).select().single()

    if (error) {
      console.error("[v0] Bank account insert error:", error)
      return { error: error.message || "Failed to create bank account" }
    }

    console.log("[v0] Bank account created successfully:", data?.id)

    revalidatePath("/app/accounts")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Unexpected error in createAccountAction:", error)
    return { error: error?.message || "An unexpected error occurred" }
  }
}

export async function updateAccountAction(accountId: string, formData: FormData) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

    const accountName = String(formData.get("account_name") || "").trim()
    const bankName = String(formData.get("bank_name") || "").trim()
    const accountNumber = String(formData.get("account_number") || "").trim()

    if (!accountName || !bankName || !accountNumber) {
      return { error: "Account name, bank name, and account number are required" }
    }

    const patch = {
      account_name: accountName,
      bank_name: bankName,
      account_number: accountNumber,
      routing_number: String(formData.get("routing_number") || "").trim() || null,
      swift_code: String(formData.get("swift_code") || "").trim() || null,
      sort_code: String(formData.get("sort_code") || "").trim() || null,
      bank_address: String(formData.get("bank_address") || "").trim() || null,
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
        .neq("id", accountId)
    }

    const { data, error } = await supabase
      .from("bank_accounts")
      .update(patch)
      .eq("id", accountId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Bank account update error:", error)
      return { error: error.message || "Failed to update bank account" }
    }

    revalidatePath("/app/accounts")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Unexpected error in updateAccountAction:", error)
    return { error: error?.message || "An unexpected error occurred" }
  }
}

export async function deleteAccountAction(accountId: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

    const { error } = await supabase.from("bank_accounts").delete().eq("id", accountId).eq("user_id", user.id)

    if (error) {
      console.error("[v0] Bank account delete error:", error)
      return { error: error.message || "Failed to delete bank account" }
    }

    revalidatePath("/app/accounts")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Unexpected error in deleteAccountAction:", error)
    return { error: error?.message || "An unexpected error occurred" }
  }
}
