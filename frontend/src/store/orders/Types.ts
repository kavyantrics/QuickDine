export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  options?: {
    name: string
    value: string
    price: number
  }[]
}

export interface Order {
  id: string
  restaurantId: string
  tableId: string
  items: OrderItem[]
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  total: number
  createdAt: string
  updatedAt: string
  customerName?: string
  customerPhone?: string
  notes?: string
}

export interface OrdersState {
  items: Order[]
  isLoading: boolean
  error: string | null
  selectedOrder: Order | null
}

export interface CreateOrderData {
  restaurantId: string
  tableId: string
  customerName: string
  customerPhone: string
  items: {
    menuItemId: string
    quantity: number
  }[]
}

export interface UpdateOrderStatusData {
  orderId: string
  status: OrderStatus
} 