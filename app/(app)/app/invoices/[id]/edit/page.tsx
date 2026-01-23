import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { type InvoiceFormData, toNumber } from "@/lib/utils/invoice"
import { updateInvoiceAction } from "@/app/actions/invoice"
import { EditInvoiceFormServer } from "@/components/invoice/edit-invoice-form-server"

export default async function InvoiceEditPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  // ❌ DO NOT validate ID format here
  // Let Supabase decide if the record exists

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  try {
    const invoiceResult = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (!invoiceResult.data) {
      throw new Error("Invoice not found or access denied")
    }

    const invoice = invoiceResult.data

    const [itemsResult, clientResult, settingsResult] = await Promise.all([
      supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", id)
        .order("created_at", { ascending: true }),
      invoice.client_id
        ? supabase
            .from("clients")
            .select(
              `
              id,
              name,
              company_name,
              email,
              phone,
              address_line1,
              address_line2,
              city,
              state,
              postal_code,
              country
            `
            )
            .eq("id", invoice.client_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(),
    ])

    const items = itemsResult.data
    const client = clientResult.data
    const userSettings = settingsResult.data

    const clientAddress = client
      ? [
          client.address_line1,
          client.address_line2,
          [client.city, client.state].filter(Boolean).join(", "),
          client.postal_code,
          client.country,
        ]
          .filter(Boolean)
          .join("\n")
      : ""

    const senderAddress = userSettings
      ? [
          userSettings.address_line1,
          userSettings.address_line2,
          [userSettings.city, userSettings.state].filter(Boolean).join(", "),
          userSettings.postal_code,
          userSettings.country,
        ]
          .filter(Boolean)
          .join("\n")
      : ""

    const senderAddressBlock = [
      senderAddress,
      userSettings?.phone ? `Phone: ${userSettings.phone}` : null,
      userSettings?.email ? `Email: ${userSettings.email}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    const formData: InvoiceFormData & { clientId?: string | null } = {
      fromName:
        userSettings?.business_name ||
        userSettings?.full_name ||
        user.email ||
        "",
      fromEmail: userSettings?.email || user.email || "",
      fromAddress: senderAddressBlock,
      clientName: client?.name || client?.company_name || "",
      clientEmail: client?.email || "",
      clientAddress,
      clientId: invoice.client_id,
      invoiceNumber: invoice.invoice_number,
      issueDate: invoice.issue_date,
      dueDate: invoice.due_date,
      currency: invoice.currency,
      items:
        items?.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: toNumber(item.quantity),
          unitPrice: toNumber(item.unit_price),
          taxRate: toNumber(item.tax_rate),
        })) || [],
      notes: invoice.notes || "",
      terms: invoice.terms || "",
      taxRate: 0,
      discountAmount: toNumber(invoice.discount_amount),
    }

    const stableUpdateAction = updateInvoiceAction.bind(null, id)

    return (
      <>
        <PageHeader
          title={`Edit Invoice ${invoice.invoice_number}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/app" },
            { label: "Invoices", href: "/app/invoices" },
            { label: invoice.invoice_number, href: `/app/invoices/${id}` },
            { label: "Edit" },
          ]}
        />
        <div className="flex-1 space-y-6 p-6">
          <EditInvoiceFormServer
            initialData={formData}
            updateAction={stableUpdateAction}
          />
        </div>
      </>
    )
  } catch (error) {
    console.error("[invoice-edit] load error", error)

    return (
      <>
        <PageHeader title="Error Loading Invoice" />
        <div className="flex-1 space-y-6 p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load invoice for editing.
            </AlertDescription>
          </Alert>
          <Link href="/app/invoices">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </>
    )
  }
}
