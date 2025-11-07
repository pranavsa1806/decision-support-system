import type { NextRequest } from "next/server"
import type { MetricsResponse, MetricsPoint } from "@/lib/types"

function mulberry32(a: number) {
  return () => {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const component = searchParams.get("component") || "Resistor"
  const month = searchParams.get("month") || "2025-09"

  // derive seed from params for deterministic data
  const seedBase =
    component.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) +
    month.split("-").reduce((acc, n) => acc + Number.parseInt(n, 10), 0)

  const rand = mulberry32(seedBase)

  // Prices
  const buyPrice = Math.round(1 + rand() * 49) // 1..50
  const warehousePrice = Math.round(buyPrice * (1 + 0.1 + rand() * 0.1))
  const sellPrice = Math.round(warehousePrice * (1.1 + rand() * 0.2))

  // Base demand and variability
  const baseDemand = Math.round(300 + rand() * 700) // 300..1000
  const safetyStock = Math.round(baseDemand * (0.15 + rand() * 0.2)) // 15%..35%
  const reorderPoint = Math.round(baseDemand * (0.6 + rand() * 0.3)) // 60%..90%

  // Synthetic 12-period series (e.g., prior 9, current, next 2)
  const series: MetricsPoint[] = Array.from({ length: 12 }, (_, i) => {
    const noise = Math.round((rand() - 0.5) * baseDemand * 0.15)
    const forecast = clamp(baseDemand + noise, Math.round(baseDemand * 0.6), Math.round(baseDemand * 1.4))
    const unitsSold = clamp(Math.round(forecast * (0.9 + rand() * 0.15)), 0, forecast + 50)
    const cost = unitsSold * warehousePrice
    const revenue = unitsSold * sellPrice
    const profit = Math.round(revenue - cost)
    const ss = Math.round(safetyStock * (0.9 + rand() * 0.2))
    const rop = Math.round(reorderPoint * (0.9 + rand() * 0.2))

    return {
      period: `P${i + 1}`,
      forecast,
      safetyStock: ss,
      reorderPoint: rop,
      unitsSold,
      cost,
      profit,
    }
  })

  // pick the current period as index 10 arbitrarily
  const current = series[9]
  const forecastedDemand = current.forecast
  const projectedProfit = current.profit
  const stockoutRisk = current.forecast > current.safetyStock + current.reorderPoint

  const monthLabel = new Date(`${month}-01`).toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  })

  const payload: MetricsResponse = {
    component,
    month,
    monthLabel,
    forecastedDemand,
    safetyStock,
    reorderPoint,
    buyPrice,
    warehousePrice,
    sellPrice,
    projectedProfit,
    stockoutRisk,
    series,
  }

  return new Response(JSON.stringify(payload), {
    headers: { "content-type": "application/json" },
  })
}
