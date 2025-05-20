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

export interface Order {
  id: string
  restaurantId: string
  tableId: string
  customerName: string
  customerPhone: string
  items: {
    menuItemId: string
    quantity: number
  }[]
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  total: number
  createdAt: Date
  updatedAt: Date
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