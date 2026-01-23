'use client';

import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/app/page-header"
import { InvoiceForm } from "@/components/invoice/invoice-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { type InvoiceFormData, toNumber } from "@/lib/utils/invoice"
import { updateInvoiceAction } from "@/app/actions/invoice"
import { updateInvoice } from "@/app/actions/invoice" // Import the updateInvoice function

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export default async function InvoiceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!isValidUUID(id)) {
    redirect("/app/invoices")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let invoice: any
  let items: any[] | null = null
  let client: any = null
  let userSettings: any = null

  try {
    // Fetch invoice first to check if it exists
    const invoiceResult = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (!invoiceResult.data || invoiceResult.error) {
      return (
        <>
          <PageHeader
            title="Invoice Not Found"
            breadcrumbs={[
              { label: "Dashboard", href: "/app" },
              { label: "Invoices", href: "/app/invoices" },
              { label: "Error" },
            ]}
          />
          <div className="flex-1 space-y-6 p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invoice Not Found</AlertTitle>
              <AlertDescription>
                The invoice you're trying to edit doesn't exist or you don't have permission to edit it.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Link href="/app/invoices">
                <Button>Back to Invoices</Button>
              </Link>
            </div>
          </div>
        </>
      )
    }

    invoice = invoiceResult.data

    // Fetch related data in parallel
    const [itemsResult, clientResult, settingsResult] = await Promise.all([
      supabase.from("invoice_items").select("*").eq("invoice_id", id).order("created_at", { ascending: true }),
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
        : Promise.resolve({ data: null, error: null }),
      supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
    ])

    items = itemsResult.data
    client = clientResult.data
    userSettings = settingsResult.data
  } catch (error) {
    console.error("[v0] Error loading invoice:", error)
    return (
      <>
        <PageHeader
          title="Error Loading Invoice"
          breadcrumbs={[
            { label: "Dashboard", href: "/app" },
            { label: "Invoices", href: "/app/invoices" },
            { label: "Error" },
          ]}
        />
        <div className="flex-1 space-y-6 p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Invoice</AlertTitle>
            <AlertDescription>
              There was an error loading this invoice. Please try again or contact support if the problem persists.
            </AlertDescription>
          </Alert>
          <div className="flex gap-4">
            <Link href="/app/invoices">
              <Button>Back to Invoices</Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

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

  const formData: InvoiceFormData = {
    fromName: userSettings?.business_name || userSettings?.full_name || user.email || "Your Business Name",
    fromEmail: userSettings?.email || user.email || "",
    fromAddress: senderAddressBlock,
    clientName: client?.name || client?.company_name || "",
    clientEmail: client?.email || "",
    clientAddress: clientAddress,
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
    discountAmount: toNumber(invoice.discount_total),
  }

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
        <InvoiceForm 
          initialData={formData} 
          onSubmit={updateInvoiceAction.bind(null, id)} 
          submitLabel="Update Invoice" 
        />
      </div>
    </>
  )
}
