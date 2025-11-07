"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Controls } from "@/components/dss/controls"
import { RecommendationCard } from "@/components/dss/recommendation-card"
import { ChartsRotator } from "@/components/dss/charts-rotator"
import type { MetricsResponse } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Page() {
  const [componentType, setComponentType] = useState<string>("Resistor")
  const [monthDate, setMonthDate] = useState<Date>(new Date())

  const monthKey = useMemo(() => {
    const y = monthDate.getFullYear()
    const m = String(monthDate.getMonth() + 1).padStart(2, "0")
    return `${y}-${m}`
  }, [monthDate])

  const { data, isLoading, mutate } = useSWR<MetricsResponse>(
    `/api/metrics?component=${encodeURIComponent(componentType)}&month=${monthKey}`,
    fetcher,
    { revalidateOnFocus: false },
  )

  const onGetRecommendation = () => {
    mutate()
  }

  return (
    <main className="min-h-dvh bg-background/60 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
        <header className="mb-6 md:mb-8">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="bg-card/60 border border-border/60 shadow-none">
              <CardContent className="p-4 md:p-6">
                <h1 className="text-balance text-center text-2xl font-semibold text-foreground md:text-3xl">
                  Decision Support System
                </h1>
              </CardContent>
            </Card>
          </motion.div>
        </header>

        <section className="mb-6 md:mb-8">
          <Controls
            componentType={componentType}
            onComponentChange={setComponentType}
            monthDate={monthDate}
            onMonthDateChange={setMonthDate}
            onGet={onGetRecommendation}
            metrics={data}
          />
        </section>

        <section className="mb-6 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <RecommendationCard loading={isLoading} metrics={data} />
          </div>
          <div className="md:col-span-2">
            <ChartsRotator data={data} loading={isLoading} />
          </div>
        </section>
      </div>
    </main>
  )
}
