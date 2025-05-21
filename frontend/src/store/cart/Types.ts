import { MenuItem } from '../menu/Types'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  description?: string
  category?: string
  options?: {
    name: string
    value: string
    price: number
  }[]
}

export interface CartState {
  items: CartItem[]
  restaurantId: string | null
  tableId: string | null
  total: number
}

export interface AddToCartData {
  item: MenuItem
  quantity?: number
}

export interface UpdateCartItemData {
  itemId: string
  quantity: number
} 