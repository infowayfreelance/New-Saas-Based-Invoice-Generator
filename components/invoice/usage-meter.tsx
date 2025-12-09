import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface UsageMeterProps {
  dailyUsed: number
  dailyLimit: number | null
  monthlyUsed: number
  monthlyLimit: number | null
  canCreate: boolean
}

export function UsageMeter({ dailyUsed, dailyLimit, monthlyUsed, monthlyLimit, canCreate }: UsageMeterProps) {
  if (dailyLimit === null && monthlyLimit === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <span>Unlimited invoices</span>
      </div>
    )
  }

  const dailyPercent = dailyLimit ? (dailyUsed / dailyLimit) * 100 : 0
  const monthlyPercent = monthlyLimit ? (monthlyUsed / monthlyLimit) * 100 : 0

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Usage Limits</span>
        {!canCreate && <AlertCircle className="h-4 w-4 text-destructive" />}
      </div>
      {dailyLimit !== null && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Daily</span>
            <span>
              {dailyUsed} / {dailyLimit}
            </span>
          </div>
          <Progress value={dailyPercent} className="h-2" />
        </div>
      )}
      {monthlyLimit !== null && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Monthly</span>
            <span>
              {monthlyUsed} / {monthlyLimit}
            </span>
          </div>
          <Progress value={monthlyPercent} className="h-2" />
        </div>
      )}
    </div>
  )
}
