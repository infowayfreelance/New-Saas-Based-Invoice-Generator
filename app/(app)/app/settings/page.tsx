import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building, Mail, Palette, ChevronRight, Settings, FileText } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const settingsLinks = [
    {
      title: "Profile",
      description: "Manage your personal information",
      href: "/app/settings/profile",
      icon: User,
    },
    {
      title: "Company",
      description: "Business details and invoice defaults",
      href: "/app/settings/company",
      icon: Building,
    },
    {
      title: "Email",
      description: "Email sending preferences",
      href: "/app/settings/email",
      icon: Mail,
    },
    {
      title: "Branding",
      description: "Customize your invoice appearance",
      href: "/app/settings/branding",
      icon: Palette,
    },
    {
      title: "Terms & Conditions",
      description: "Save and manage reusable Terms & Conditions templates",
      href: "/app/settings/terms",
      icon: FileText,
    },
  ]

  return (
    <>
      <PageHeader title="Settings" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Settings" }]} />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {settingsLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
