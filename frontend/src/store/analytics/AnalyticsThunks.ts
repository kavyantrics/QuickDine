import { createAsyncThunk } from '@reduxjs/toolkit'
import { setAnalytics, setLoading, setError } from './AnalyticsSlice'
import { AnalyticsData } from '@/types'
import { api } from '@/lib/api'
import { ApiResponse } from '../types'

export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchData',
  async (restaurantId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await api.get<ApiResponse<AnalyticsData>>(`/analytics/${restaurantId}`)
      dispatch(setAnalytics(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

export const fetchAnalyticsByDateRange = createAsyncThunk(
  'analytics/fetchByDateRange',
  async (
    { restaurantId, startDate, endDate }: { restaurantId: string; startDate: string; endDate: string },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true))
      const response = await api.get<ApiResponse<AnalyticsData>>(
        `/analytics/${restaurantId}?startDate=${startDate}&endDate=${endDate}`
      )
      dispatch(setAnalytics(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

export const fetchAnalyticsByCategory = createAsyncThunk(
  'analytics/fetchByCategory',
  async (
    { restaurantId, category }: { restaurantId: string; category: string },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true))
      const response = await api.get<ApiResponse<AnalyticsData>>(
        `/analytics/${restaurantId}?category=${category}`
      )
      dispatch(setAnalytics(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
) 