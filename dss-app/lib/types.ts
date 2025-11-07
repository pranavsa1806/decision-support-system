export type MetricsPoint = {
  period: string
  forecast: number
  safetyStock: number
  reorderPoint: number
  unitsSold: number
  cost: number
  profit: number
}

export type MetricsResponse = {
  component: string
  month: string // YYYY-MM
  monthLabel: string
  forecastedDemand: number
  safetyStock: number
  reorderPoint: number
  buyPrice: number
  warehousePrice: number
  sellPrice: number
  projectedProfit: number
  stockoutRisk: boolean
  series: MetricsPoint[]
}
