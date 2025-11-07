"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { MetricsResponse } from "@/lib/types"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ChartsRotator({ data, loading }: { data?: MetricsResponse; loading: boolean }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % 4), 5000)
    return () => clearInterval(id)
  }, [])

  const series = data?.series ?? []

  const charts = useMemo(
    () => [
      {
        key: "forecast-vs-rop",
        title: "Forecasted Demand vs ROP",
        node: (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={series}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis dataKey="period" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Line type="monotone" dataKey="forecast" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="reorderPoint" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ),
      },
      {
        key: "profit-vs-cost",
        title: "Profit vs Cost Trend",
        node: (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={series}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis dataKey="period" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Line type="monotone" dataKey="profit" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="cost" stroke="var(--color-chart-5)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ),
      },
      {
        key: "units-sold",
        title: "Units Sold Trend",
        node: (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={series}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis dataKey="period" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Bar dataKey="unitsSold" fill="var(--color-chart-4)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ),
      },
      {
        key: "ss-vs-demand",
        title: "Safety Stock vs Demand",
        node: (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="areaA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="areaB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis dataKey="period" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Area type="monotone" dataKey="safetyStock" stroke="var(--color-chart-3)" fill="url(#areaB)" />
              <Area type="monotone" dataKey="forecast" stroke="var(--color-chart-1)" fill="url(#areaA)" />
            </AreaChart>
          </ResponsiveContainer>
        ),
      },
    ],
    [series],
  )

  return (
    <Card className="bg-card/60 border border-border/60">
      <CardContent className="p-4 md:p-6">
        <div className="mb-3 text-sm text-muted-foreground">Charts</div>
        {loading ? (
          <Skeleton className="h-[300px] w-full bg-muted/40" />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={charts[index].key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-2 text-foreground">{charts[index].title}</div>
              <div className="rounded-md border border-border/60 bg-background/50 p-3">{charts[index].node}</div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}
