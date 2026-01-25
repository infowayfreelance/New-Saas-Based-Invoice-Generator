"use client"

import { useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { DateFilter } from "./dashboard-client"

interface DashboardFiltersProps {
  filter: DateFilter
  onFilterChange: (filter: DateFilter) => void
}

const PRESET_OPTIONS = [
  { value: "this-month" as const, label: "This Month" },
  { value: "last-30" as const, label: "Last 30 Days" },
  { value: "last-3-months" as const, label: "Last 3 Months" },
  { value: "last-6-months" as const, label: "Last 6 Months" },
  { value: "last-year" as const, label: "Last Year" },
  { value: "custom" as const, label: "Custom" },
]

export function DashboardFilters({ filter, onFilterChange }: DashboardFiltersProps) {
  const [customStartDate, setCustomStartDate] = useState<Date>()
  const [customEndDate, setCustomEndDate] = useState<Date>()

  const handlePresetChange = (preset: DateFilter["preset"]) => {
    onFilterChange({ preset })
  }

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      onFilterChange({
        preset: "custom",
        startDate: customStartDate.toISOString().split("T")[0],
        endDate: customEndDate.toISOString().split("T")[0],
      })
    }
  }

  const formatDateDisplay = (date?: Date) => {
    if (!date) return "Pick a date"
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {PRESET_OPTIONS.slice(0, -1).map((option) => (
          <Button
            key={option.value}
            variant={filter.preset === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => handlePresetChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Custom Date Range */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={filter.preset === "custom" ? "default" : "outline"}
              size="sm"
              className={cn(!customStartDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filter.preset === "custom" && filter.startDate
                ? `${filter.startDate} - ${filter.endDate}`
                : "Custom"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Calendar
                  mode="single"
                  selected={customStartDate}
                  onSelect={setCustomStartDate}
                  initialFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Calendar
                  mode="single"
                  selected={customEndDate}
                  onSelect={setCustomEndDate}
                  disabled={(date) => {
                    if (!customStartDate) return false
                    return date < customStartDate
                  }}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleCustomDateApply}
                disabled={!customStartDate || !customEndDate}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
