"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CURRENCIES } from "@/lib/utils/invoice"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CompanySettingsPage() {
  const [fullName, setFullName] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [timezone, setTimezone] = useState("UTC")
  const [taxId, setTaxId] = useState("")
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
          setFullName(data.full_name || "")
          setBusinessName(data.business_name || "")
          setEmail(data.email || "")
          setPhone(data.phone || "")
          setWhatsappNumber(data.whatsapp_number || "")
          setAddressLine1(data.address_line1 || "")
          setAddressLine2(data.address_line2 || "")
          setCity(data.city || "")
          setState(data.state || "")
          setPostalCode(data.postal_code || "")
          setCountry(data.country || "")
          setCurrency(data.currency || "USD")
          setTimezone(data.timezone || "UTC")
          setTaxId(data.tax_id || "")
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
      
      if (!user) {
        toast.error("Not authenticated")
        return
      }

      const payload = {
        user_id: user.id,
        full_name: fullName || null,
        business_name: businessName || null,
        email: email || null,
        phone: phone || null,
        whatsapp_number: whatsappNumber || null,
        address_line1: addressLine1 || null,
        address_line2: addressLine2 || null,
        city: city || null,
        state: state || null,
        postal_code: postalCode || null,
        country: country || null,
        currency: currency || "USD",
        timezone: timezone || "UTC",
        tax_id: taxId || null,
      }

      const { error } = await supabase
        .from("user_settings")
        .upsert(payload, { onConflict: "user_id" })

      if (error) {
        console.error("[v0] Supabase error:", error)
        toast.error(error.message || "Failed to update settings")
        return
      }

      toast.success("Company settings updated successfully")
    } catch (error) {
      console.error("[v0] Failed to update settings:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update settings")
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
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>This information will appear on your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Full Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your Business Name"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="business@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+1 234 567 8900"
                />
                <p className="text-xs text-muted-foreground">
                  Include the country code. Used to send invoices to your own WhatsApp.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="123 Business St"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Suite 100"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="NY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="USA"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.code} - {curr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    placeholder="UTC"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                <Input
                  id="taxId"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="e.g. 12-3456789"
                />
                <p className="text-xs text-muted-foreground">Shown on your invoices under your business details.</p>
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
