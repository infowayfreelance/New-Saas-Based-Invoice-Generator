"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { createAccountAction } from "@/app/actions/accounts"

export function NewAccountForm({ userId }: { userId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    try {
      const result = await createAccountAction(formData)

      if (result.error) {
        toast({
          title: "Failed to add account",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Bank account added successfully",
        })
        router.push("/app/accounts")
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: "Failed to add account",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>New bank account</CardTitle>
        <CardDescription>Details will be masked on invoices (only last 4 digits of account number).</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="account_name">Account name *</Label>
            <Input
              id="account_name"
              name="account_name"
              required
              placeholder="Business Checking"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="bank_name">Bank name *</Label>
            <Input id="bank_name" name="bank_name" required placeholder="Chase Bank" disabled={isSubmitting} />
          </div>
          <div>
            <Label htmlFor="account_number">Account number *</Label>
            <Input
              id="account_number"
              name="account_number"
              required
              placeholder="1234567890"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="routing_number">Routing number (US, optional)</Label>
              <Input id="routing_number" name="routing_number" placeholder="021000021" disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="sort_code">Sort code (UK, optional)</Label>
              <Input id="sort_code" name="sort_code" placeholder="04-29-09" disabled={isSubmitting} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="swift_code">SWIFT / IBAN (optional)</Label>
              <Input id="swift_code" name="swift_code" placeholder="CHASUS33" disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                name="currency"
                defaultValue="USD"
                placeholder="USD, GBP, EUR..."
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="bank_address">Bank address (optional)</Label>
            <Input
              id="bank_address"
              name="bank_address"
              placeholder="30 South Colonnade, E14 5HX, London, United Kingdom"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Checkbox id="is_default" name="is_default" disabled={isSubmitting} />
            <Label htmlFor="is_default" className="cursor-pointer">
              Make default for invoices
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Link href="/app/accounts">
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
