import axios from 'axios'
import type { InternalAxiosRequestConfig as AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { MenuItem, Order, Restaurant, LoginResponse, SignupRestaurantData, OrderData, AnalyticsData } from '@/types/index'
import { ApiResponse } from '@/store/types'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/V1'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('No refresh token')

        const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken })
        const result = await handleResponse<ApiResponse<{ accessToken: string }>>(response)
        const { accessToken } = result.data

        localStorage.setItem('accessToken', accessToken)
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        // Retry the original request with the new token
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, clear auth and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        delete api.defaults.headers.common['Authorization']
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Generic API state type
export interface ApiState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
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

async function handleResponse<T>(response: AxiosResponse): Promise<T> {
  if (!response.data.success) {
    throw new Error(response.data.message || 'Request failed')
  }
  return response.data
}

// Get menu items for a restaurant and table
export async function getMenu(restaurantId: string, tableId: string): Promise<MenuItem[]> {
  const response = await api.get<ApiResponse<MenuItem[]>>(`/restaurants/menu?restaurantId=${restaurantId}&tableId=${tableId}`)
  const result = await handleResponse<ApiResponse<MenuItem[]>>(response)
  return result.data
}

// Submit a new order
export async function submitOrder(data: OrderData): Promise<Order> {
  const response = await api.post<ApiResponse<Order>>('/orders', data)
  const result = await handleResponse<ApiResponse<Order>>(response)
  return result.data
}

// Login restaurant
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password })
  const result = await handleResponse<ApiResponse<LoginResponse>>(response)
  return result.data
}

// Signup new restaurant
export async function signupRestaurant(data: SignupRestaurantData): Promise<Restaurant> {
  const response = await api.post<ApiResponse<Restaurant>>('/restaurants', data)
  const result = await handleResponse<ApiResponse<Restaurant>>(response)
  return result.data
}

// Get orders for a restaurant
export async function getOrders(restaurantId: string): Promise<Order[]> {
  const response = await api.get<ApiResponse<Order[]>>(`/orders/restaurant/${restaurantId}`)
  const result = await handleResponse<ApiResponse<Order[]>>(response)
  return result.data
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<Order> {
  const response = await api.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status })
  const result = await handleResponse<ApiResponse<Order>>(response)
  return result.data
}

// Get restaurant details
export async function getRestaurant(userId: string, restaurantId: string): Promise<Restaurant> {
  const response = await api.get<ApiResponse<Restaurant>>(`/restaurants/user/${userId}/restaurant/${restaurantId}`)
  const result = await handleResponse<ApiResponse<Restaurant>>(response)
  return result.data
}

// Update restaurant details
export async function updateRestaurant(
  userId: string,
  restaurantId: string,
  data: Partial<Restaurant>
): Promise<Restaurant> {
  const response = await api.patch<ApiResponse<Restaurant>>(`/restaurants/user/${userId}/restaurant/${restaurantId}`, data)
  const result = await handleResponse<ApiResponse<Restaurant>>(response)
  return result.data
}

// Create menu item
export async function createMenuItem(
  restaurantId: string,
  data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MenuItem> {
  const response = await api.post<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu`, data)
  const result = await handleResponse<ApiResponse<MenuItem>>(response)
  return result.data
}

// Update menu item
export async function updateMenuItem(
  restaurantId: string,
  menuItemId: string,
  data: Partial<Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<MenuItem> {
  const response = await api.patch<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu/${menuItemId}`, data)
  const result = await handleResponse<ApiResponse<MenuItem>>(response)
  return result.data
}

// Delete menu item
export async function deleteMenuItem(
  restaurantId: string,
  menuItemId: string
): Promise<void> {
  const response = await api.delete<ApiResponse<void>>(`/restaurants/${restaurantId}/menu/${menuItemId}`)
  await handleResponse<ApiResponse<void>>(response)
}

interface AnalyticsFilters {
  startDate?: string
  endDate?: string
  category?: string
}

export async function fetchAnalytics(restaurantId: string, filters?: AnalyticsFilters): Promise<AnalyticsData> {
  const queryParams = new URLSearchParams()
  if (filters?.startDate) queryParams.append('startDate', filters.startDate)
  if (filters?.endDate) queryParams.append('endDate', filters.endDate)
  if (filters?.category) queryParams.append('category', filters.category)

  const response = await api.get<ApiResponse<AnalyticsData>>(`/analytics/${restaurantId}?${queryParams.toString()}`)
  const result = await handleResponse<ApiResponse<AnalyticsData>>(response)
  return result.data
}

export async function getAdminMenu(restaurantId: string): Promise<MenuItem[]> {
  const response = await api.get<ApiResponse<MenuItem[]>>(`/restaurants/admin-menu/${restaurantId}`)
  const result = await handleResponse<ApiResponse<MenuItem[]>>(response)
  return result.data
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  data: { name?: string; email?: string }
): Promise<void> {
  const response = await api.patch<ApiResponse<void>>(`/auth/users/${userId}`, data)
  await handleResponse<ApiResponse<void>>(response)
}

// Create restaurant
export async function createRestaurant(
  userId: string,
  data: { name: string; address: string; phone: string }
): Promise<Restaurant> {
  const response = await api.post<ApiResponse<Restaurant>>(`/restaurants/user/${userId}/restaurant`, data)
  const result = await handleResponse<ApiResponse<Restaurant>>(response)
  return result.data
}

// Register restaurant
export async function registerRestaurant(
  userId: string,
  data: { name: string; address: string; phone: string }
): Promise<Restaurant> {
  const response = await api.post<ApiResponse<Restaurant>>(`/restaurants/user/${userId}/restaurant/register`, data)
  const result = await handleResponse<ApiResponse<Restaurant>>(response)
  return result.data
}

// Refresh token
export async function refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
  const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken })
  const result = await handleResponse<ApiResponse<{ accessToken: string }>>(response)
  return result.data
}

// Add menu item to cart
export async function addMenuItem(restaurantId: string, item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> {
  const response = await api.post<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu`, item)
  const result = await handleResponse<ApiResponse<MenuItem>>(response)
  return result.data
} 