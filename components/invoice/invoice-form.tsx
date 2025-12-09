"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"
import {
  type InvoiceFormData,
  type InvoiceItemFormData,
  calculateInvoiceTotals,
  formatCurrency,
  CURRENCIES,
} from "@/lib/utils/invoice"

interface InvoiceFormProps {
  initialData: InvoiceFormData
  onSubmit: (data: InvoiceFormData) => void
  isLoading?: boolean
  submitLabel?: string
}

export function InvoiceForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Generate Invoice",
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(initialData)

  const updateField = <K extends keyof InvoiceFormData>(field: K, value: InvoiceFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addItem = () => {
    const newItem: InvoiceItemFormData = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: formData.taxRate,
    }
    updateField("items", [...formData.items, newItem])
  }

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      updateField(
        "items",
        formData.items.filter((item) => item.id !== id),
      )
    }
  }

  const updateItem = (id: string, field: keyof InvoiceItemFormData, value: string | number) => {
    updateField(
      "items",
      formData.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    )
  }

  const totals = calculateInvoiceTotals(formData.items, formData.discountAmount)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* From Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">From (Your Business)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromName">Business Name</Label>
              <Input
                id="fromName"
                placeholder="Your Company Name"
                value={formData.fromName}
                onChange={(e) => updateField("fromName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">Email</Label>
              <Input
                id="fromEmail"
                type="email"
                placeholder="you@company.com"
                value={formData.fromEmail}
                onChange={(e) => updateField("fromEmail", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromAddress">Address</Label>
              <Textarea
                id="fromAddress"
                placeholder="123 Business St, City, State 12345"
                value={formData.fromAddress}
                onChange={(e) => updateField("fromAddress", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* To Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">To (Client)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                placeholder="Client or Company Name"
                value={formData.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="client@company.com"
                value={formData.clientEmail}
                onChange={(e) => updateField("clientEmail", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Address</Label>
              <Textarea
                id="clientAddress"
                placeholder="456 Client Ave, City, State 67890"
                value={formData.clientAddress}
                onChange={(e) => updateField("clientAddress", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => updateField("invoiceNumber", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => updateField("issueDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => updateField("currency", value)}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Header - Desktop */}
          <div className="hidden grid-cols-12 gap-4 text-sm font-medium text-muted-foreground md:grid">
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Unit Price</div>
            <div className="col-span-2">Tax %</div>
            <div className="col-span-1"></div>
          </div>
          {formData.items.map((item, index) => (
            <div key={item.id} className="space-y-4 md:space-y-0">
              <div className="grid gap-4 md:grid-cols-12 md:items-end">
                <div className="space-y-2 md:col-span-5 md:space-y-0">
                  <Label className="md:hidden">Description</Label>
                  <Input
                    placeholder="Service or product description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 md:col-span-6 md:grid-cols-3">
                  <div className="space-y-2 md:space-y-0">
                    <Label className="md:hidden">Qty</Label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:space-y-0">
                    <Label className="md:hidden">Price</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:space-y-0">
                    <Label className="md:hidden">Tax %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={item.taxRate}
                      onChange={(e) => updateItem(item.id, "taxRate", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="flex justify-end md:col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={formData.items.length === 1}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              </div>
              {index < formData.items.length - 1 && <Separator className="mt-4 md:hidden" />}
            </div>
          ))}

          {/* Totals */}
          <Separator className="my-4" />
          <div className="flex flex-col items-end gap-2">
            <div className="flex w-full max-w-xs justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(totals.subtotal, formData.currency)}</span>
            </div>
            <div className="flex w-full max-w-xs justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(totals.taxAmount, formData.currency)}</span>
            </div>
            <div className="flex w-full max-w-xs items-center gap-2 text-sm">
              <span className="text-muted-foreground">Discount</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                className="w-24 text-right"
                value={formData.discountAmount}
                onChange={(e) => updateField("discountAmount", Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <Separator className="my-2 w-full max-w-xs" />
            <div className="flex w-full max-w-xs justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totals.totalAmount, formData.currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes & Terms */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Additional notes for the client..."
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Payment terms and conditions..."
              value={formData.terms}
              onChange={(e) => updateField("terms", e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? "Generating..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
