// Environment variable validation
// Import this file at the top of critical server-side code to fail fast on missing env vars

const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"] as const

const serverOnly = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"] as const

// Check required vars (both client and server)
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

// Check server-only vars (skip in browser/client bundles)
if (typeof window === "undefined") {
  for (const key of serverOnly) {
    if (!process.env[key]) {
      console.warn(`Warning: Missing server environment variable: ${key}`)
    }
  }
}

export {}
