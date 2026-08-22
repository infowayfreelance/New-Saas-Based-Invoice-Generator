import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Lock } from "lucide-react"
import Link from "next/link"
import { BrandingForm } from "@/components/templates/branding-form"

export default async function TemplatesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user's plan
  const { data: userData } = await supabase
    .from("users")
    .select(
      `
      *,
      plan:plans(*)
    `,
    )
    .eq("id", user.id)
    .single()

  const planCode = userData?.plan?.code || "BASIC"

  // Fetch all templates
  const { data: templates } = await supabase
    .from("invoice_templates")
    .select("*")
    .order("created_at", { ascending: true })

  // Separate global and user templates
  const globalTemplates = templates?.filter((t) => t.user_id === null) || []

  const canUseTemplate = (minPlan: string) => {
    const planOrder = ["BASIC", "STANDARD", "PRO"]
    return planOrder.indexOf(planCode) >= planOrder.indexOf(minPlan)
  }

  return (
    <>
      <PageHeader title="Templates" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Templates" }]} />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Templates</CardTitle>
            <CardDescription>
              Choose a template for your invoices. Higher tier plans unlock more options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {globalTemplates.map((template) => {
                const canUse = canUseTemplate(template.min_plan)
                return (
                  <Card
                    key={template.id}
                    className={`relative overflow-hidden transition-all ${canUse ? "hover:border-primary" : "opacity-60"}`}
                  >
                    {/* Preview */}
                    <div className="relative aspect-[8.5/11] border-b bg-white p-4">
                      <div className="flex h-full flex-col">
                        <div className="mb-4 flex items-start justify-between">
                          <div
                            className="h-8 w-24 rounded"
                            style={{ backgroundColor: template.primary_color || "#000" }}
                          />
                          <div className="text-right text-xs text-muted-foreground">
                            <div>INV-001</div>
                            <div>Dec 10, 2025</div>
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-2 w-3/4 rounded bg-muted" />
                          <div className="h-2 w-1/2 rounded bg-muted" />
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Total</span>
                            <span className="font-semibold" style={{ color: template.accent_color || "#3b82f6" }}>
                              $1,000.00
                            </span>
                          </div>
                        </div>
                      </div>
                      {!canUse && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                          <Lock className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full border"
                              style={{ backgroundColor: template.primary_color || "#000" }}
                            />
                            <div
                              className="h-3 w-3 rounded-full border"
                              style={{ backgroundColor: template.accent_color || "#3b82f6" }}
                            />
                            {template.min_plan !== "BASIC" && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {template.min_plan}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {canUse ? (
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Check className="mr-1 h-3 w-3" />
                            Select
                          </Button>
                        ) : (
                          <Link href="/app/subscription">
                            <Button size="sm">Upgrade</Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Branding Options */}
        <Card>
          <CardHeader>
            <CardTitle>Branding Options</CardTitle>
            <CardDescription>
              Set a logo, brand colors, watermark, and signature — these appear automatically on every invoice you
              create.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BrandingForm />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
