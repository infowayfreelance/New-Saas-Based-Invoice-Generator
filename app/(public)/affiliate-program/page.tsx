import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/utils/site-url"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, TrendingUp, Gift } from "lucide-react"

export const metadata: Metadata = {
  title: "Affiliate Program",
  description: "Earn commissions by referring customers to InvoiceFlow",
}

const siteUrl = getSiteUrl()

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Affiliate Program", item: `${siteUrl}/affiliate-program` },
  ],
}

export default function AffiliateProgramPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Affiliate Program</h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Earn recurring commissions by sharing InvoiceFlow with your network
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>20% Commission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Earn 20% recurring commission on every payment from customers you refer. Commissions are paid monthly.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>No Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                There is no cap on how much you can earn. The more customers you refer, the more you make.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>90-Day Cookie</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your referral link has a 90-day cookie. If someone clicks your link and signs up within 90 days, you get
                credit.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Marketing Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get access to banners, email templates, and other promotional materials to help you succeed.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        <div className="mt-16 rounded-2xl border border-border bg-muted/30 p-8 text-center">
          <h2 className="text-2xl font-bold">Ready to start earning?</h2>
          <p className="mt-2 text-muted-foreground">
            Log in to your account to access your unique affiliate link and dashboard.
          </p>
          <div className="mt-6">
            <Link href="/login">
              <Button size="lg">Log In to Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
