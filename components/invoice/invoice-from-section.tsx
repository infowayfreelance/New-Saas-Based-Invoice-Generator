"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type FromMode = "settings" | "manual"

interface InvoiceFromSectionProps {
  isPaid: boolean
  fromName: string
  fromEmail: string
  fromAddress: string
  settingsSnapshot: { name: string; email: string; address: string }
  onChange: (field: "fromName" | "fromEmail" | "fromAddress", value: string) => void
}

/**
 * Paid plans can toggle between the business details saved in Settings
 * (locked, auto-filled) and typing different details manually for a single
 * invoice. Free/guest users only ever see the auto-filled Settings values.
 */
export function InvoiceFromSection({
  isPaid,
  fromName,
  fromEmail,
  fromAddress,
  settingsSnapshot,
  onChange,
}: InvoiceFromSectionProps) {
  const [mode, setMode] = useState<FromMode>("settings")

  const handleModeChange = (nextMode: FromMode) => {
    if (nextMode === "settings") {
      onChange("fromName", settingsSnapshot.name)
      onChange("fromEmail", settingsSnapshot.email)
      onChange("fromAddress", settingsSnapshot.address)
    }
    setMode(nextMode)
  }

  const isManual = isPaid && mode === "manual"

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">From (Your Business)</CardTitle>
          {isPaid && (
            <div className="flex gap-1 rounded-md border p-0.5 text-xs">
              <Button
                type="button"
                size="sm"
                variant={mode === "settings" ? "default" : "ghost"}
                className="h-7 px-2 text-xs"
                onClick={() => handleModeChange("settings")}
              >
                Use Settings
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
          {isManual ? "Type the sender details for this invoice only" : "Update these details in Settings"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fromName">Business Name</Label>
          <Input
            id="fromName"
            value={fromName}
            disabled={!isManual}
            className={!isManual ? "bg-muted" : ""}
            onChange={(e) => onChange("fromName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fromEmail">Email</Label>
          <Input
            id="fromEmail"
            type="email"
            value={fromEmail}
            disabled={!isManual}
            className={!isManual ? "bg-muted" : ""}
            onChange={(e) => onChange("fromEmail", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fromAddress">Address</Label>
          <Textarea
            id="fromAddress"
            value={fromAddress}
            disabled={!isManual}
            className={!isManual ? "bg-muted" : ""}
            rows={3}
            onChange={(e) => onChange("fromAddress", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
