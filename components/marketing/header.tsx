"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Menu, X } from "lucide-react"

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">InvoiceFlow</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/free-invoice"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Free Invoice
            </Link>
          </div>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Start Free Trial</Button>
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/features"
              className="block rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/free-invoice"
              className="block rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Free Invoice
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full bg-transparent">
                  Sign in
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
