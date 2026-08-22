"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { deleteAccountAction } from "@/app/actions/accounts"
import { Building2, Edit, Trash2 } from "lucide-react"

interface BankAccount {
  id: string
  account_name: string
  bank_name: string
  account_number: string
  currency: string
  is_default: boolean
}

export function AccountsList({ accounts }: { accounts: BankAccount[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Delete this bank account? This cannot be undone.")) return

    setDeletingId(id)
    try {
      const result = await deleteAccountAction(id)
      if (result.error) {
        toast({ title: "Failed to delete account", description: result.error, variant: "destructive" })
      } else {
        toast({ title: "Bank account deleted" })
        router.refresh()
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid gap-4">
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{account.account_name}</p>
                  {account.is_default && <Badge variant="secondary">Default</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {account.bank_name} · ****{account.account_number.slice(-4)} · {account.currency}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/app/accounts/${account.id}`}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(account.id)}
                disabled={deletingId === account.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
