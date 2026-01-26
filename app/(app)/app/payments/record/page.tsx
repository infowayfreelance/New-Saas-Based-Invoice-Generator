"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils/invoice"

export default function RecordPaymentPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [invoices, setInvoices] = useState<any[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [formData, setFormData] = useState({
    invoice_id: "",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    method: "bank_transfer",
    reference: "",
    notes: "",
  })

  useEffect(() => {
    async function fetchInvoices() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["sent", "pending", "overdue"])
        .order("created_at", { ascending: false })

      setInvoices(data || [])
    }
    fetchInvoices()
  }, [])

  const handleInvoiceSelect = (invoiceId: string) => {
    const invoice = invoices.find((i) => i.id === invoiceId)
    setSelectedInvoice(invoice)
    setFormData((prev) => ({
      ...prev,
      invoice_id: invoiceId,
      amount: invoice?.total?.toString() || "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Get user settings for currency
      const { data: settings } = await supabase
        .from("user_settings")
        .select("currency")
        .eq("user_id", user.id)
        .single()

      // Use the recordPayment server action which handles FX rates and status updates
      const { recordPayment } = await import("@/app/actions/payments")
      
      const result = await recordPayment({
        invoiceId: formData.invoice_id,
        amount: Number.parseFloat(formData.amount),
        paymentDate: formData.payment_date,
        paymentMethod: formData.method,
        reference: formData.reference || undefined,
        dashboardCurrency: settings?.currency || "USD",
      })

      if ("error" in result) {
        throw new Error(result.error)
      }

      // Force hard navigation to ensure dashboard stats refresh
      router.push("/app/payments")
      router.refresh()
    } catch (error) {
      console.error("Error recording payment:", error)
      alert("Failed to record payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Record Payment"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Payments", href: "/app/payments" },
          { label: "Record" },
        ]}
      />
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/app/payments"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payments
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Record a Payment</CardTitle>
              <CardDescription>Log a payment received for an invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="invoice">Invoice</Label>
                  <Select value={formData.invoice_id} onValueChange={handleInvoiceSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an invoice" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoices.map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.invoice_number} - {invoice.client_name} ({formatCurrency(invoice.total)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Payment Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.payment_date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, payment_date: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="method">Payment Method</Label>
                    <Select
                      value={formData.method}
                      onValueChange={(v) => setFormData((prev) => ({ ...prev, method: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference/Transaction ID</Label>
                    <Input
                      id="reference"
                      value={formData.reference}
                      onChange={(e) => setFormData((prev) => ({ ...prev, reference: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional notes..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading || !formData.invoice_id}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Record Payment
                  </Button>
                  <Link href="/app/payments">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
