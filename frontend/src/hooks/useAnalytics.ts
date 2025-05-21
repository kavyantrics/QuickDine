import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchAnalyticsData, fetchAnalyticsByDateRange, fetchAnalyticsByCategory } from '@/store/analytics/AnalyticsThunks'
import { useCallback } from 'react'

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
  const dispatch = useAppDispatch()
  const { data: analytics, isLoading, error } = useAppSelector((state) => state.analytics)

  const fetchData = useCallback(async () => {
    await dispatch(fetchAnalyticsData(restaurantId)).unwrap()
  }, [dispatch, restaurantId])

  const fetchByDateRange = useCallback(async (startDate: string, endDate: string) => {
    await dispatch(fetchAnalyticsByDateRange({ restaurantId, startDate, endDate })).unwrap()
  }, [dispatch, restaurantId])

  const fetchByCategory = useCallback(async (category: string) => {
    await dispatch(fetchAnalyticsByCategory({ restaurantId, category })).unwrap()
  }, [dispatch, restaurantId])

  return {
    analytics,
    isLoading,
    error,
    fetchData,
    fetchByDateRange,
    fetchByCategory,
  }
}
