"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function NewClientPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    taxNumber: "", // Added tax_number field
    notes: "",
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("You must be logged in to create a client")
        setIsLoading(false)
        return
      }

      const insertPayload: Record<string, any> = {
        user_id: user.id,
        name: formData.name.trim(),
      }

      // Only include optional fields if they have values
      if (formData.email.trim()) insertPayload.email = formData.email.trim()
      if (formData.phone.trim()) insertPayload.phone = formData.phone.trim()
      if (formData.companyName.trim()) insertPayload.company_name = formData.companyName.trim()
      if (formData.addressLine1.trim()) insertPayload.address_line1 = formData.addressLine1.trim()
      if (formData.addressLine2.trim()) insertPayload.address_line2 = formData.addressLine2.trim()
      if (formData.city.trim()) insertPayload.city = formData.city.trim()
      if (formData.state.trim()) insertPayload.state = formData.state.trim()
      if (formData.postalCode.trim()) insertPayload.postal_code = formData.postalCode.trim()
      if (formData.country.trim()) insertPayload.country = formData.country.trim()
      if (formData.taxNumber.trim()) insertPayload.tax_number = formData.taxNumber.trim()
      if (formData.notes.trim()) insertPayload.notes = formData.notes.trim()

      const { data, error } = await supabase.from("clients").insert(insertPayload).select().single()

      if (error) {
        console.error("Client insert error:", error)
        toast.error(`Failed to add client: ${error.message || "Unknown database error"}`)
        setIsLoading(false)
        return
      }

      toast.success("Client added successfully")
      router.push("/app/clients")
    } catch (err) {
      console.error("Unexpected error creating client:", err)
      toast.error(`Failed to add client: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Add Client"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Clients", href: "/app/clients" },
          { label: "Add Client" },
        ]}
      />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Client contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Client name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
              <CardDescription>Client billing address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => updateField("addressLine1", e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) => updateField("addressLine2", e.target.value)}
                  placeholder="Apt, suite, unit, etc."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State / Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    placeholder="12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxNumber">Tax Number / VAT ID</Label>
                <Input
                  id="taxNumber"
                  value={formData.taxNumber}
                  onChange={(e) => updateField("taxNumber", e.target.value)}
                  placeholder="Optional tax identification number"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Additional information about this client</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Internal notes about this client..."
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Client"}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
