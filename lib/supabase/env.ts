/**
 * Normalizes a Supabase project URL env var.
 *
 * Supabase's client libraries append their own paths (e.g. /auth/v1/token)
 * onto whatever base URL is configured. If someone pastes the Project URL
 * with a path already attached (e.g. ".../auth/v1" or ".../rest/v1") or a
 * trailing slash, the resulting doubled path causes GoTrue to reject
 * requests with "Invalid path specified in request URL". Strip those here
 * so a common copy-paste mistake doesn't break auth.
 */
export function normalizeSupabaseUrl(url: string): string {
  return url.trim().replace(/\/(auth|rest|storage|realtime)\/v1\/?$/i, "").replace(/\/+$/, "")
}
