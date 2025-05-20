import { useCallback, useEffect, useState } from 'react'
import { fetchAnalytics, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'

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

export function useAnalytics(restaurantId: string) {
  const [state, setState] = useState<ApiState<AnalyticsData>>(createInitialApiState())

  const fetchData = useCallback(async () => {
    setState(createLoadingApiState())
    try {
      const data = await fetchAnalytics(restaurantId)
      setState(createSuccessApiState(data))
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to fetch analytics'))
    }
  }, [restaurantId])

  useEffect(() => {
    if (restaurantId) fetchData()
  }, [restaurantId, fetchData])

  return { ...state, refetch: fetchData }
}
