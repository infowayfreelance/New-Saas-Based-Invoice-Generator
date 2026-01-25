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
): Promise<DashboardStats> {
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
    }

    // Fetch total clients (all clients, not filtered by date)
    const { count: totalClients, error: clientsError } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (clientsError) {
      console.error("[v0] Error fetching total clients:", clientsError)
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
    }

    const totalReceived = (paidInvoices || []).reduce(
      (sum, inv) => sum + Number(inv.total_amount || 0),
      0,
    )

    // Fetch total pending from dashboard_pending_converted view
    // This view returns multiple rows (one per pending invoice)
    // We need to sum the pending_converted_amount column
    const { data: pendingRows, error: pendingError } = await supabase
      .from("dashboard_pending_converted")
      .select("pending_converted_amount")
      .eq("user_id", user.id)

    if (pendingError) {
      console.error("[v0] Error fetching pending amounts:", pendingError)
    }

    // Sum all pending_converted_amount values from the array of rows
    // If no rows exist (empty array), totalPending will be 0
    const totalPending = (pendingRows || []).reduce((sum, row) => {
      return sum + Number(row.pending_converted_amount || 0)
    }, 0)

    return {
      totalInvoices: totalInvoices || 0,
      totalClients: totalClients || 0,
      totalReceived,
      totalPending,
    }
  } catch (error: any) {
    console.error("[v0] Error in getDashboardStats:", error)
    // Return zero values instead of error object
    return {
      totalInvoices: 0,
      totalClients: 0,
      totalReceived: 0,
      totalPending: 0,
    }
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
): Promise<InvoiceWorkflowData> {
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

    // Fetch draft invoices from dashboard_invoices_base view
    const { data: draftData, error: draftError } = await supabase
      .from("dashboard_invoices_base")
      .select("invoice_id, invoice_number, client_name, total_amount, issue_date, status")
      .eq("user_id", user.id)
      .eq("status", "draft")
      .gte("issue_date", startDate)
      .lte("issue_date", endDate)
      .order("issue_date", { ascending: false })

    if (draftError) {
      console.error("[v0] Error fetching draft invoices:", draftError)
    }

    // Fetch pending invoices from dashboard_invoices_base view
    const { data: pendingData, error: pendingError } = await supabase
      .from("dashboard_invoices_base")
      .select(
        "invoice_id, invoice_number, client_name, total_amount, amount_paid, issue_date, status",
      )
      .eq("user_id", user.id)
      .in("status", ["sent", "partially_paid", "overdue"])
      .gte("issue_date", startDate)
      .lte("issue_date", endDate)
      .order("issue_date", { ascending: false })

    if (pendingError) {
      console.error("[v0] Error fetching pending invoices:", pendingError)
    }

    // Fetch paid invoices from dashboard_invoices_base view
    const { data: paidData, error: paidError } = await supabase
      .from("dashboard_invoices_base")
      .select(
        "invoice_id, invoice_number, client_name, total_amount, amount_paid, issue_date, status",
      )
      .eq("user_id", user.id)
      .in("status", ["paid", "partially_paid"])
      .gte("issue_date", startDate)
      .lte("issue_date", endDate)
      .order("issue_date", { ascending: false })
      .limit(10) // Limit to recent 10 paid invoices

    if (paidError) {
      console.error("[v0] Error fetching paid invoices:", paidError)
    }

    // Transform data to workflow format - use empty arrays if data is null
    // Use invoice_id from the view (not id)
    const draft: WorkflowInvoice[] =
      draftData?.map((inv: any) => ({
        id: inv.invoice_id,
        invoice_number: inv.invoice_number,
        client_name: inv.client_name || "Unknown Client",
        total_amount: Number(inv.total_amount || 0),
        remaining_amount: Number(inv.total_amount || 0),
        total_paid: 0,
        status: inv.status,
        issue_date: inv.issue_date,
      })) || []

    const pending: WorkflowInvoice[] =
      pendingData?.map((inv: any) => ({
        id: inv.invoice_id,
        invoice_number: inv.invoice_number,
        client_name: inv.client_name || "Unknown Client",
        total_amount: Number(inv.total_amount || 0),
        remaining_amount: Number(inv.total_amount || 0) - Number(inv.amount_paid || 0),
        total_paid: Number(inv.amount_paid || 0),
        status: inv.status,
        issue_date: inv.issue_date,
      })) || []

    const paid: WorkflowInvoice[] =
      paidData?.map((inv: any) => ({
        id: inv.invoice_id,
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
    // Return empty arrays instead of error object
    return {
      draft: [],
      pending: [],
      paid: [],
    }
  }
}
