import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { CurrencyProvider } from "@/components/app/currency-provider"
import { CookieConsentProvider } from "@/components/cookie-consent/cookie-consent-provider"
import { getSiteUrl } from "@/lib/utils/site-url"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MakeInvo – Free Online Invoice Generator",
    template: "%s | MakeInvo",
  },
  description:
    "Generate professional invoices, download PDF invoices, manage recurring billing, and track payments with MakeInvo invoicing software.",
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
  authors: [{ name: "MakeInvo" }],
  creator: "MakeInvo",
  icons: {
    icon: "/make-invo-site-icon.webp",
    shortcut: "/make-invo-site-icon.webp",
    apple: "/make-invo-site-icon.webp",
  },
  openGraph: {
    siteName: "MakeInvo",
    type: "website",
    images: [
      {
        url: "/make-invo-og.png",
        width: 1200,
        height: 630,
        alt: "MakeInvo - Create, send, and get paid",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/make-invo-og.png"],
  },
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
          <CookieConsentProvider>{children}</CookieConsentProvider>
        </CurrencyProvider>
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
