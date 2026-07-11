"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type ClientMode = "existing" | "manual"

interface InvoiceClientSectionProps {
  isPaid: boolean
  clients: any[]
  isLoadingClients: boolean
  selectedClientId: string | null
  clientName: string
  clientEmail: string
  clientAddress: string
  onSelectClient: (clientId: string) => void
  onChange: (field: "clientName" | "clientEmail" | "clientAddress", value: string) => void
  onClearSelectedClient: () => void
}

/**
 * Paid plans can toggle between picking a saved client (with a link to
 * create one) and typing a client's details manually for a single invoice.
 * Free/guest users - who don't have the saved-clients feature - only ever
 * see the manual fields.
 */
export function InvoiceClientSection({
  isPaid,
  clients,
  isLoadingClients,
  selectedClientId,
  clientName,
  clientEmail,
  clientAddress,
  onSelectClient,
  onChange,
  onClearSelectedClient,
}: InvoiceClientSectionProps) {
  const [mode, setMode] = useState<ClientMode>("existing")

  const handleModeChange = (nextMode: ClientMode) => {
    if (nextMode === "manual") {
      // Decouple from any previously selected saved client - these fields
      // are now independent, custom text for this invoice only.
      onClearSelectedClient()
    } else {
      onSelectClient("none")
    }
    setMode(nextMode)
  }

  const isManual = !isPaid || mode === "manual"

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">To (Client)</CardTitle>
          {isPaid && (
            <div className="flex gap-1 rounded-md border p-0.5 text-xs">
              <Button
                type="button"
                size="sm"
                variant={mode === "existing" ? "default" : "ghost"}
                className="h-7 px-2 text-xs"
                onClick={() => handleModeChange("existing")}
              >
                Saved Client
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "manual" ? "default" : "ghost"}
                className="h-7 px-2 text-xs"
                onClick={() => handleModeChange("manual")}
              >
                Enter Manually
              </Button>
            </div>
          )}
        </div>
        <CardDescription className="text-xs">
          {isManual ? (
            "Type the client's details for this invoice only"
          ) : (
            <>
              Select an existing client or{" "}
              <Link href="/app/clients/new" className="text-primary hover:underline">
                create a new one
              </Link>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isManual ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => onChange("clientName", e.target.value)}
                placeholder="Client or company name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={clientEmail}
                onChange={(e) => onChange("clientEmail", e.target.value)}
                placeholder="client@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Address</Label>
              <Textarea
                id="clientAddress"
                value={clientAddress}
                onChange={(e) => onChange("clientAddress", e.target.value)}
                rows={3}
                placeholder="Client's billing address"
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="clientSelect">Select Client</Label>
              <Select value={selectedClientId ?? "none"} onValueChange={onSelectClient} disabled={isLoadingClients}>
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

            {selectedClientId && selectedClientId !== "none" ? (
              <>
                <div className="space-y-2">
                  <Label>Client Name</Label>
                  <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm">
                    {clientName || "—"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm">
                    {clientEmail || "—"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm whitespace-pre-line">
                    {clientAddress || "—"}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                Please select a client to continue
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
