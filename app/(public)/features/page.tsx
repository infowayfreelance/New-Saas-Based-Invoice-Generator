import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Users,
  BarChart3,
  RefreshCw,
  Send,
  CreditCard,
  Palette,
  Bell,
  Shield,
  Download,
  ArrowRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Features",
  description: "Discover all the powerful features InvoiceFlow offers to streamline your invoicing workflow.",
}

const featureCategories = [
  {
    title: "Invoicing",
    description: "Create and manage professional invoices",
    features: [
      {
        icon: FileText,
        title: "Invoice Generator",
        description:
          "Create beautiful, professional invoices in seconds with our intuitive builder. Add items, calculate totals automatically, and customize to match your brand.",
      },
      {
        icon: Download,
        title: "PDF Export",
        description:
          "Download your invoices as high-quality PDF files ready to share with clients or keep for your records.",
      },
      {
        icon: Send,
        title: "Email Delivery",
        description:
          "Send invoices directly to clients via email with professional templates. Track when invoices are sent and viewed.",
      },
    ],
  },
  {
    title: "Client Management",
    description: "Keep your clients organized",
    features: [
      {
        icon: Users,
        title: "Client Database",
        description:
          "Store all your client information in one place. Quick access to contact details, addresses, and notes.",
      },
      {
        icon: FileText,
        title: "Invoice History",
        description: "View complete invoice history for each client. Filter by status, date range, and payment status.",
      },
    ],
  },
  {
    title: "Automation",
    description: "Save time with automated features",
    features: [
      {
        icon: RefreshCw,
        title: "Recurring Invoices",
        description:
          "Set up automatic monthly invoices for retainer clients. Choose the day, enable auto-send, and let us handle the rest.",
      },
      {
        icon: Bell,
        title: "Payment Reminders",
        description:
          "Automatic late payment reminders at 3, 5, and 7 days after due date. Keep your cash flow healthy without awkward conversations.",
      },
    ],
  },
  {
    title: "Payment Tracking",
    description: "Track every dollar",
    features: [
      {
        icon: CreditCard,
        title: "Payment Recording",
        description:
          "Record payments with amount, date, and method. Support for partial payments and multiple payment entries per invoice.",
      },
      {
        icon: BarChart3,
        title: "Financial Reports",
        description:
          "Filter and view accounts by client, month, year, and status. Export reports for accounting and tax purposes.",
      },
    ],
  },
  {
    title: "Customization",
    description: "Make it yours",
    features: [
      {
        icon: Palette,
        title: "Templates & Branding",
        description:
          "Choose from multiple professional templates. Upload your logo, set brand colors, and add watermarks or digital signatures.",
      },
      {
        icon: Shield,
        title: "Secure & Private",
        description:
          "Your data is encrypted and secure. We never share your information with third parties. GDPR compliant.",
      },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Powerful features for modern invoicing
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Everything you need to create, send, and track invoices. Built for freelancers and small businesses.
          </p>
        </div>
        <div className="mt-20 space-y-20">
          {featureCategories.map((category) => (
            <div key={category.title}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold">{category.title}</h2>
                <p className="mt-1 text-muted-foreground">{category.description}</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.features.map((feature) => (
                  <Card key={feature.title} className="border-border/50">
                    <CardHeader>
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20 rounded-2xl border border-border bg-muted/30 p-8 text-center md:p-12">
          <h2 className="text-balance text-2xl font-bold sm:text-3xl">Ready to get started?</h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Create your first invoice in under 60 seconds. No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/free-invoice">
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                Create Free Invoice
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
