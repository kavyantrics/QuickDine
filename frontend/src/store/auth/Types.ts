export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER'
  restaurantId?: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isRefreshing: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
  restaurantName?: string
  address?: string
  phone?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface SignupRestaurantData {
  name: string
  email: string
  password: string
  restaurant: {
    name: string
    address: string
    phone: string
  }
} 

