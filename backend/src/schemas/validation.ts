import { z } from 'zod'
import { UserRole, OrderStatus, PaymentStatus, TableStatus, MenuCategory } from '@prisma/client'

// Base schemas
export const UserRoleSchema = z.nativeEnum(UserRole)
export const OrderStatusSchema = z.nativeEnum(OrderStatus)
export const PaymentStatusSchema = z.nativeEnum(PaymentStatus)
export const TableStatusSchema = z.nativeEnum(TableStatus)
export const MenuCategorySchema = z.nativeEnum(MenuCategory)

// Restaurant schemas
export const RestaurantSchema = z.object({
  name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  logo: z.string().optional()
})

export const CreateRestaurantSchema = RestaurantSchema.extend({
  numberOfTables: z.number().int().min(1, 'Must have at least 1 table'),
  tableCapacity: z.number().int().min(1).default(4)
})

export const UpdateRestaurantSchema = RestaurantSchema.partial()

export const RestaurantRegistrationSchema = RestaurantSchema.extend({
  numberOfTables: z.number().int().min(1, 'Must have at least 1 table'),
  tableCapacity: z.number().int().min(1).default(4),
  adminName: z.string().min(2, 'Admin name must be at least 2 characters'),
  adminEmail: z.string().email('Invalid admin email format'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters')
})

// User schemas
export const UserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  role: UserRoleSchema,
  restaurantId: z.string().optional()
})

export const CreateUserSchema = UserSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export const UpdateUserSchema = UserSchema.partial()

// Order schemas
export const OrderSchema = z.object({
  orderNumber: z.string(),
  status: OrderStatusSchema,
  tableId: z.string(),
  restaurantId: z.string(),
  userId: z.string().optional(),
  customerName: z.string(),
  customerPhone: z.string(),
  specialRequests: z.string().optional(),
  totalAmount: z.number().positive(),
  paymentStatus: PaymentStatusSchema,
  paymentMethod: z.string().optional()
})

export const CreateOrderSchema = OrderSchema.omit({ orderNumber: true })
export const UpdateOrderSchema = OrderSchema.partial()

// Table schemas
export const TableSchema = z.object({
  number: z.number().int().positive(),
  capacity: z.number().int().min(1).default(4),
  status: TableStatusSchema,
  qrCode: z.string(),
  restaurantId: z.string()
})

export const CreateTableSchema = TableSchema.omit({ qrCode: true })
export const UpdateTableSchema = TableSchema.partial()

// Menu Item schemas
export const MenuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive(),
  category: MenuCategorySchema,
  image: z.string().optional(),
  isAvailable: z.boolean().default(true),
  restaurantId: z.string()
})

export const CreateMenuItemSchema = MenuItemSchema
export const UpdateMenuItemSchema = MenuItemSchema.partial()

// Restaurant Owner schemas
export const RestaurantOwnerSchema = z.object({
  userId: z.string(),
  restaurantId: z.string(),
  role: UserRoleSchema,
  isActive: z.boolean().default(true)
})

export const CreateRestaurantOwnerSchema = RestaurantOwnerSchema
export const UpdateRestaurantOwnerSchema = RestaurantOwnerSchema.partial() 

// Validation schemas
export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  role: z.nativeEnum(UserRole).optional().default(UserRole.STAFF),
  restaurantId: z.string().optional() // Required for staff, optional for admin
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})