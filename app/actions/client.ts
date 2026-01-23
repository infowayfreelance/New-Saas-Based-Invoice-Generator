"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function deleteClient(clientId: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", clientId)
      .eq("user_id", user.id)

    if (error) {
      console.error("[v0] Client delete error:", error)
      return { error: error.message || "Failed to delete client" }
    }

    revalidatePath("/app/clients")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Unexpected error in deleteClient:", error)
    return { error: error?.message || "An unexpected error occurred" }
  }
}
