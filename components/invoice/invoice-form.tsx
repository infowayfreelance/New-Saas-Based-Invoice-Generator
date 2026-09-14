"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Copy, ChevronDown, ChevronUp, RefreshCw } from "lucide-react"
import {
  type InvoiceFormData,
  type InvoiceItemFormData,
  type BillingType,
  type BankAccountRecord,
  type InvoiceVisibility,
  calculateInvoiceTotals,
  computeDiscountAmount,
  formatCurrency,
  formatBankDetails,
  pickBankAccountForCurrency,
  getBillingTypeLabels,
  computeDueDateFromTerms,
  generateInvoiceNumber,
  getDefaultVisibility,
} from "@/lib/utils/invoice"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useCurrencyOrDefault } from "@/components/app/currency-provider"
import { useAuth } from "@/components/app/auth-provider"
import { ALL_CURRENCIES } from "@/lib/utils/currency"
import { InvoiceFromSection } from "@/components/invoice/invoice-from-section"
import { InvoiceClientSection } from "@/components/invoice/invoice-client-section"
import { TermsDetailField } from "@/components/invoice/terms-detail-field"

interface InvoiceFormProps {
  mode?: "create" | "edit"
  initialData: InvoiceFormData & { clientId?: string | null }
  onSubmit?: (data: InvoiceFormData & { clientId?: string | null }) => void | Promise<void>
  onChange?: (data: InvoiceFormData) => void
  invoiceId?: string
  isLoading?: boolean
  submitLabel?: string
  serverAction?: (data: InvoiceFormData & { clientId?: string | null }) => void | Promise<void>
  bankAccounts?: BankAccountRecord[]
  /** When true, the Generate/Save button is hidden (live-preview mode handles downloads separately) */
  hideSubmit?: boolean
}

const BILLING_TYPES: { value: BillingType; label: string; description: string }[] = [
  { value: "quantity", label: "Quantity / Item", description: "Qty × unit price" },
  { value: "hourly", label: "Hourly", description: "Hours × hourly rate" },
  { value: "daily", label: "Daily", description: "Days × day rate" },
  { value: "fixed", label: "Fixed Price", description: "One fixed amount" },
  { value: "milestone", label: "Milestone", description: "Named milestone payment" },
]

const PAYMENT_TERMS = [
  { value: "due-on-receipt", label: "Due on receipt" },
  { value: "net-7", label: "Net 7 (7 days)" },
  { value: "net-14", label: "Net 14 (14 days)" },
  { value: "net-30", label: "Net 30 (30 days)" },
  { value: "custom", label: "Custom date" },
]

const INVOICE_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
]

const PAYMENT_METHODS = [
  { value: "bank", label: "Bank Transfer" },
  { value: "paypal", label: "PayPal" },
  { value: "wise", label: "Wise" },
  { value: "stripe", label: "Stripe / Payment link" },
  { value: "other", label: "Other" },
]

export function InvoiceForm({
  mode = "create",
  initialData,
  onSubmit,
  onChange,
  invoiceId,
  isLoading = false,
  submitLabel = "Generate Invoice",
  serverAction,
  bankAccounts = [],
  hideSubmit = false,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(initialData)
  const [clients, setClients] = useState<any[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string | null>(initialData.clientId || null)
  const [isLoadingClients, setIsLoadingClients] = useState(true)
  const [showProject, setShowProject] = useState(
    !!(initialData.projectName || initialData.projectRef || initialData.projectDescription)
  )
  const [showPayment, setShowPayment] = useState(
    !!(initialData.bankDetails || initialData.paymentCustomNote || initialData.paymentLink)
  )
  const [showNotes, setShowNotes] = useState(!!(initialData.notes || initialData.terms))
  const [showTermsDetail, setShowTermsDetail] = useState(!!initialData.termsDetail)

  const { enabledCurrencies } = useCurrencyOrDefault()
  const { profile } = useAuth()
  const planCode = profile?.plan?.code || "BASIC"
  const isPaid = planCode === "STANDARD" || planCode === "PRO"
  const isGuest = !profile
  const lastAutoBankDetails = useRef(initialData.bankDetails || "")

  const [settingsSnapshot] = useState({
    name: initialData.fromName,
    email: initialData.fromEmail,
    address: initialData.fromAddress,
  })

  const availableCurrencies = enabledCurrencies && enabledCurrencies.length > 0
    ? ALL_CURRENCIES.filter((c) => enabledCurrencies.includes(c.code))
    : ALL_CURRENCIES

  // Keep onChange parent in sync on every formData change
  useEffect(() => {
    onChange?.(formData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

  // Auto-fill bank details when currency changes
  useEffect(() => {
    if (bankAccounts.length === 0) return
    const match = pickBankAccountForCurrency(bankAccounts, formData.currency)
    if (!match) return
    const formatted = formatBankDetails(match)
    if (formatted === formData.bankDetails) return
    if ((formData.bankDetails || "") !== lastAutoBankDetails.current) return
    lastAutoBankDetails.current = formatted
    setFormData((prev) => ({ ...prev, bankDetails: formatted }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.currency, bankAccounts])

  useEffect(() => {
    const loadClients = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setIsLoadingClients(false); return }
        const { data, error } = await supabase
          .from("clients").select("*").eq("user_id", user.id).order("name", { ascending: true })
        if (!error && data) {
          setClients(data)
          if (mode === "edit" && initialData.clientId && initialData.clientId !== "none") {
            const client = data.find((c) => c.id === initialData.clientId)
            if (client) setSelectedClientId(initialData.clientId)
          }
        }
      } catch (err) {
        console.error("Error loading clients:", err)
      } finally {
        setIsLoadingClients(false)
      }
    }
    loadClients()
  }, [mode, initialData.clientId])

  const updateField = <K extends keyof InvoiceFormData>(field: K, value: InvoiceFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePaymentTermsChange = (terms: string) => {
    updateField("paymentTerms", terms as InvoiceFormData["paymentTerms"])
    if (terms !== "custom") {
      const newDue = computeDueDateFromTerms(formData.issueDate, terms)
      if (newDue) updateField("dueDate", newDue)
    }
  }

  const handleIssueDateChange = (date: string) => {
    updateField("issueDate", date)
    if (formData.paymentTerms && formData.paymentTerms !== "custom") {
      const newDue = computeDueDateFromTerms(date, formData.paymentTerms)
      if (newDue) updateField("dueDate", newDue)
    }
  }

  const handleClientSelect = (clientId: string) => {
    if (clientId === "none") {
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
      const addr = [
        client.address_line1, client.address_line2,
        [client.city, client.state].filter(Boolean).join(", "),
        client.postal_code, client.country,
      ].filter(Boolean).join("\n")
      updateField("clientName", client.name || client.company_name || "")
      updateField("clientEmail", client.email || "")
      updateField("clientAddress", addr)
      updateField("clientTaxId", client.tax_number || "")
    }
  }

  // ─── Item management ─────────────────────────────────────────────────────

  const addItem = () => {
    const newItem: InvoiceItemFormData = {
      id: crypto.randomUUID(),
      description: "",
      detailedDescription: "",
      billingType: "quantity",
      quantity: 1,
      unitPrice: 0,
      taxRate: formData.taxRate,
    }
    updateField("items", [...formData.items, newItem])
  }

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      updateField("items", formData.items.filter((item) => item.id !== id))
    }
  }

  const duplicateItem = (id: string) => {
    const source = formData.items.find((item) => item.id === id)
    if (!source) return
    const clone: InvoiceItemFormData = { ...source, id: crypto.randomUUID() }
    const idx = formData.items.findIndex((item) => item.id === id)
    const next = [...formData.items]
    next.splice(idx + 1, 0, clone)
    updateField("items", next)
  }

  const updateItem = (id: string, field: keyof InvoiceItemFormData, value: string | number) => {
    updateField(
      "items",
      formData.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    )
  }

  // ─── Discount ────────────────────────────────────────────────────────────

  const discountType = formData.discountType || "fixed"
  const discountValue = formData.discountValue ?? formData.discountAmount ?? 0
  const rawSubtotal = formData.items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0)
  const computedDiscount = computeDiscountAmount(rawSubtotal, discountType, discountValue)

  // Sync discountAmount (used by calculations) whenever type/value changes
  useEffect(() => {
    const newAmt = computeDiscountAmount(rawSubtotal, discountType, discountValue)
    if (Math.abs(newAmt - formData.discountAmount) > 0.001) {
      setFormData((prev) => ({ ...prev, discountAmount: newAmt }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountType, discountValue, rawSubtotal])

  const totals = calculateInvoiceTotals(formData.items, computedDiscount)
  const taxLabel = formData.taxName || "Tax"

  const hasClientInfo =
    (!!selectedClientId && selectedClientId !== "none") || formData.clientName.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      await onSubmit({ ...formData, discountAmount: computedDiscount, clientId: selectedClientId })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ── From / To ─────────────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-2">
        <InvoiceFromSection
          isPaid={isPaid}
          alwaysManual={isGuest}
          fromName={formData.fromName}
          fromEmail={formData.fromEmail}
          fromAddress={formData.fromAddress}
          fromPhone={formData.fromPhone}
          fromWebsite={formData.fromWebsite}
          fromBusinessReg={formData.fromBusinessReg}
          fromTaxId={formData.fromTaxId}
          logoUrl={formData.logoUrl}
          settingsSnapshot={settingsSnapshot}
          onChange={updateField}
          onLogoChange={(url) => updateField("logoUrl", url)}
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
          onChange={(field, value) => updateField(field as keyof InvoiceFormData, value)}
          onClearSelectedClient={() => setSelectedClientId(null)}
        />
      </div>

      {/* ── Invoice Details ───────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Invoice number */}
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <div className="flex gap-2">
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => updateField("invoiceNumber", e.target.value)}
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Regenerate invoice number"
                  onClick={() => updateField("invoiceNumber", generateInvoiceNumber())}
                  className="shrink-0"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="invoiceStatus">Status</Label>
              <Select value={formData.status || "draft"} onValueChange={(v) => updateField("status", v)}>
                <SelectTrigger id="invoiceStatus"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INVOICE_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="currency">Currency</Label>
                <Link href="/app/setup-currencies" className="text-xs text-primary hover:underline">
                  Manage
                </Link>
              </div>
              <Select value={formData.currency} onValueChange={(v) => updateField("currency", v)}>
                <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.code} — {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Issue Date */}
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleIssueDateChange(e.target.value)}
                required
              />
            </div>

            {/* Payment Terms */}
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select
                value={formData.paymentTerms || "custom"}
                onValueChange={handlePaymentTermsChange}
              >
                <SelectTrigger id="paymentTerms"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_TERMS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
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

            {/* PO Number */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="poNumber">PO / Reference (optional)</Label>
              <Input
                id="poNumber"
                value={formData.poNumber || ""}
                onChange={(e) => updateField("poNumber", e.target.value)}
                placeholder="Client purchase order or ref #"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Project (collapsible) ─────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setShowProject((v) => !v)}
          >
            <div>
              <CardTitle className="text-base">Project Details</CardTitle>
              {!showProject && (
                <CardDescription className="text-xs mt-0.5">
                  {formData.projectName ? formData.projectName : "Optional — add a project name or description"}
                </CardDescription>
              )}
            </div>
            {showProject ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
        </CardHeader>
        {showProject && (
          <CardContent className="pt-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={formData.projectName || ""}
                  onChange={(e) => updateField("projectName", e.target.value)}
                  placeholder="e.g. Website Redesign – Phase 2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectRef">Project Reference (optional)</Label>
                <Input
                  id="projectRef"
                  value={formData.projectRef || ""}
                  onChange={(e) => updateField("projectRef", e.target.value)}
                  placeholder="e.g. PRJ-2024-001"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="projectDescription">Short Description (optional)</Label>
                <Input
                  id="projectDescription"
                  value={formData.projectDescription || ""}
                  onChange={(e) => updateField("projectDescription", e.target.value)}
                  placeholder="e.g. UX audit, new homepage, and mobile-responsive rebuild"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ── Items ─────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Services &amp; Items</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Choose a billing type for each item — hourly, daily, fixed, milestone, or quantity.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.items.map((item, index) => {
            const qty = Number(item.quantity) || 0
            const unitPrice = Number(item.unitPrice) || 0
            const taxRate = Number(item.taxRate) || 0
            const lineSubtotal = qty * unitPrice
            const lineTotal = lineSubtotal + lineSubtotal * (taxRate / 100)
            const labels = getBillingTypeLabels(item.billingType || "quantity")
            const showQty = labels.qty !== null

            return (
              <div
                key={item.id}
                className="rounded-lg border bg-muted/20 p-4 space-y-3"
              >
                {/* Row 1: Billing type selector + item number */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground shrink-0">
                      {index + 1}
                    </span>
                    <Select
                      value={item.billingType || "quantity"}
                      onValueChange={(v) => updateItem(item.id, "billingType", v)}
                    >
                      <SelectTrigger className="h-7 w-36 text-xs bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BILLING_TYPES.map((bt) => (
                          <SelectItem key={bt.value} value={bt.value} className="text-xs">
                            <span>{bt.label}</span>
                            <span className="ml-1 text-muted-foreground">· {bt.description}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => duplicateItem(item.id)}
                      title="Duplicate item"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Row 2: Description */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    {item.billingType === "milestone" ? "Milestone Name" : "Description"}
                  </Label>
                  <Input
                    placeholder={
                      item.billingType === "hourly" ? "e.g. Web development"
                      : item.billingType === "daily" ? "e.g. Strategy consulting"
                      : item.billingType === "fixed" ? "e.g. Logo design"
                      : item.billingType === "milestone" ? "e.g. Final 50% payment"
                      : "Service or product description"
                    }
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="bg-background"
                    required
                  />
                </div>

                {/* Row 3: Qty × Rate + Tax + Amount */}
                <div className={`grid gap-3 ${showQty ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"}`}>
                  {showQty && (
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">{labels.qty}</Label>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                        className="bg-background"
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{labels.rate}</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Tax %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={item.taxRate}
                      onChange={(e) => updateItem(item.id, "taxRate", parseFloat(e.target.value) || 0)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Amount</Label>
                    <div className="flex h-10 items-center rounded-md border bg-muted/50 px-3 text-sm font-semibold">
                      {formatCurrency(lineTotal, formData.currency)}
                    </div>
                  </div>
                </div>

                {/* Optional: detailed description */}
                <div>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    onClick={() => updateItem(item.id, "detailedDescription",
                      item.detailedDescription === undefined ? "" : undefined as any
                    )}
                  >
                    {item.detailedDescription !== undefined ? (
                      <><ChevronUp className="h-3 w-3" /> Hide details</>
                    ) : (
                      <><Plus className="h-3 w-3" /> Add details / sub-text</>
                    )}
                  </button>
                  {item.detailedDescription !== undefined && (
                    <Textarea
                      className="mt-1.5 bg-background text-xs"
                      placeholder="Additional notes for this line item…"
                      rows={2}
                      value={item.detailedDescription || ""}
                      onChange={(e) => updateItem(item.id, "detailedDescription", e.target.value)}
                    />
                  )}
                </div>
              </div>
            )
          })}

          {/* ── Totals ──────────────────────────────────────────────── */}
          <Separator className="my-2" />
          <div className="flex flex-col items-end gap-2">
            <div className="flex w-full max-w-xs justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(totals.subtotal, formData.currency)}</span>
            </div>

            {/* Tax row */}
            <div className="flex w-full max-w-xs items-center gap-2 text-sm">
              <span className="text-muted-foreground shrink-0">
                {taxLabel || "Tax"} (per item)
              </span>
              <Input
                type="text"
                className="h-7 w-20 text-xs px-2"
                placeholder="VAT / Tax name"
                value={formData.taxName || ""}
                onChange={(e) => updateField("taxName", e.target.value)}
                title="Tax label (e.g. VAT 20%, GST)"
              />
              <span className="text-sm ml-auto">{formatCurrency(totals.taxAmount, formData.currency)}</span>
            </div>

            {/* Discount row */}
            <div className="flex w-full max-w-xs items-center gap-2 text-sm">
              <span className="text-muted-foreground shrink-0">Discount</span>
              <Select
                value={discountType}
                onValueChange={(v) => updateField("discountType", v as "percentage" | "fixed")}
              >
                <SelectTrigger className="h-7 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed" className="text-xs">Fixed</SelectItem>
                  <SelectItem value="percentage" className="text-xs">%</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="0"
                step="0.01"
                className="h-7 w-20 text-right text-xs px-2"
                value={discountValue}
                onChange={(e) => {
                  const v = parseFloat(e.target.value) || 0
                  setFormData((prev) => ({
                    ...prev,
                    discountValue: v,
                    discountAmount: computeDiscountAmount(rawSubtotal, discountType, v),
                  }))
                }}
              />
              {discountType === "percentage" && (
                <span className="text-muted-foreground text-xs shrink-0">
                  = {formatCurrency(computedDiscount, formData.currency)}
                </span>
              )}
            </div>

            <Separator className="my-1 w-full max-w-xs" />
            <div className="flex w-full max-w-xs justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totals.totalAmount, formData.currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Payment Details (collapsible) ────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setShowPayment((v) => !v)}
          >
            <div>
              <CardTitle className="text-base">Payment Details</CardTitle>
              {!showPayment && (
                <CardDescription className="text-xs mt-0.5">
                  {formData.paymentMethod
                    ? `${PAYMENT_METHODS.find((m) => m.value === formData.paymentMethod)?.label || formData.paymentMethod}`
                    : "Optional — bank transfer, PayPal, Stripe, etc."}
                </CardDescription>
              )}
            </div>
            {showPayment ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
        </CardHeader>
        {showPayment && (
          <CardContent className="pt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod || "bank"}
                onValueChange={(v) => updateField("paymentMethod", v as InvoiceFormData["paymentMethod"])}
              >
                <SelectTrigger id="paymentMethod"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bank transfer fields */}
            {formData.paymentMethod === "bank" && (
              <div className="space-y-2">
                <Label htmlFor="bankDetails">Bank Details</Label>
                <Textarea
                  id="bankDetails"
                  placeholder="Account holder, bank name, account number, sort code, IBAN, BIC/SWIFT…"
                  value={formData.bankDetails || ""}
                  onChange={(e) => updateField("bankDetails", e.target.value)}
                  rows={4}
                />
              </div>
            )}

            {/* Link-based payments */}
            {(formData.paymentMethod === "paypal" || formData.paymentMethod === "stripe" || formData.paymentMethod === "wise") && (
              <div className="space-y-2">
                <Label htmlFor="paymentLink">Payment Link / Email</Label>
                <Input
                  id="paymentLink"
                  value={formData.paymentLink || ""}
                  onChange={(e) => updateField("paymentLink", e.target.value)}
                  placeholder={
                    formData.paymentMethod === "paypal" ? "paypal.me/yourname or PayPal email"
                    : formData.paymentMethod === "wise" ? "wise.com/pay/yourname or email"
                    : "https://buy.stripe.com/..."
                  }
                />
              </div>
            )}

            {/* Custom note */}
            <div className="space-y-2">
              <Label htmlFor="paymentCustomNote">
                {formData.paymentMethod === "bank" ? "Additional payment note (optional)" : "Payment instructions"}
              </Label>
              <Textarea
                id="paymentCustomNote"
                placeholder={`e.g. Please use ${formData.invoiceNumber} as the payment reference.`}
                value={formData.paymentCustomNote || ""}
                onChange={(e) => updateField("paymentCustomNote", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* ── Notes & Terms (collapsible) ───────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setShowNotes((v) => !v)}
          >
            <div>
              <CardTitle className="text-base">Notes &amp; Terms</CardTitle>
              {!showNotes && (
                <CardDescription className="text-xs mt-0.5">
                  Optional — thank you note, late payment policy, etc.
                </CardDescription>
              )}
            </div>
            {showNotes ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
        </CardHeader>
        {showNotes && (
          <CardContent className="pt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="e.g. Thank you for your business. Please don't hesitate to reach out with any questions."
                value={formData.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms">Short Terms / Important Note</Label>
              <Textarea
                id="terms"
                placeholder="e.g. Payment is due within 30 days. Late payments may incur a 2% monthly fee."
                value={formData.terms}
                onChange={(e) => updateField("terms", e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
                onClick={() => setShowTermsDetail((v) => !v)}
              >
                {showTermsDetail ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {showTermsDetail ? "Hide full T&C" : "Add full Terms & Conditions (separate PDF page)"}
              </button>
              {showTermsDetail && (
                <TermsDetailField
                  value={formData.termsDetail || ""}
                  onChange={(v) => updateField("termsDetail", v)}
                />
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* ── Submit ──────────────────────────────────────────────────── */}
      {!hideSubmit && (
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isLoading || !hasClientInfo}>
            {isLoading ? "Generating…" : submitLabel}
          </Button>
        </div>
      )}
    </form>
  )
}
