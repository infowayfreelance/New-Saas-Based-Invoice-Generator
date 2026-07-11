"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"
import {
  type InvoiceFormData,
  type InvoiceItemFormData,
  calculateInvoiceTotals,
  formatCurrency,
  CURRENCIES,
} from "@/lib/utils/invoice"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { updateInvoice } from "@/app/actions/invoice-update"
import { toast } from "sonner"
import { useCurrencyOrDefault } from "@/components/app/currency-provider"
import { ALL_CURRENCIES } from "@/lib/utils/currency"

interface EditInvoiceFormProps {
  invoiceId: string
  initialData: InvoiceFormData & { clientId?: string | null }
}

export function EditInvoiceForm({ invoiceId, initialData }: EditInvoiceFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<InvoiceFormData>(initialData)
  const [clients, setClients] = useState<any[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string | null>(initialData.clientId || null)
  const [isLoadingClients, setIsLoadingClients] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { enabledCurrencies } = useCurrencyOrDefault()
  
  // Filter currencies to only show enabled ones
  // If no currencies are enabled (public pages), show all currencies
  const availableCurrencies = enabledCurrencies && enabledCurrencies.length > 0
    ? ALL_CURRENCIES.filter(currency => enabledCurrencies.includes(currency.code))
    : ALL_CURRENCIES

  useEffect(() => {
    const loadClients = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setIsLoadingClients(false)
          return
        }

        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("user_id", user.id)
          .order("name", { ascending: true })

        if (!error && data) {
          setClients(data)

          if (initialData.clientId && initialData.clientId !== "none") {
            const client = data.find((c) => c.id === initialData.clientId)
            if (client) {
              setSelectedClientId(initialData.clientId)
            }
          }
        }
      } catch (err) {
        console.error("[v0] Error loading clients:", err)
      } finally {
        setIsLoadingClients(false)
      }
    }

    loadClients()
  }, [initialData.clientId])

  const updateField = <K extends keyof InvoiceFormData>(field: K, value: InvoiceFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClientSelect = (clientId: string) => {
    if (clientId === "none") {
      setSelectedClientId(null)
      updateField("clientName", "")
      updateField("clientEmail", "")
      updateField("clientAddress", "")
      return
    }

    setSelectedClientId(clientId)

    const client = clients.find((c) => c.id === clientId)
    if (client) {
      const clientAddress = [
        client.address_line1,
        client.address_line2,
        [client.city, client.state].filter(Boolean).join(", "),
        client.postal_code,
        client.country,
      ]
        .filter(Boolean)
        .join("\n")

      updateField("clientName", client.name || client.company_name || "")
      updateField("clientEmail", client.email || "")
      updateField("clientAddress", clientAddress)
    }
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
        formData.items.filter((item) => item.id !== id)
      )
    }
  }

  const updateItem = (id: string, field: keyof InvoiceItemFormData, value: string | number) => {
    updateField(
      "items",
      formData.items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const totals = calculateInvoiceTotals(formData.items, formData.discountAmount)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateInvoice(invoiceId, { ...formData, clientId: selectedClientId })

      if (result.success) {
        toast.success("Invoice updated successfully!")
        router.push(`/app/invoices/${invoiceId}`)
      } else {
        toast.error(result.error || "Failed to update invoice")
      }
    } catch (error) {
      console.error("[v0] Submit error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* From Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">From (Your Business)</CardTitle>
            <CardDescription className="text-xs">Update these details in Settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromName">Business Name</Label>
              <Input id="fromName" value={formData.fromName} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">Email</Label>
              <Input id="fromEmail" type="email" value={formData.fromEmail} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromAddress">Address</Label>
              <Textarea id="fromAddress" value={formData.fromAddress} disabled className="bg-muted" rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* To Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">To (Client)</CardTitle>
            <CardDescription className="text-xs">
              Select an existing client or{" "}
              <Link href="/app/clients/new" className="text-primary hover:underline">
                create a new one
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientSelect">Select Client</Label>
              <Select
                value={selectedClientId ?? "none"}
                onValueChange={handleClientSelect}
                disabled={isLoadingClients}
              >
                <SelectTrigger id="clientSelect">
                  <SelectValue placeholder={isLoadingClients ? "Loading clients..." : "Select a client"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No client selected</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name || client.company_name} {client.email && `(${client.email})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedClientId && selectedClientId !== "none" && (
              <>
                <div className="space-y-2">
                  <Label>Client Name</Label>
                  <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm">{formData.clientName || "—"}</div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm">{formData.clientEmail || "—"}</div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm whitespace-pre-line">
                    {formData.clientAddress || "—"}
                  </div>
                </div>
              </>
            )}

            {(!selectedClientId || selectedClientId === "none") && (
              <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                Please select a client to continue
              </div>
            )}
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
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => updateField("invoiceNumber", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                name="issueDate"
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
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="currency">Currency</Label>
                <Link href="/app/setup-currencies" className="text-xs text-primary hover:underline">
                  Manage currencies
                </Link>
              </div>
              <Select value={formData.currency} onValueChange={(value) => updateField("currency", value)}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map((currency) => (
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
      <div className="flex justify-end gap-4">
        <Link href={`/app/invoices/${invoiceId}`}>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button type="submit" size="lg" disabled={!selectedClientId || selectedClientId === "none" || isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Invoice"}
        </Button>
      </div>
    </form>
  )
}
