export interface ApiState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface AnalyticsFilters {
  startDate?: string
  endDate?: string
  category?: string
}

// Helper to create initial state
export function createInitialApiState<T>(): ApiState<T> {
  return { data: null, error: null, isLoading: false }
}

// Helper to create loading state
export function createLoadingApiState<T>(): ApiState<T> {
  return { data: null, error: null, isLoading: true }
}

// Helper to create error state
export function createErrorApiState<T>(error: string): ApiState<T> {
  return { data: null, error, isLoading: false }
}

// Helper to create success state
export function createSuccessApiState<T>(data: T): ApiState<T> {
  return { data, error: null, isLoading: false }
} 