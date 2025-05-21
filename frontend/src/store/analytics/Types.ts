 export interface AnalyticsData {
  totalOrdersThisMonth: number
  revenuePerDay: Array<{
    date: string
    revenue: number
  }>
  topItems: Array<{
    id: string
    name: string
    price: number
    category: string
    totalQuantity: number
  }>
}