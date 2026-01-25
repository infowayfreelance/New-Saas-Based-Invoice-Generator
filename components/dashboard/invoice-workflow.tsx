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
import type { DateFilter } from "./dashboard-client"

interface InvoiceWorkflowProps {
  currency: string
  filter: DateFilter
}

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  amount: number
  remainingAmount?: number
  status: "draft" | "pending" | "paid" | "partial"
}

interface WorkflowData {
  draft: Invoice[]
  pending: Invoice[]
  paid: Invoice[]
}

export function InvoiceWorkflow({ currency, filter }: InvoiceWorkflowProps) {
  const [data, setData] = useState<WorkflowData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"draft" | "pending" | null>(null)

  useEffect(() => {
    // Simulate loading - in production, fetch real data here
    setIsLoading(true)
    const timer = setTimeout(() => {
      // Placeholder data - replace with actual API call
      setData({
        draft: [],
        pending: [],
        paid: [],
      })
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [filter, currency])

  const handleInvoiceClick = (invoice: Invoice, type: "draft" | "pending") => {
    setSelectedInvoice(invoice)
    setActionType(type)
    setActionDialogOpen(true)
  }

  const handleSendInvoice = () => {
    // Implement send invoice logic
    console.log("[v0] Send invoice:", selectedInvoice?.id)
    setActionDialogOpen(false)
  }

  const handleDownloadPDF = () => {
    // Implement download PDF logic
    console.log("[v0] Download PDF:", selectedInvoice?.id)
    setActionDialogOpen(false)
  }

  const handleRecordPayment = (type: "partial" | "full") => {
    // Implement record payment logic
    console.log("[v0] Record payment:", type, selectedInvoice?.id)
    setActionDialogOpen(false)
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

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {/* Draft Invoices Column */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Draft Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.draft && data.draft.length > 0 ? (
              <div className="space-y-3">
                {data.draft.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{invoice.clientName}</p>
                        <p className="text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {formatCurrency(invoice.amount, currency)}
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
            {data?.pending && data.pending.length > 0 ? (
              <div className="space-y-3">
                {data.pending.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{invoice.clientName}</p>
                        <p className="text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {formatCurrency(invoice.remainingAmount || invoice.amount, currency)}
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
            {data?.paid && data.paid.length > 0 ? (
              <div className="space-y-3">
                {data.paid.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{invoice.clientName}</p>
                        <p className="text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {formatCurrency(invoice.amount, currency)}
                      </span>
                      <Badge
                        variant={invoice.status === "partial" ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {invoice.status === "partial" ? "Partial" : "Paid"}
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
              {selectedInvoice?.invoiceNumber} - {selectedInvoice?.clientName}
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
    </>
  )
}
