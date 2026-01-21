import "server-only"

/**
 * PayPal Service Utility
 * Handles PayPal API authentication and communication
 * Server-side only module
 */

interface PayPalAccessToken {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}

interface CachedToken {
  token: string
  expiresAt: number
}

let cachedToken: CachedToken | null = null

/**
 * Get the PayPal API base URL based on mode
 */
function getPayPalBaseUrl(): string {
  const mode = process.env.PAYPAL_MODE || "sandbox"
  return mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"
}

/**
 * Validate PayPal environment variables
 */
function validatePayPalEnv(): void {
  if (!process.env.PAYPAL_CLIENT_ID) {
    throw new Error("PAYPAL_CLIENT_ID environment variable is not set")
  }
  if (!process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error("PAYPAL_CLIENT_SECRET environment variable is not set")
  }
}

/**
 * Generate PayPal access token using client credentials
 * Tokens are cached until 5 minutes before expiration
 */
export async function getPayPalAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  validatePayPalEnv()

  const baseUrl = getPayPalBaseUrl()
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!

  // Encode credentials for Basic Auth
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  try {
    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`PayPal authentication failed: ${response.status} - ${error}`)
    }

    const data: PayPalAccessToken = await response.json()

    // Cache token with 5-minute buffer before expiration
    const expiresIn = data.expires_in * 1000 // Convert to milliseconds
    const bufferTime = 5 * 60 * 1000 // 5 minutes
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + expiresIn - bufferTime,
    }

    return data.access_token
  } catch (error) {
    console.error("[v0] PayPal authentication error:", error)
    throw error
  }
}

/**
 * Make an authenticated request to PayPal API
 */
export async function paypalRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getPayPalAccessToken()
  const baseUrl = getPayPalBaseUrl()

  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`PayPal API request failed: ${response.status} - ${error}`)
  }

  return response.json() as Promise<T>
}

/**
 * Get PayPal configuration
 */
export function getPayPalConfig() {
  validatePayPalEnv()
  
  return {
    clientId: process.env.PAYPAL_CLIENT_ID!,
    mode: (process.env.PAYPAL_MODE || "sandbox") as "sandbox" | "live",
    baseUrl: getPayPalBaseUrl(),
  }
}

/**
 * Clear cached access token (useful for testing or manual refresh)
 */
export function clearPayPalTokenCache(): void {
  cachedToken = null
}
