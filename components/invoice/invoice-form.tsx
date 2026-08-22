"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { useCurrencyOrDefault } from "@/components/app/currency-provider"
import { useAuth } from "@/components/app/auth-provider"
import { ALL_CURRENCIES } from "@/lib/utils/currency"
import { InvoiceFromSection } from "@/components/invoice/invoice-from-section"
import { InvoiceClientSection } from "@/components/invoice/invoice-client-section"

interface InvoiceFormProps {
  mode?: "create" | "edit"
  initialData: InvoiceFormData & { clientId?: string | null }
  onSubmit?: (data: InvoiceFormData & { clientId?: string | null }) => void | Promise<void>
  invoiceId?: string
  isLoading?: boolean
  submitLabel?: string
  serverAction?: (data: InvoiceFormData & { clientId?: string | null }) => void | Promise<void>
}

export function InvoiceForm({
  mode = "create",
  initialData,
  onSubmit,
  invoiceId,
  isLoading = false,
  submitLabel = "Generate Invoice",
  serverAction,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(initialData)
  const [clients, setClients] = useState<any[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string | null>(initialData.clientId || null)
  const [isLoadingClients, setIsLoadingClients] = useState(true)
  const { enabledCurrencies } = useCurrencyOrDefault()
  const { profile } = useAuth()
  const planCode = profile?.plan?.code || "BASIC"
  const isPaid = planCode === "STANDARD" || planCode === "PRO"
  // No account at all (e.g. the homepage demo generator) - there's no
  // Settings to lock the From fields to, so just make them editable.
  const isGuest = !profile
  const [settingsSnapshot] = useState({
    name: initialData.fromName,
    email: initialData.fromEmail,
    address: initialData.fromAddress,
  })

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
          
          // In edit mode, if we have a clientId, prefill the client data
          if (mode === "edit" && initialData.clientId && initialData.clientId !== "none") {
            const client = data.find((c) => c.id === initialData.clientId)
            if (client) {
              // Client data is already in initialData, just make sure it's set
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
  }, [mode, initialData.clientId])

  const updateField = <K extends keyof InvoiceFormData>(field: K, value: InvoiceFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClientSelect = (clientId: string) => {
    if (clientId === "none") {
      // Clear client fields and set to null
      setSelectedClientId(null)
      updateField("clientName", "")
      updateField("clientEmail", "")
      updateField("clientAddress", "")
      updateField("clientTaxId", "")
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
      updateField("clientTaxId", client.tax_number || "")
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
  const hasClientInfo =
    (!!selectedClientId && selectedClientId !== "none") || formData.clientName.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      await onSubmit({ ...formData, clientId: selectedClientId })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <InvoiceFromSection
          isPaid={isPaid}
          alwaysManual={isGuest}
          fromName={formData.fromName}
          fromEmail={formData.fromEmail}
          fromAddress={formData.fromAddress}
          settingsSnapshot={settingsSnapshot}
          onChange={updateField}
        />

        <InvoiceClientSection
          isPaid={isPaid}
          clients={clients}
          isLoadingClients={isLoadingClients}
          selectedClientId={selectedClientId}
          clientName={formData.clientName}
          clientEmail={formData.clientEmail}
          clientAddress={formData.clientAddress}
          onSelectClient={handleClientSelect}
          onChange={updateField}
          onClearSelectedClient={() => setSelectedClientId(null)}
        />
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
              <Label htmlFor="poNumber">PO Number (optional)</Label>
              <Input
                id="poNumber"
                value={formData.poNumber || ""}
                onChange={(e) => updateField("poNumber", e.target.value)}
                placeholder="Client's purchase order #"
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
        <CardContent className="space-y-3">
          {/* Header - Desktop */}
          <div className="hidden grid-cols-12 gap-4 px-4 text-sm font-medium text-muted-foreground md:grid">
            <div className="col-span-1"></div>
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Unit Price</div>
            <div className="col-span-1">Tax %</div>
            <div className="col-span-1 text-right">Amount</div>
            <div className="col-span-1"></div>
          </div>
          {formData.items.map((item, index) => {
            const quantity = Number(item.quantity) || 0
            const unitPrice = Number(item.unitPrice) || 0
            const taxRate = Number(item.taxRate) || 0
            const lineSubtotal = quantity * unitPrice
            const lineTotal = lineSubtotal + lineSubtotal * (taxRate / 100)

            return (
              <div
                key={item.id}
                className="rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="grid gap-4 md:grid-cols-12 md:items-end">
                  <div className="hidden md:col-span-1 md:flex md:items-end md:justify-center md:pb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                      {index + 1}
                    </span>
                  </div>
                  <div className="space-y-2 md:col-span-4 md:space-y-0">
                    <Label className="md:hidden">Description</Label>
                    <Input
                      placeholder="Service or product description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="bg-background"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 md:col-span-5 md:grid-cols-3">
                    <div className="space-y-2 md:space-y-0">
                      <Label className="md:hidden">Qty</Label>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
                        className="bg-background"
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
                        className="bg-background"
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
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-2 md:col-span-2 md:justify-end">
                    <span className="text-sm font-medium text-muted-foreground md:hidden">Amount</span>
                    <span className="text-sm font-semibold">{formatCurrency(lineTotal, formData.currency)}</span>
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
              </div>
            )
          })}

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
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Bank Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Bank name, account name, account number..."
              value={formData.bankDetails || ""}
              onChange={(e) => updateField("bankDetails", e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading || !hasClientInfo}>
          {isLoading ? "Generating..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
