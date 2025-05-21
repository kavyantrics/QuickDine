export interface Restaurant {
  id: string
  name: string
  description?: string
  address: string
  phone: string
  email: string
  image?: string
  openingHours?: {
    [key: string]: {
      open: string
      close: string
    }
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
  ownerId: string
} 