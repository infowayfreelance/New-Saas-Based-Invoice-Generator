"use server"

import { createServiceClient } from "@/lib/supabase/service"
import { getClientIp } from "@/lib/utils/ip"
import { CONTACT_CATEGORIES } from "@/lib/contact-categories"

export interface ContactFormResult {
  success: boolean
  error?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Handles the public /contact form. No transactional email provider is
 * currently configured in this project, so submissions are recorded in the
 * `contact_messages` table for the team to review rather than claiming an
 * email is sent. `website` is a honeypot field - real users never see or
 * fill it in, so a non-empty value signals a bot and is silently dropped.
 */
export async function submitContactForm(formData: FormData): Promise<ContactFormResult> {
  const honeypot = String(formData.get("website") || "").trim()
  if (honeypot) {
    // Pretend success so bots don't learn the honeypot was detected.
    return { success: true }
  }

  const fullName = String(formData.get("fullName") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const category = String(formData.get("category") || "").trim()
  const subject = String(formData.get("subject") || "").trim()
  const message = String(formData.get("message") || "").trim()
  const accountEmail = String(formData.get("accountEmail") || "").trim()
  const reference = String(formData.get("reference") || "").trim()
  const consent = formData.get("consent") === "on"

  if (!fullName || fullName.length > 200) {
    return { success: false, error: "Please enter your full name." }
  }
  if (!email || !isValidEmail(email) || email.length > 320) {
    return { success: false, error: "Please enter a valid email address." }
  }
  if (!CONTACT_CATEGORIES.includes(category as (typeof CONTACT_CATEGORIES)[number])) {
    return { success: false, error: "Please choose a category." }
  }
  if (!subject || subject.length > 200) {
    return { success: false, error: "Please enter a subject." }
  }
  if (!message || message.length < 10 || message.length > 5000) {
    return { success: false, error: "Please enter a message (at least 10 characters)." }
  }
  if (!consent) {
    return { success: false, error: "Please confirm you've read the Privacy Policy." }
  }

  const ipAddress = await getClientIp()

  try {
    const supabase = createServiceClient()
    const { error } = await supabase.from("contact_messages").insert({
      full_name: fullName,
      email,
      category,
      subject,
      message,
      account_email: accountEmail || null,
      reference: reference || null,
      consent: true,
      ip_address: ipAddress,
    })

    if (error) {
      console.error("[contact] Failed to store message:", error)
      return { success: false, error: "Something went wrong sending your message. Please try again." }
    }

    return { success: true }
  } catch (error) {
    console.error("[contact] Unexpected error:", error)
    return { success: false, error: "Something went wrong sending your message. Please try again." }
  }
}
