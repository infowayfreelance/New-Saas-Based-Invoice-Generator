"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { recordPayment, type RecordPaymentInput } from "@/app/actions/payments"
import { formatCurrency } from "@/lib/utils/invoice"
import { toast } from "sonner"

interface PaymentRecordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoiceId: string
  invoiceNumber: string
  clientName: string
  currency: string
  remainingAmount: number
  dashboardCurrency: string
  paymentType: "partial" | "full"
  onSuccess?: () => void
}

export function PaymentRecordModal({
  open,
  onOpenChange,
  invoiceId,
  invoiceNumber,
  clientName,
  currency,
  remainingAmount,
  dashboardCurrency,
  paymentType,
  onSuccess,
}: PaymentRecordModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    reference: "",
  })

  // Reset form and set amount when modal opens or paymentType changes
  useEffect(() => {
    if (open) {
      console.log("[v0] Payment modal opened - invoiceId:", invoiceId, "paymentType:", paymentType, "remainingAmount:", remainingAmount)
      setFormData({
        amount: paymentType === "full" ? remainingAmount.toString() : "",
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "",
        reference: "",
      })
      setError(null)
      setShowConfirmation(false)
    }
  }, [open, paymentType, remainingAmount, invoiceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation - Convert to number and validate
    const amount = parseFloat(formData.amount)
    
    console.log("[v0] Payment submit - amount input:", formData.amount, "parsed:", amount, "remaining:", remainingAmount)
    
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than 0")
      return
    }

    if (amount > remainingAmount) {
      setError(`Amount cannot exceed remaining balance of ${formatCurrency(remainingAmount, currency)}`)
      return
    }

    if (paymentType === "partial" && amount >= remainingAmount) {
      setError("Partial payment must be less than the remaining amount. Use 'Record Full Payment' instead.")
      return
    }

    // Show confirmation for full payment
    if (paymentType === "full" && !showConfirmation) {
      setShowConfirmation(true)
      return
    }

    setLoading(true)

    try {
      const input: RecordPaymentInput = {
        invoiceId,
        amount,
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod || undefined,
        reference: formData.reference || undefined,
        dashboardCurrency,
      }

      console.log("[v0] Submitting payment:", input)

      const result = await recordPayment(input)

      console.log("[v0] Payment result:", result)

      if ("error" in result) {
        setError(result.error)
      } else {
        // Show success message with status and remaining amount
        const statusText = result.newStatus === 'paid' ? 'fully paid' : 'partially paid'
        const remainingText = result.remaining > 0 
          ? ` Remaining: ${formatCurrency(result.remaining, currency)}`
          : ''
        toast.success(`Payment recorded! Invoice is now ${statusText}.${remainingText}`)
        
        onOpenChange(false)
        onSuccess?.()
        // Form will be reset by useEffect when modal reopens
      }
    } catch (err: any) {
      console.error("[v0] Error recording payment:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {paymentType === "full" ? "Record Full Payment" : "Record Partial Payment"}
          </DialogTitle>
          <DialogDescription>
            {invoiceNumber} - {clientName}
          </DialogDescription>
        </DialogHeader>

        {showConfirmation ? (
          <div className="space-y-4 py-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Are you sure you want to record a full payment of{" "}
                <strong>{formatCurrency(remainingAmount, currency)}</strong>? This will mark the
                invoice as paid.
              </AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Payment
              </Button>
              <Button onClick={handleCancel} variant="outline" disabled={loading} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={paymentType === "partial" ? remainingAmount : undefined}
                value={formData.amount}
                onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder={`Max: ${formatCurrency(remainingAmount, currency)}`}
                disabled={paymentType === "full" || loading}
                required
              />
              <p className="text-xs text-muted-foreground">
                Remaining: {formatCurrency(remainingAmount, currency)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">
                Payment Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, paymentDate: e.target.value }))}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method (optional)" />
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
              <Label htmlFor="reference">Reference / Transaction ID</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData((prev) => ({ ...prev, reference: e.target.value }))}
                placeholder="Optional"
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {paymentType === "full" ? "Record Full Payment" : "Record Payment"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
