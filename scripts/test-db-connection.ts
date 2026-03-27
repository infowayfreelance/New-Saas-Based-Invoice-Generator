// Test database connection
const connectionString = process.env.POSTGRES_URL

console.log("[v0] Testing database connection...")
console.log("[v0] Connection string exists:", !!connectionString)

if (connectionString) {
  // Check if it looks like a valid postgres URL
  const isValidFormat = connectionString.startsWith("postgresql://") || connectionString.startsWith("postgres://")
  console.log("[v0] Valid PostgreSQL URL format:", isValidFormat)
  
  // Extract host for debugging (without password)
  try {
    const url = new URL(connectionString)
    console.log("[v0] Host:", url.hostname)
    console.log("[v0] Port:", url.port)
    console.log("[v0] Database:", url.pathname.slice(1))
    console.log("[v0] Username:", url.username)
    console.log("[v0] Password set:", url.password ? "YES" : "NO")
  } catch (e) {
    console.log("[v0] Failed to parse URL:", e)
  }
} else {
  console.log("[v0] POSTGRES_URL is not set!")
}
