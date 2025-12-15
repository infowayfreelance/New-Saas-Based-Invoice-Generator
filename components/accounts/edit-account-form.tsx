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
import { updateAccountAction, deleteAccountAction } from "@/app/actions/accounts"

interface BankAccount {
  id: string
  account_name: string
  bank_name: string
  account_number: string
  routing_number?: string | null
  swift_code?: string | null
  currency?: string | null
  is_default: boolean
}

export function EditAccountForm({ account }: { account: BankAccount }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    try {
      const result = await updateAccountAction(account.id, formData)

      if (result.error) {
        toast({
          title: "Failed to update account",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Bank account updated successfully",
        })
        router.push("/app/accounts")
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: "Failed to update account",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this bank account? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteAccountAction(account.id)

      if (result.error) {
        toast({
          title: "Failed to delete account",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Bank account deleted successfully",
        })
        router.push("/app/accounts")
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: "Failed to delete account",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{account.account_name}</CardTitle>
        <CardDescription>Update or remove this account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="account_name">Account name *</Label>
            <Input
              id="account_name"
              name="account_name"
              defaultValue={account.account_name}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="bank_name">Bank name *</Label>
            <Input id="bank_name" name="bank_name" defaultValue={account.bank_name} required disabled={isSubmitting} />
          </div>
          <div>
            <Label htmlFor="account_number">Account number *</Label>
            <Input
              id="account_number"
              name="account_number"
              defaultValue={account.account_number}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="routing_number">Routing number</Label>
              <Input
                id="routing_number"
                name="routing_number"
                defaultValue={account.routing_number ?? ""}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="swift_code">SWIFT / IBAN</Label>
              <Input
                id="swift_code"
                name="swift_code"
                defaultValue={account.swift_code ?? ""}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" name="currency" defaultValue={account.currency ?? "USD"} disabled={isSubmitting} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                id="is_default"
                name="is_default"
                defaultChecked={!!account.is_default}
                disabled={isSubmitting}
              />
              <Label htmlFor="is_default" className="cursor-pointer">
                Make default
              </Label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
            <Link href="/app/accounts">
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>

        <div className="mt-6 border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-destructive">Danger Zone</h4>
              <p className="text-sm text-muted-foreground">Permanently delete this bank account.</p>
            </div>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || isSubmitting}>
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
