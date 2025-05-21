import { MenuCategory } from '@/lib/constants'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category: string
  isAvailable: boolean
  options?: {
    name: string
    values: {
      value: string
      price: number
    }[]
  }[]
}

export interface MenuState {
  items: MenuItem[]
  isLoading: boolean
  error: string | null
  selectedCategory: MenuCategory | null
}

export interface AddMenuItemData {
  name: string
  description: string
  price: number
  category: MenuCategory
  image?: string
  isAvailable: boolean
  stock: number
}

export interface UpdateMenuItemData extends Partial<AddMenuItemData> {
  id: string
} 