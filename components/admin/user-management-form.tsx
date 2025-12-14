"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { updateUserRole, updateUserPlan } from "@/app/actions/admin"

type Plan = {
  id: string
  name: string
  code: string
  price_monthly: number
}

type Props = {
  userId: string
  currentRole: string
  currentPlanId: string
  plans: Plan[]
}

export function UserManagementForm({ userId, currentRole, currentPlanId, plans }: Props) {
  const [role, setRole] = useState(currentRole)
  const [planId, setPlanId] = useState(currentPlanId)
  const [isUpdatingRole, setIsUpdatingRole] = useState(false)
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false)
  const { toast } = useToast()

  async function handleUpdateRole() {
    setIsUpdatingRole(true)
    try {
      const result = await updateUserRole(userId, role)
      if (result.success) {
        toast({
          title: "Role updated",
          description: "User role has been updated successfully",
        })
      } else {
        toast({
          title: "Failed to update role",
          description: result.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingRole(false)
    }
  }

  async function handleUpdatePlan() {
    setIsUpdatingPlan(true)
    try {
      const result = await updateUserPlan(userId, planId)
      if (result.success) {
        toast({
          title: "Plan updated",
          description: "User plan has been updated successfully",
        })
      } else {
        toast({
          title: "Failed to update plan",
          description: result.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update plan",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPlan(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleUpdateRole} disabled={isUpdatingRole || role === currentRole}>
            {isUpdatingRole ? "Updating..." : "Update Role"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - ${plan.price_monthly}/mo
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleUpdatePlan} disabled={isUpdatingPlan || planId === currentPlanId || !planId}>
            {isUpdatingPlan ? "Updating..." : "Update Plan"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
