export interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  image: string | null
  isAvailable: boolean
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface Order {
  id: string
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED'
  customerName: string
  customerPhone: string
  items: {
    menuItem: MenuItem
    quantity: number
  }[]
  total: number
  createdAt: string
}

export interface Restaurant {
  id: string
  name: string
  address: string | null
  phone: string | null
}

export interface Table {
  id: string
  number: number
  restaurantId: string
} 