import { MenuCategory } from '@/lib/constants'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: MenuCategory
  image: string
  isAvailable: boolean
  restaurantId: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface OrderItem {
  menuItemId: string
  quantity: number
  notes?: string
  price?: number
  menuItem?: MenuItem
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'

export interface Order {
  id: string
  restaurantId: string
  tableId: string
  customerName: string
  customerPhone: string
  items: OrderItem[]
  status: OrderStatus
  total: number
  createdAt: Date
  updatedAt: Date
  orderNumber?: string
  table?: {
    id: string
    number: number
    capacity: number
  }
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
  number: number
  restaurantId: string
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