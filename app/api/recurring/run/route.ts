import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

function nextMonthISO(day: number, from = new Date()) {
  const y = from.getUTCFullYear(),
    m = from.getUTCMonth()
  const d = new Date(Date.UTC(y, m + 1, Math.min(28, Math.max(1, day))))
  return d.toISOString().slice(0, 10)
}

// OPTIONAL: simple auth using a secret header from Vercel Cron
const CRON_SECRET = process.env.CRON_SECRET

export async function POST(req: Request) {
  if (CRON_SECRET) {
    const hdr = req.headers.get("x-cron-secret")
    if (hdr !== CRON_SECRET) return new NextResponse("Unauthorized", { status: 401 })
  }

  let svc
  try {
    svc = createServiceClient()
  } catch (error) {
    console.error("Failed to create service client:", error)
    return NextResponse.json(
      { error: "Service configuration error. Please check environment variables." },
      { status: 500 },
    )
  }

  const today = new Date().toISOString().slice(0, 10)

  // Fetch due rules
  const { data: rules, error } = await svc
    .from("recurring_invoice_rules")
    .select("*")
    .eq("is_active", true)
    .lte("next_run_date", today)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!rules || rules.length === 0) return NextResponse.json({ processed: 0 })

  let created = 0
  for (const r of rules) {
    // Load client and optional base invoice
    const [{ data: client }, { data: baseInvoice }] = await Promise.all([
      svc.from("clients").select("*").eq("id", r.client_id).single(),
      r.base_invoice_id
        ? svc.from("invoices").select("*, items:invoice_items(*)").eq("id", r.base_invoice_id).single()
        : Promise.resolve({ data: null }),
    ])

    if (!client) continue

    // Generate invoice number
    const { data: lastInv } = await svc
      .from("invoices")
      .select("invoice_number")
      .eq("user_id", r.user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    let invoiceNumber = "INV-0001"
    if (lastInv?.invoice_number) {
      const match = lastInv.invoice_number.match(/\d+/)
      if (match) {
        const num = Number.parseInt(match[0], 10) + 1
        invoiceNumber = `INV-${String(num).padStart(4, "0")}`
      }
    }

    // Build invoice data
    const issueDate = new Date().toISOString().slice(0, 10)
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

    const invoiceData = {
      user_id: r.user_id,
      client_id: r.client_id,
      invoice_number: invoiceNumber,
      issue_date: issueDate,
      due_date: dueDate,
      currency: baseInvoice?.currency || "USD",
      tax_rate: baseInvoice?.tax_rate || 0,
      discount: baseInvoice?.discount || 0,
      notes: baseInvoice?.notes || "",
      terms: baseInvoice?.terms || "",
      status: r.auto_send ? "SENT" : "DRAFT",
      subtotal: baseInvoice?.subtotal || 0,
      tax_amount: baseInvoice?.tax_amount || 0,
      total: baseInvoice?.total || 0,
    }

    const { data: newInvoice, error: invError } = await svc.from("invoices").insert(invoiceData).select().single()

    if (invError || !newInvoice) continue

    // Clone items if base invoice exists
    if (baseInvoice?.items && Array.isArray(baseInvoice.items)) {
      const items = baseInvoice.items.map((item: any) => ({
        invoice_id: newInvoice.id,
        user_id: r.user_id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.amount,
        sort_order: item.sort_order,
      }))
      await svc.from("invoice_items").insert(items)
    }

    // Update rule next_run_date
    await svc
      .from("recurring_invoice_rules")
      .update({ next_run_date: nextMonthISO(r.day_of_month), updated_at: new Date().toISOString() })
      .eq("id", r.id)

    created++
  }

  return NextResponse.json({ processed: rules.length, created })
}
