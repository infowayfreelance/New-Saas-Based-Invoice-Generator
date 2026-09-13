import Link from "next/link"
import Image from "next/image"
import { CookieSettingsLink } from "@/components/cookie-consent/cookie-settings-link"

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-6">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/Make-invo-logo.webp"
                alt="MakeInvo"
                width={821}
                height={273}
                className="h-10 w-auto"
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
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Free Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/invoice-templates" className="text-muted-foreground hover:text-foreground">
                  Invoice Templates
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
            <h3 className="mb-4 text-sm font-semibold">Solutions</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/invoice-generator-for-freelancers" className="text-muted-foreground hover:text-foreground">
                  Freelancers
                </Link>
              </li>
              <li>
                <Link href="/invoice-generator-for-contractors" className="text-muted-foreground hover:text-foreground">
                  Contractors
                </Link>
              </li>
              <li>
                <Link href="/invoice-generator-for-consultants" className="text-muted-foreground hover:text-foreground">
                  Consultants
                </Link>
              </li>
              <li>
                <Link href="/invoice-generator-for-designers" className="text-muted-foreground hover:text-foreground">
                  Designers
                </Link>
              </li>
              <li>
                <Link href="/invoice-generator-for-photographers" className="text-muted-foreground hover:text-foreground">
                  Photographers
                </Link>
              </li>
              <li>
                <Link href="/invoice-generator-for-agencies" className="text-muted-foreground hover:text-foreground">
                  Agencies
                </Link>
              </li>
              <li>
                <Link href="/invoice-generator-for-small-businesses" className="text-muted-foreground hover:text-foreground">
                  Small Businesses
                </Link>
              </li>
              <li>
                <Link href="/invoice-generator-for-tradespeople" className="text-muted-foreground hover:text-foreground">
                  Tradespeople
                </Link>
              </li>
              <li>
                <Link href="/invoice-generator-for-self-employed" className="text-muted-foreground hover:text-foreground">
                  Self-Employed
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-muted-foreground hover:text-foreground">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/affiliate-program" className="text-muted-foreground hover:text-foreground">
                  Affiliate Programme
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="text-muted-foreground hover:text-foreground">
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-muted-foreground hover:text-foreground">
                  Refund and Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/billing-disputes" className="text-muted-foreground hover:text-foreground">
                  Billing and Dispute Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/acceptable-use" className="text-muted-foreground hover:text-foreground">
                  Acceptable Use Policy
                </Link>
              </li>
              <li>
                <Link href="/data-deletion" className="text-muted-foreground hover:text-foreground">
                  Data Deletion
                </Link>
              </li>
              <li>
                <Link href="/subprocessors" className="text-muted-foreground hover:text-foreground">
                  Subprocessors
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MakeInvo. All rights reserved.
          </p>
          <p className="flex items-center gap-4 text-sm text-muted-foreground">
            <CookieSettingsLink className="hover:text-foreground" />
            <Link href="/login" className="hover:text-foreground">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
