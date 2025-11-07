"use client"

import { cn } from "@/lib/utils"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { motion } from "framer-motion"
import type { MetricsResponse } from "@/lib/types"

type Props = {
  componentType: string
  onComponentChange: (v: string) => void
  monthDate: Date
  onMonthDateChange: (d: Date) => void
  onGet: () => void
  metrics?: MetricsResponse
}

const items = ["Resistor", "Capacitor", "IC", "Transistor", "Diode", "Connector", "Sensor"]

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date)
}

export function Controls({ componentType, onComponentChange, monthDate, onMonthDateChange, onGet, metrics }: Props) {
  const hasData = !!metrics
  const csvContent = useMemo(() => {
    if (!metrics) return ""
    const header = ["period", "forecast", "safetyStock", "reorderPoint", "unitsSold", "cost", "profit"].join(",")
    const rows = metrics.series
      .map((p) => [p.period, p.forecast, p.safetyStock, p.reorderPoint, p.unitsSold, p.cost, p.profit].join(","))
      .join("\n")
    const summary = `\n\nsummary,,,\nforecastedDemand,${metrics.forecastedDemand}\nsafetyStock,${metrics.safetyStock}\nreorderPoint,${metrics.reorderPoint}\nbuyPrice,${metrics.buyPrice}\nwarehousePrice,${metrics.warehousePrice}\nsellPrice,${metrics.sellPrice}\nprojectedProfit,${metrics.projectedProfit}\nstockoutRisk,${metrics.stockoutRisk ? "Yes" : "No"}\n`
    return `${header}\n${rows}${summary}`
  }, [metrics])

  const downloadCsv = () => {
    if (!csvContent) return
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `report-${componentType}-${formatMonth(monthDate).replace(/\s/g, "-")}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-card/60 border border-border/60">
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end">
          <div className="md:col-span-1">
            <label className="mb-2 block text-sm text-muted-foreground">Component</label>
            <Select value={componentType} onValueChange={onComponentChange}>
              <SelectTrigger className="bg-background/60 border-border/60">
                <SelectValue placeholder="Select component" />
              </SelectTrigger>
              <SelectContent className="bg-popover/80 backdrop-blur-md">
                {items.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-1">
            <label className="mb-2 block text-sm text-muted-foreground">Month & Year</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full bg-background/60 border-border/60 text-foreground">
                  {formatMonth(monthDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto bg-popover/80 backdrop-blur-md border-border/60">
                <Calendar
                  mode="single"
                  selected={monthDate}
                  onSelect={(d) => d && onMonthDateChange(new Date(d.getFullYear(), d.getMonth(), 1))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:col-span-1">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onGet}
                className={cn(
                  "w-full bg-background/60 text-foreground",
                  "border border-border/60 ring-foreground/0 hover:ring-foreground/20 hover:ring-2",
                  "backdrop-blur-md transition-shadow",
                )}
              >
                Get Recommendation
              </Button>
            </motion.div>
          </div>

          <div className="md:col-span-1">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                disabled={!hasData}
                onClick={downloadCsv}
                className={cn(
                  "w-full bg-background/60 text-foreground",
                  "border border-border/60 hover:ring-foreground/20 hover:ring-2 backdrop-blur-md",
                )}
              >
                Download Report (CSV)
              </Button>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
