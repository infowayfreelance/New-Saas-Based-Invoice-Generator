import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { CurrencyProvider } from "@/components/app/currency-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "InvoiceFlow - Professional Invoice Generator",
    template: "%s | InvoiceFlow",
  },
  description:
    "Create professional invoices in seconds. Manage clients, track payments, and grow your business with our powerful invoicing platform.",
  keywords: ["invoice generator", "invoicing software", "billing software", "client management", "payment tracking"],
  authors: [{ name: "InvoiceFlow" }],
  creator: "InvoiceFlow",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
