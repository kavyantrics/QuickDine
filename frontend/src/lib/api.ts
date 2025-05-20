import { MenuItem, Order, Restaurant } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface LoginResponse {
  success: boolean
  data: {
    user: {
      id: string
      email: string
      name: string
      role: string
      restaurantId: string
    }
    token: string
  }
}

interface SignupRestaurantData {
  name: string
  email: string
  password: string
  address?: string
  phone?: string
}

interface OrderData {
  restaurantId: string
  tableId: string
  customerName: string
  customerPhone: string
  items: {
    menuItemId: string
    quantity: number
  }[]
}

interface AnalyticsData {
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

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || 'Failed to fetch data')
  }
  return response.json()
}

// Get menu items for a restaurant and table
export async function getMenu(restaurantId: string, tableId: string): Promise<MenuItem[]> {
  const response = await fetch(
    `${API_URL}/api/restaurants/menu?restaurantId=${restaurantId}&tableId=${tableId}`
  )
  const result = await handleResponse<ApiResponse<MenuItem[]>>(response)
  return result.data
}

// Submit a new order
export async function submitOrder(data: OrderData): Promise<Order> {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleResponse<Order>(response)
}

// Login restaurant
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse<LoginResponse>(response)
}

// Signup new restaurant
export async function signupRestaurant(data: SignupRestaurantData): Promise<Restaurant> {
  const response = await fetch(`${API_URL}/api/restaurants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return handleResponse<Restaurant>(response)
}

// Get orders for a restaurant
export async function getOrders(restaurantId: string): Promise<Order[]> {
  const response = await fetch(`${API_URL}/api/orders/restaurant/${restaurantId}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const result = await handleResponse<{ success: boolean; data: Order[] }>(response)
  return result.data
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<Order> {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
  return handleResponse<Order>(response)
}

// Get restaurant details
export async function getRestaurant(userId: string, restaurantId: string): Promise<Restaurant> {
  const response = await fetch(`${API_URL}/api/restaurants/user/${userId}/restaurant/${restaurantId}`);
  if (!response.ok) throw new Error('Failed to fetch restaurant');
  const result = await response.json();
  return result.data;
}

// Update restaurant details
export async function updateRestaurant(
  userId: string,
  restaurantId: string,
  data: Partial<{
    name: string
    address: string
    phone: string
    description: string
    logo: string
    email: string
  }>
) {
  const response = await fetch(
    `${API_URL}/api/restaurants/user/${userId}/restaurant/${restaurantId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  )
  if (!response.ok) throw new Error('Failed to update restaurant')
  const result = await response.json()
  return result.data
}

// Add menu item
export async function addMenuItem(
  restaurantId: string,
  data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MenuItem> {
  const response = await fetch(`${API_URL}/api/restaurants/${restaurantId}/menu`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const result = await handleResponse<ApiResponse<MenuItem>>(response)
  return result.data
}

// Update menu item
export async function updateMenuItem(
  restaurantId: string,
  menuItemId: string,
  data: Partial<Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<MenuItem> {
  const response = await fetch(
    `${API_URL}/api/restaurants/${restaurantId}/menu/${menuItemId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )
  const result = await handleResponse<ApiResponse<MenuItem>>(response)
  return result.data
}

// Delete menu item
export async function deleteMenuItem(
  restaurantId: string,
  menuItemId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/restaurants/${restaurantId}/menu/${menuItemId}`,
    {
      method: 'DELETE',
    }
  )
  if (!response.ok) {
    throw new Error('Failed to delete menu item')
  }
}

export async function fetchAnalytics(restaurantId: string): Promise<AnalyticsData> {
  const response = await fetch(`${API_URL}/api/analytics/${restaurantId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch analytics')
  }

  return response.json()
}

export async function getAdminMenu(restaurantId: string): Promise<MenuItem[]> {
  const response = await fetch(
    `${API_URL}/api/restaurants/admin-menu/${restaurantId}`
  );
  const result = await handleResponse<{ success: boolean; data: MenuItem[] }>(response);
  return result.data;
}

export async function updateUser(
  userId: string,
  data: { name?: string; email?: string }
) {
  const response = await fetch(
    `${API_URL}/api/auth/users/${userId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  )
  if (!response.ok) throw new Error('Failed to update user')
  const result = await response.json()
  return result.data
}

// Create restaurant
export async function createRestaurant(userId: string, data: any) {
  const response = await fetch(`${API_URL}/api/restaurants/user/${userId}/restaurant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create restaurant')
  const result = await response.json()
  return result.data
}

// Register restaurant (if needed)
export async function registerRestaurant(userId: string, data: any) {
  const response = await fetch(`${API_URL}/api/restaurants/user/${userId}/restaurant/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to register restaurant')
  const result = await response.json()
  return result.data
} 