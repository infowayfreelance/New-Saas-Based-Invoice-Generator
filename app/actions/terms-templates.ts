"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export interface TermsTemplate {
  id: string
  name: string
  content: string
  created_at: string
  updated_at: string
}

export async function listTermsTemplates(): Promise<TermsTemplate[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("terms_templates")
    .select("id, name, content, created_at, updated_at")
    .eq("user_id", user.id)
    .order("name", { ascending: true })

  if (error) {
    console.error("[v0] Failed to list terms templates:", error)
    return []
  }

  return data || []
}

export async function saveTermsTemplate(
  input: { id?: string; name: string; content: string },
): Promise<{ success: boolean; error?: string; template?: TermsTemplate }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const name = input.name.trim()
  if (!name) return { success: false, error: "Please enter a name for this template." }

  if (input.id) {
    const { data, error } = await supabase
      .from("terms_templates")
      .update({ name, content: input.content, updated_at: new Date().toISOString() })
      .eq("id", input.id)
      .eq("user_id", user.id)
      .select("id, name, content, created_at, updated_at")
      .single()

    if (error) return { success: false, error: error.message }
    revalidatePath("/app/settings")
    return { success: true, template: data }
  }

  const { data, error } = await supabase
    .from("terms_templates")
    .insert({ user_id: user.id, name, content: input.content })
    .select("id, name, content, created_at, updated_at")
    .single()

  if (error) return { success: false, error: error.message }
  revalidatePath("/app/settings")
  return { success: true, template: data }
}

export async function deleteTermsTemplate(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { error } = await supabase.from("terms_templates").delete().eq("id", id).eq("user_id", user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath("/app/settings")
  return { success: true }
}
