import { headers } from "next/headers"

/**
 * Get client IP address from request headers.
 * Works correctly on Vercel and other reverse proxy environments.
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers()

  // x-forwarded-for can contain multiple IPs: client, proxy1, proxy2
  // The first one is the original client IP
  const forwardedFor = headersList.get("x-forwarded-for")
  if (forwardedFor) {
    const ips = forwardedFor.split(",")
    const clientIp = ips[0].trim()
    if (clientIp && clientIp !== "::1" && clientIp !== "127.0.0.1") {
      return clientIp
    }
  }

  // Fallback to x-real-ip (used by some proxies like nginx)
  const realIp = headersList.get("x-real-ip")
  if (realIp && realIp !== "::1" && realIp !== "127.0.0.1") {
    return realIp
  }

  // Vercel-specific header
  const vercelIp = headersList.get("x-vercel-forwarded-for")
  if (vercelIp) {
    const ips = vercelIp.split(",")
    const clientIp = ips[0].trim()
    if (clientIp && clientIp !== "::1" && clientIp !== "127.0.0.1") {
      return clientIp
    }
  }

  // Last resort - return unknown (will still allow usage but won't track properly)
  return "unknown"
}
