// This prevents build failures when optional env vars are missing

const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const

const serverOnly = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "PAYPAL_MODE",
  "PAYPAL_WEBHOOK_ID",
] as const

// Service role key may come under different names depending on how the Supabase
// integration was connected. We check all known variants.
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SECRET_KEY

if (typeof window === "undefined" && process.env.NODE_ENV !== "production" && !serviceRoleKey) {
  console.warn("Warning: Missing server environment variable: SUPABASE_SERVICE_ROLE_KEY (or equivalent)")
}

// Only validate in runtime, not during build
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  // Check required vars (both client and server)
  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`Warning: Missing required environment variable: ${key}`)
    }
  }

  // Check server-only vars
  for (const key of serverOnly) {
    if (!process.env[key]) {
      console.warn(`Warning: Missing server environment variable: ${key}`)
    }
  }
}

export {}
