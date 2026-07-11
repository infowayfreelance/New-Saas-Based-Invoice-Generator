"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { buildWhatsAppLink, isValidWhatsAppNumber } from "@/lib/utils/whatsapp"
import { markInvoiceAsSent } from "@/app/actions/invoice-status"

interface SendWhatsAppMenuProps {
  invoiceId: string
  message: string
  senderWhatsapp?: string | null
  clientWhatsapp?: string | null
  clientName?: string | null
}

export function SendWhatsAppMenu({
  invoiceId,
  message,
  senderWhatsapp,
  clientWhatsapp,
  clientName,
}: SendWhatsAppMenuProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [customNumber, setCustomNumber] = useState("")

  const openWhatsApp = (number: string) => {
    if (!isValidWhatsAppNumber(number)) {
      toast.error("Enter a valid WhatsApp number with country code")
      return
    }

    window.open(buildWhatsAppLink(number, message), "_blank", "noopener,noreferrer")

    // USER INTENT: sending via WhatsApp counts the same as downloading or emailing it
    markInvoiceAsSent(invoiceId).catch((err) => console.error("[v0] Failed to mark invoice as sent:", err))
  }

  const handleCustomSend = () => {
    openWhatsApp(customNumber)
    setDialogOpen(false)
    setCustomNumber("")
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-transparent">
            <MessageCircle className="mr-2 h-4 w-4" />
            Send via WhatsApp
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {senderWhatsapp && (
            <DropdownMenuItem onClick={() => openWhatsApp(senderWhatsapp)}>My WhatsApp Number</DropdownMenuItem>
          )}
          {clientWhatsapp && (
            <DropdownMenuItem onClick={() => openWhatsApp(clientWhatsapp)}>
              {clientName ? `${clientName}'s WhatsApp` : "Client's WhatsApp"}
            </DropdownMenuItem>
          )}
          {(senderWhatsapp || clientWhatsapp) && <DropdownMenuSeparator />}
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>Enter a number...</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send via WhatsApp</DialogTitle>
            <DialogDescription>Enter a WhatsApp number with country code (e.g. +1 234 567 8900).</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="whatsapp-number">WhatsApp Number</Label>
            <Input
              id="whatsapp-number"
              value={customNumber}
              onChange={(e) => setCustomNumber(e.target.value)}
              placeholder="+1 234 567 8900"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCustomSend} disabled={!customNumber.trim()}>
              Open WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
