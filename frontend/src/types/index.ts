import { MenuCategory } from '@/lib/constants'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: MenuCategory
  image?: string
  isAvailable: boolean
  stock: number
  restaurantId: string
  createdAt: string
  updatedAt: string
} 

export interface CartItem extends MenuItem {
  quantity: number
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  WALLET = 'WALLET'
}

export interface Order {
  id: string
  restaurantId: string
  tableId: string
  items: OrderItem[]
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  total: number
  createdAt: string
  updatedAt: string
}

export interface Restaurant {
  id: string
  name: string
  email: string
  address?: string
  phone?: string
  description?: string
  logo?: string
  createdAt: Date
  updatedAt: Date
} 

export interface Table {
  id: string
  restaurantId: string
  number: string
  capacity: number
  status: 'available' | 'occupied' | 'reserved'
  createdAt: string
  updatedAt: string
} 

export interface UpdateOrderStatusInput {
  orderId: string
  status: OrderStatus
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  restaurantId?: string
  ownedRestaurants?: Array<{
    id: string
    name: string
    role: string
  }>
} 

export interface LoginResponse {
  success: boolean
  data: {
    user: {
      id: string
      email: string
      name: string
      role: string
      restaurantId: string
      ownedRestaurants?: Array<{
        id: string
        name: string
        role: string
      }>
    }
    accessToken: string
    refreshToken: string
  }
}

export interface SignupRestaurantData {
  name: string
  email: string
  password: string
  address?: string
  phone?: string
}

export interface OrderData {
  restaurantId: string
  tableId: string
  customerName: string
  customerPhone: string
  items: {
    menuItemId: string
    quantity: number
  }[]
}

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


export interface ApiState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
}

export interface AnalyticsFilters {
  startDate?: string
  endDate?: string
  category?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
} 