import Link from "next/link"
import Image from "next/image"

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/Make-invo-logo.webp"
                alt="MakeInvo"
                width={821}
                height={273}
                className="h-8 w-auto"
              />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              The free online invoice generator for freelancers, agencies, contractors, and small businesses.
              Create, send, and track professional invoices in minutes.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/free-invoice" className="text-muted-foreground hover:text-foreground">
                  Free Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/#invoice-examples" className="text-muted-foreground hover:text-foreground">
                  Invoice Examples
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/blog/how-to-write-an-invoice" className="text-muted-foreground hover:text-foreground">
                  How to Write an Invoice
                </Link>
              </li>
              <li>
                <Link href="/blog/invoice-vs-receipt" className="text-muted-foreground hover:text-foreground">
                  Invoice vs. Receipt
                </Link>
              </li>
              <li>
                <Link href="/blog/vat-invoice-guide" className="text-muted-foreground hover:text-foreground">
                  VAT Invoice Guide
                </Link>
              </li>
              <li>
                <Link href="/blog/freelancer-invoicing-guide" className="text-muted-foreground hover:text-foreground">
                  Freelancer Invoicing Guide
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/affiliate-program" className="text-muted-foreground hover:text-foreground">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MakeInvo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
