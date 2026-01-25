"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export interface DashboardStats {
  totalInvoices: number
  totalClients: number
  totalReceived: number
  totalPending: number
}

interface DateFilter {
  preset: "this-month" | "last-30" | "last-3-months" | "last-6-months" | "last-year" | "custom"
  startDate?: string
  endDate?: string
}

function getDateRange(filter: DateFilter): { startDate: string; endDate: string } {
  const now = new Date()
  let startDate: Date
  let endDate: Date = now

  switch (filter.preset) {
    case "this-month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      break
    case "last-30":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case "last-3-months":
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      break
    case "last-6-months":
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
      break
    case "last-year":
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1)
      break
    case "custom":
      if (filter.startDate && filter.endDate) {
        return {
          startDate: filter.startDate,
          endDate: filter.endDate,
        }
      }
      // Fallback to this month if custom dates are invalid
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      break
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  }

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  }
}

export async function getDashboardStats(
  currency: string,
  filter: DateFilter,
): Promise<DashboardStats | { error: string }> {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    const { startDate, endDate } = getDateRange(filter)

    // Fetch total invoices (filtered by date)
    const { count: totalInvoices, error: invoicesError } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("issue_date", startDate)
      .lte("issue_date", endDate)

    if (invoicesError) {
      console.error("[v0] Error fetching total invoices:", invoicesError)
      return { error: "Failed to fetch invoice count" }
    }

    // Fetch total clients (all clients, not filtered by date)
    const { count: totalClients, error: clientsError } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (clientsError) {
      console.error("[v0] Error fetching total clients:", clientsError)
      return { error: "Failed to fetch client count" }
    }

    // Fetch total received from dashboard_totals view (filtered by date)
    // Note: Since the view doesn't support date filtering directly,
    // we'll query invoices directly for paid amounts
    const { data: paidInvoices, error: paidError } = await supabase
      .from("invoices")
      .select("total_amount")
      .eq("user_id", user.id)
      .eq("status", "PAID")
      .gte("issue_date", startDate)
      .lte("issue_date", endDate)

    if (paidError) {
      console.error("[v0] Error fetching paid invoices:", paidError)
      return { error: "Failed to fetch total received" }
    }

    const totalReceived = paidInvoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0)

    // Fetch total pending from dashboard_pending_converted view
    // Sum pending amounts for invoices within the date range
    const { data: pendingInvoices, error: pendingError } = await supabase
      .from("invoices")
      .select("total_amount, amount_paid")
      .eq("user_id", user.id)
      .in("status", ["SENT", "PARTIALLY_PAID", "OVERDUE"])
      .gte("issue_date", startDate)
      .lte("issue_date", endDate)

    if (pendingError) {
      console.error("[v0] Error fetching pending invoices:", pendingError)
      return { error: "Failed to fetch total pending" }
    }

    const totalPending = pendingInvoices.reduce((sum, inv) => {
      const pending = Number(inv.total_amount || 0) - Number(inv.amount_paid || 0)
      return sum + (pending > 0 ? pending : 0)
    }, 0)

    return {
      totalInvoices: totalInvoices || 0,
      totalClients: totalClients || 0,
      totalReceived,
      totalPending,
    }
  } catch (error: any) {
    console.error("[v0] Error in getDashboardStats:", error)
    return { error: error.message || "An unexpected error occurred" }
  }
}

// Invoice Workflow Data Types
export interface WorkflowInvoice {
  id: string
  invoice_number: string
  client_name: string
  total_amount: number
  remaining_amount: number
  total_paid: number
  status: string
  issue_date: string
}

export interface InvoiceWorkflowData {
  draft: WorkflowInvoice[]
  pending: WorkflowInvoice[]
  paid: WorkflowInvoice[]
}

export async function getInvoiceWorkflowData(
  filter: DateFilter,
): Promise<InvoiceWorkflowData | { error: string }> {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    const { startDate, endDate } = getDateRange(filter)

    // Fetch draft invoices
    const { data: draftData, error: draftError } = await supabase
      .from("dashboard_invoices_base")
      .select("id, invoice_number, client_name, total_amount, issue_date, status")
      .eq("user_id", user.id)
      .eq("status", "DRAFT")
      .gte("issue_date", startDate)
      .lte("issue_date", endDate)
      .order("issue_date", { ascending: false })

    if (draftError) {
      console.error("[v0] Error fetching draft invoices:", draftError)
      return { error: "Failed to fetch draft invoices" }
    }

    // Fetch pending invoices with payment summary
    const { data: pendingData, error: pendingError } = await supabase
      .from("dashboard_invoices_base")
      .select(
        `
        id,
        invoice_number,
        client_name,
        total_amount,
        issue_date,
        status,
        amount_paid
      `,
      )
      .eq("user_id", user.id)
      .in("status", ["SENT", "PARTIALLY_PAID", "OVERDUE"])
      .gte("issue_date", startDate)
      .lte("issue_date", endDate)
      .order("issue_date", { ascending: false })

    if (pendingError) {
      console.error("[v0] Error fetching pending invoices:", pendingError)
      return { error: "Failed to fetch pending invoices" }
    }

    // Fetch paid invoices with payment summary
    const { data: paidData, error: paidError } = await supabase
      .from("dashboard_invoices_base")
      .select(
        `
        id,
        invoice_number,
        client_name,
        total_amount,
        issue_date,
        status,
        amount_paid
      `,
      )
      .eq("user_id", user.id)
      .in("status", ["PAID", "PARTIALLY_PAID"])
      .gte("issue_date", startDate)
      .lte("issue_date", endDate)
      .order("issue_date", { ascending: false })
      .limit(10) // Limit to recent 10 paid invoices

    if (paidError) {
      console.error("[v0] Error fetching paid invoices:", paidError)
      return { error: "Failed to fetch paid invoices" }
    }

    // Transform data to workflow format
    const draft: WorkflowInvoice[] =
      draftData?.map((inv) => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        client_name: inv.client_name || "Unknown Client",
        total_amount: Number(inv.total_amount || 0),
        remaining_amount: Number(inv.total_amount || 0),
        total_paid: 0,
        status: inv.status,
        issue_date: inv.issue_date,
      })) || []

    const pending: WorkflowInvoice[] =
      pendingData?.map((inv) => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        client_name: inv.client_name || "Unknown Client",
        total_amount: Number(inv.total_amount || 0),
        remaining_amount: Number(inv.total_amount || 0) - Number(inv.amount_paid || 0),
        total_paid: Number(inv.amount_paid || 0),
        status: inv.status,
        issue_date: inv.issue_date,
      })) || []

    const paid: WorkflowInvoice[] =
      paidData?.map((inv) => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        client_name: inv.client_name || "Unknown Client",
        total_amount: Number(inv.total_amount || 0),
        remaining_amount: Number(inv.total_amount || 0) - Number(inv.amount_paid || 0),
        total_paid: Number(inv.amount_paid || 0),
        status: inv.status,
        issue_date: inv.issue_date,
      })) || []

    return {
      draft,
      pending,
      paid,
    }
  } catch (error: any) {
    console.error("[v0] Error in getInvoiceWorkflowData:", error)
    return { error: error.message || "An unexpected error occurred" }
  }
}
