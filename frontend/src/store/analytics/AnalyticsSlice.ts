import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AnalyticsData } from '@/types'
import { ApiState } from '@/store/types'

interface AnalyticsState extends ApiState<AnalyticsData> {
  filters: {
    startDate?: string
    endDate?: string
    category?: string
  }
}

const initialState: AnalyticsState = {
  data: null,
  error: null,
  isLoading: false,
  filters: {},
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalytics: (state, action: PayloadAction<AnalyticsData>) => {
      state.data = action.payload
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    setFilters: (state, action: PayloadAction<AnalyticsState['filters']>) => {
      state.filters = action.payload
    },
  },
})

export const { setAnalytics, setLoading, setError, setFilters } = analyticsSlice.actions
export default analyticsSlice.reducer