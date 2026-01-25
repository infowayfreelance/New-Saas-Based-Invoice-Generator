"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Mail, Download, DollarSign, Clock } from "lucide-react"
import { formatCurrency } from "@/lib/utils/invoice"
import {
  getInvoiceWorkflowData,
  type WorkflowInvoice,
  type InvoiceWorkflowData,
} from "@/app/actions/dashboard"
import { PaymentRecordModal } from "./payment-record-modal"
import type { DateFilter } from "./dashboard-client"

interface InvoiceWorkflowProps {
  currency: string
  filter: DateFilter
}

export function InvoiceWorkflow({ currency, filter }: InvoiceWorkflowProps) {
  const [data, setData] = useState<InvoiceWorkflowData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<WorkflowInvoice | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"draft" | "pending" | null>(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentType, setPaymentType] = useState<"partial" | "full">("partial")

  const fetchWorkflowData = async () => {
    setIsLoading(true)

    try {
      const result = await getInvoiceWorkflowData(filter)
      setData(result)
    } catch (err: any) {
      console.error("[v0] Error fetching workflow data:", err)
      // Set empty arrays on error instead of showing error UI
      setData({
        draft: [],
        pending: [],
        paid: [],
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkflowData()
  }, [filter])

  const handleInvoiceClick = (invoice: WorkflowInvoice, type: "draft" | "pending") => {
    setSelectedInvoice(invoice)
    setActionType(type)
    setActionDialogOpen(true)
  }

  const handleSendInvoice = () => {
    // TODO: Implement send invoice logic
    console.log("[v0] Send invoice:", selectedInvoice?.id)
    setActionDialogOpen(false)
  }

  const handleDownloadPDF = () => {
    // TODO: Implement download PDF logic
    console.log("[v0] Download PDF:", selectedInvoice?.id)
    setActionDialogOpen(false)
  }

  const handleRecordPayment = (type: "partial" | "full") => {
    setPaymentType(type)
    setActionDialogOpen(false)
    setPaymentModalOpen(true)
  }

  const handlePaymentSuccess = () => {
    // Refresh the workflow data after successful payment
    fetchWorkflowData()
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2 rounded-lg border p-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Always show workflow (with empty arrays if necessary)
  if (!data) {
    return null
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {/* Draft Invoices Column */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Draft Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {data.draft && data.draft.length > 0 ? (
              <div className="space-y-3">
                {data.draft.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{invoice.client_name}</p>
                        <p className="text-sm text-muted-foreground">{invoice.invoice_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {formatCurrency(invoice.total_amount, currency)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleInvoiceClick(invoice, "draft")}
                    >
                      Actions
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No draft invoices</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Payments Column */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {data.pending && data.pending.length > 0 ? (
              <div className="space-y-3">
                {data.pending.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{invoice.client_name}</p>
                        <p className="text-sm text-muted-foreground">{invoice.invoice_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {formatCurrency(invoice.remaining_amount, currency)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleInvoiceClick(invoice, "pending")}
                    >
                      Actions
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No pending payments</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paid Invoices Column */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Paid Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {data.paid && data.paid.length > 0 ? (
              <div className="space-y-3">
                {data.paid.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{invoice.client_name}</p>
                        <p className="text-sm text-muted-foreground">{invoice.invoice_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {formatCurrency(invoice.total_paid, currency)}
                      </span>
                      <Badge
                        variant={
                          invoice.status === "PARTIALLY_PAID" || invoice.remaining_amount > 0
                            ? "secondary"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {invoice.status === "PARTIALLY_PAID" || invoice.remaining_amount > 0
                          ? "Partial"
                          : "Paid"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <DollarSign className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No paid invoices</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice Actions</DialogTitle>
            <DialogDescription>
              {selectedInvoice?.invoice_number} - {selectedInvoice?.client_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            {actionType === "draft" && (
              <>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleSendInvoice}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invoice (Email)
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleDownloadPDF}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </>
            )}
            {actionType === "pending" && (
              <>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleRecordPayment("partial")}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Record Partial Payment
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleRecordPayment("full")}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Record Full Payment
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Record Modal */}
      {selectedInvoice && (
        <PaymentRecordModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          invoiceId={selectedInvoice.id}
          invoiceNumber={selectedInvoice.invoice_number}
          clientName={selectedInvoice.client_name}
          currency={currency}
          remainingAmount={selectedInvoice.remaining_amount}
          dashboardCurrency={currency}
          paymentType={paymentType}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  )
}
