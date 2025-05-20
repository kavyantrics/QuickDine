// Shared backend types for request/response

export interface Restaurant {
  id: string;
  name: string;
  email: string;
  description?: string;
  address?: string;
  phone?: string;
  logo?: string;
  numberOfTables?: number;
  tableCapacity?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  restaurantId?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  restaurantId: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  tableId: string;
  restaurantId: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  specialRequests?: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod?: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    notes?: string;
    price: number;
    menuItem: MenuItem;
  }>;
  table?: {
    id: string;
    number: number;
    capacity: number;
  };
} 
export interface PasswordResetToken {
  token: string
  expires: Date
}