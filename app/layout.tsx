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
    default: "InvoiceFlow – Free Online Invoice Generator",
    template: "%s | InvoiceFlow",
  },
  description:
    "Generate professional invoices, download PDF invoices, manage recurring billing, and track payments with InvoiceFlow invoicing software.",
  keywords: [
    "free online invoice generator",
    "invoice generator",
    "invoicing software",
    "PDF invoice",
    "billing software",
    "client management",
    "payment tracking",
    "freelancer invoicing",
    "small business invoicing",
  ],
  authors: [{ name: "InvoiceFlow" }],
  creator: "InvoiceFlow",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
