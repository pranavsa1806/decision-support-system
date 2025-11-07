"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import type { MetricsResponse } from "@/lib/types"

function Currency({ value }: { value: number }) {
  return (
    <span>
      {new Intl.NumberFormat("en", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value)}
    </span>
  )
}

export function RecommendationCard({
  loading,
  metrics,
}: {
  loading: boolean
  metrics?: MetricsResponse
}) {
  if (loading || !metrics) {
    return (
      <Card className="bg-card/60 border border-border/60">
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-3">
            <Skeleton className="h-4 w-2/3 bg-muted/40" />
            <Skeleton className="h-10 w-full bg-muted/40" />
            <Skeleton className="h-10 w-full bg-muted/40" />
            <Skeleton className="h-10 w-full bg-muted/40" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const monthLabel = metrics.monthLabel
  const needsReorder = metrics.stockoutRisk || metrics.reorderPoint > metrics.forecastedDemand

  return (
    <Card className="bg-card/60 border border-border/60">
      <CardContent className="p-4 md:p-6">
        <div className="grid gap-4">
          <div className="text-sm text-muted-foreground">Overview</div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-background/50 p-3 border border-border/60">
              <div className="text-muted-foreground">Forecasted Demand</div>
              <div className="text-lg font-medium text-foreground">{metrics.forecastedDemand}</div>
            </div>
            <div className="rounded-md bg-background/50 p-3 border border-border/60">
              <div className="text-muted-foreground">Safety Stock</div>
              <div className="text-lg font-medium text-foreground">{metrics.safetyStock}</div>
            </div>
            <div className="rounded-md bg-background/50 p-3 border border-border/60">
              <div className="text-muted-foreground">Reorder Point</div>
              <div className="text-lg font-medium text-foreground">{metrics.reorderPoint}</div>
            </div>
            <div className="rounded-md bg-background/50 p-3 border border-border/60">
              <div className="text-muted-foreground">Buy / Warehouse / Sell</div>
              <div className="text-lg font-medium text-foreground">
                <Currency value={metrics.buyPrice} /> / <Currency value={metrics.warehousePrice} /> /{" "}
                <Currency value={metrics.sellPrice} />
              </div>
            </div>
          </div>

          <div className="rounded-md bg-background/50 p-3 border border-border/60 text-sm">
            <div className="mb-2 text-muted-foreground">Recommendation</div>
            <div className="flex items-start gap-2 text-pretty">
              {needsReorder ? (
                <AlertTriangle className="h-5 w-5 text-foreground" aria-hidden />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-foreground" aria-hidden />
              )}
              <p className="text-foreground">
                {needsReorder
                  ? `Reorder required in ${monthLabel}. Safety Stock = ${metrics.safetyStock}, ROP = ${metrics.reorderPoint}.`
                  : `No reorder needed in ${monthLabel}.`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-background/50 p-3 border border-border/60">
              <div className="text-muted-foreground">Projected Profit/Loss</div>
              <div
                className="text-lg font-medium"
                style={{ color: metrics.projectedProfit >= 0 ? "var(--color-primary)" : "var(--color-destructive)" }}
              >
                <Currency value={metrics.projectedProfit} />
              </div>
            </div>
            <div className="rounded-md bg-background/50 p-3 border border-border/60">
              <div className="text-muted-foreground">Stockout Risk</div>
              <div className="text-lg font-medium text-foreground">{metrics.stockoutRisk ? "Yes" : "No"}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
