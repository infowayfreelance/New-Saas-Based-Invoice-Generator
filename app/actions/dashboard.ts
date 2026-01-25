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

    console.log("[v0] AUDIT: getDashboardStats called")
    console.log("[v0] AUDIT: Auth user ID:", user.id)
    console.log("[v0] AUDIT: Currency:", currency)
    console.log("[v0] AUDIT: Date filter:", { startDate, endDate })

    // Fetch total invoices (filtered by date)
    const { count: totalInvoices, error: invoicesError } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("issue_date", startDate)
      .lte("issue_date", endDate)

    console.log("[v0] AUDIT: TOTAL INVOICES query")
    console.log("[v0] AUDIT: - Source: invoices table")
    console.log("[v0] AUDIT: - Filters: user_id =", user.id)
    console.log("[v0] AUDIT: - Date range:", startDate, "to", endDate)
    console.log("[v0] AUDIT: - Count returned:", totalInvoices || 0)

    if (invoicesError) {
      console.error("[v0] AUDIT: Total invoices error:", invoicesError)
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

    console.log("[v0] AUDIT: TOTAL PENDING query")
    console.log("[v0] AUDIT: - Source: dashboard_pending_converted view")
    console.log("[v0] AUDIT: - Filters: user_id =", user.id)
    console.log("[v0] AUDIT: - Rows returned:", pendingRows?.length || 0)
    if (pendingRows && pendingRows.length > 0) {
      console.log(
        "[v0] AUDIT: - First 2 rows:",
        pendingRows.slice(0, 2).map((r: any) => ({
          pending_converted_amount: r.pending_converted_amount,
        })),
      )
    }

    if (pendingError) {
      console.error("[v0] AUDIT: Pending amounts error:", pendingError)
    }

    // Sum all pending_converted_amount values from the array of rows
    // If no rows exist (empty array), totalPending will be 0
    const totalPending = (pendingRows || []).reduce((sum, row) => {
      return sum + Number(row.pending_converted_amount || 0)
    }, 0)

    console.log("[v0] AUDIT: - Total pending calculated:", totalPending)

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

    console.log("[v0] AUDIT: getInvoiceWorkflowData called")
    console.log("[v0] AUDIT: Auth user ID:", user.id)

    // OPERATIONAL WORKFLOW - NO DATE FILTERING
    // Only select columns that exist in dashboard_invoices_base view:
    // invoice_id, user_id, client_id, issue_date, status, currency, invoice_total, total_paid, remaining_amount

    // Fetch draft invoices from dashboard_invoices_base view
    const { data: draftData, error: draftError } = await supabase
      .from("dashboard_invoices_base")
      .select("invoice_id, issue_date, status, currency, invoice_total, total_paid, remaining_amount")
      .eq("user_id", user.id)
      .eq("status", "draft")
      .order("issue_date", { ascending: false })

    console.log("[v0] DEBUG: DRAFT query result")
    console.log("[v0] DEBUG: - Count:", draftData?.length || 0)
    console.log(
      "[v0] DEBUG: - First 2 invoice_ids:",
      draftData?.slice(0, 2).map((r) => r.invoice_id) || [],
    )
    if (draftError) {
      console.error("[v0] DEBUG: Draft error:", draftError)
    }

    // Fetch pending invoices from dashboard_invoices_base view
    const { data: pendingData, error: pendingError } = await supabase
      .from("dashboard_invoices_base")
      .select("invoice_id, issue_date, status, currency, invoice_total, total_paid, remaining_amount")
      .eq("user_id", user.id)
      .in("status", ["sent", "partially_paid", "overdue"])
      .order("issue_date", { ascending: false })

    console.log("[v0] DEBUG: PENDING query result")
    console.log("[v0] DEBUG: - Count:", pendingData?.length || 0)
    console.log(
      "[v0] DEBUG: - First 2 invoice_ids:",
      pendingData?.slice(0, 2).map((r) => r.invoice_id) || [],
    )
    if (pendingError) {
      console.error("[v0] DEBUG: Pending error:", pendingError)
    }

    // Fetch paid invoices from dashboard_invoices_base view
    const { data: paidData, error: paidError } = await supabase
      .from("dashboard_invoices_base")
      .select("invoice_id, issue_date, status, currency, invoice_total, total_paid, remaining_amount")
      .eq("user_id", user.id)
      .in("status", ["paid", "partially_paid"])
      .order("issue_date", { ascending: false })
      .limit(10) // Limit to recent 10 paid invoices

    console.log("[v0] DEBUG: PAID query result")
    console.log("[v0] DEBUG: - Count:", paidData?.length || 0)
    console.log(
      "[v0] DEBUG: - First 2 invoice_ids:",
      paidData?.slice(0, 2).map((r) => r.invoice_id) || [],
    )
    if (paidError) {
      console.error("[v0] DEBUG: Paid error:", paidError)
    }

    // Transform data to workflow format - use empty arrays if data is null
    // View only has: invoice_id, invoice_total, total_paid, remaining_amount
    // We use invoice_id as both id and display text (no invoice_number available)
    const draft: WorkflowInvoice[] =
      draftData?.map((inv: any) => ({
        id: inv.invoice_id,
        invoice_number: `#${inv.invoice_id.slice(0, 8)}`, // Use first 8 chars of invoice_id
        client_name: "Client", // View doesn't have client_name
        total_amount: Number(inv.invoice_total || 0),
        remaining_amount: Number(inv.remaining_amount || inv.invoice_total || 0),
        total_paid: Number(inv.total_paid || 0),
        status: inv.status,
        issue_date: inv.issue_date,
      })) || []

    const pending: WorkflowInvoice[] =
      pendingData?.map((inv: any) => ({
        id: inv.invoice_id,
        invoice_number: `#${inv.invoice_id.slice(0, 8)}`,
        client_name: "Client",
        total_amount: Number(inv.invoice_total || 0),
        remaining_amount: Number(inv.remaining_amount || 0),
        total_paid: Number(inv.total_paid || 0),
        status: inv.status,
        issue_date: inv.issue_date,
      })) || []

    const paid: WorkflowInvoice[] =
      paidData?.map((inv: any) => ({
        id: inv.invoice_id,
        invoice_number: `#${inv.invoice_id.slice(0, 8)}`,
        client_name: "Client",
        total_amount: Number(inv.invoice_total || 0),
        remaining_amount: Number(inv.remaining_amount || 0),
        total_paid: Number(inv.total_paid || 0),
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
