"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CURRENCIES } from "@/lib/utils/invoice"
import { toast } from "sonner"

export default function CompanySettingsPage() {
  const [companyName, setCompanyName] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [companyTaxId, setCompanyTaxId] = useState("")
  const [defaultCurrency, setDefaultCurrency] = useState("USD")
  const [invoicePrefix, setInvoicePrefix] = useState("INV-")
  const [invoiceStartNumber, setInvoiceStartNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const loadSettings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()
        if (data) {
          setCompanyName(data.company_name || "")
          setCompanyAddress(data.company_address || "")
          setCompanyTaxId(data.company_tax_id || "")
          setDefaultCurrency(data.default_currency || "USD")
          setInvoicePrefix(data.invoice_prefix || "INV-")
          setInvoiceStartNumber(data.invoice_start_number || 1)
        }
      }
    }
    loadSettings()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("user_settings")
        .update({
          company_name: companyName,
          company_address: companyAddress,
          company_tax_id: companyTaxId,
          default_currency: defaultCurrency,
          invoice_prefix: invoicePrefix,
          invoice_start_number: invoiceStartNumber,
        })
        .eq("user_id", user.id)

      if (error) throw error

      toast.success("Company settings updated successfully")
    } catch {
      toast.error("Failed to update settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Company Settings"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Settings", href: "/app/settings" },
          { label: "Company" },
        ]}
      />
      <div className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>This information will appear on your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyTaxId">Tax ID / VAT Number</Label>
                  <Input
                    id="companyTaxId"
                    value={companyTaxId}
                    onChange={(e) => setCompanyTaxId(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Business Address</Label>
                <Textarea
                  id="companyAddress"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="123 Business St, City, State 12345"
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                    <SelectTrigger id="defaultCurrency">
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
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input id="invoicePrefix" value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceStartNumber">Next Invoice Number</Label>
                  <Input
                    id="invoiceStartNumber"
                    type="number"
                    min="1"
                    value={invoiceStartNumber}
                    onChange={(e) => setInvoiceStartNumber(Number.parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
