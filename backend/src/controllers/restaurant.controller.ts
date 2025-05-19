import { Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/db'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Validation schema for restaurant registration
const RestaurantRegistrationSchema = z.object({
  // Restaurant details
  name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  logo: z.string().optional(),
  numberOfTables: z.number().int().min(1, 'Must have at least 1 table'),
  tableCapacity: z.number().int().min(1).default(4),
  
  // Admin details
  adminName: z.string().min(2, 'Admin name must be at least 2 characters'),
  adminEmail: z.string().email('Invalid admin email format'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters')
})

const RestaurantSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  logo: z.string().optional(),
})

const CreateRestaurantSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  logo: z.string().optional(),
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  userId: z.string().min(1)
})

const UpdateRestaurantSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  address: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional()
})

// Menu item validation schemas
const MenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['STARTERS', 'MAIN_COURSE', 'DRINKS', 'DESSERTS', 'SIDES', 'SNACKS', 'BREAKFAST', 'LUNCH', 'DINNER']),
  image: z.string().optional(),
  isAvailable: z.boolean().default(true),
  restaurantId: z.string()
})

const UpdateMenuItemSchema = MenuItemSchema.partial().omit({ restaurantId: true })

export const restaurantController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = RestaurantRegistrationSchema.parse(req.body)
      
      // Check if restaurant email already exists
      const existingRestaurant = await prisma.restaurant.findUnique({
        where: { email: data.email }
      })

      if (existingRestaurant) {
        return res.status(400).json({
          success: false,
          error: 'Restaurant with this email already exists'
        })
      }

      // Check if admin email already exists
      const existingAdmin = await prisma.user.findUnique({
        where: { email: data.adminEmail }
      })

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          error: 'Admin email already registered'
        })
      }

      // Hash admin password
      const hashedPassword = await bcrypt.hash(data.adminPassword, 10)

      // Create restaurant and admin user in a transaction
      const result = await prisma.$transaction(async (tx:any) => {
        // Create restaurant
        const restaurant = await tx.restaurant.create({
          data: {
            name: data.name,
            email: data.email,
            description: data.description,
            address: data.address,
            phone: data.phone,
            logo: data.logo
          }
        })

        // Create admin user
        const admin = await tx.user.create({
          data: {
            name: data.adminName,
            email: data.adminEmail,
            password: hashedPassword,
            role: 'admin',
            restaurantId: restaurant.id
          }
        })

        // Create tables
        const tables = await Promise.all(
          Array.from({ length: data.numberOfTables }, (_, i) => (
            tx.table.create({
              data: {
                number: i + 1,
                capacity: data.tableCapacity,
                qrCode: `${restaurant.id}-table-${i + 1}`, // Simple QR code format
                restaurantId: restaurant.id
              }
            })
          ))
        )

        return { restaurant, admin, tables }
      })

      // Generate JWT for admin
      const token = jwt.sign(
        { userId: result.admin.id, role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      )

      res.status(201).json({
        success: true,
        data: {
          restaurant: {
            id: result.restaurant.id,
            name: result.restaurant.name,
            email: result.restaurant.email,
            description: result.restaurant.description,
            address: result.restaurant.address,
            phone: result.restaurant.phone,
            logo: result.restaurant.logo,
            numberOfTables: result.tables.length
          },
          admin: {
            id: result.admin.id,
            name: result.admin.name,
            email: result.admin.email,
            role: result.admin.role
          },
          token
        }
      })
    } catch (error) {
      next(error)
    }
  },

  getMenu: async (req: Request, res: Response) => {
    try {
      const { restaurantId, tableId } = req.query

      if (!restaurantId || !tableId) {
        return res.status(400).json({
          success: false,
          error: 'Restaurant ID and Table ID are required'
        })
      }

      // Verify table belongs to restaurant
      const table = await prisma.table.findFirst({
        where: {
          id: tableId as string,
          restaurantId: restaurantId as string
        }
      })

      if (!table) {
        return res.status(404).json({
          success: false,
          error: 'Table not found'
        })
      }

      // Get menu items for the restaurant
      const menuItems = await prisma.menuItem.findMany({
        where: {
          restaurantId: restaurantId as string,
          isAvailable: true
        },
        orderBy: {
          category: 'asc'
        }
      })

      res.json({
        success: true,
        data: menuItems
      })
    } catch (error) {
      console.error('Error fetching menu:', error)
      res.status(500).json({ error: 'Failed to fetch menu' })
    }
  },

  createRestaurant: async (req: Request, res: Response) => {
    try {
      const data = CreateRestaurantSchema.parse(req.body)
      const restaurant = await prisma.restaurant.create({
        data: {
          ...data,
          users: {
            connect: { id: data.userId }
          }
        }
      })
      res.status(201).json({ success: true, data: restaurant })
    } catch (error) {
      console.error('Error creating restaurant:', error)
      res.status(500).json({ error: 'Failed to create restaurant' })
    }
  },

  getRestaurant: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const restaurant = await prisma.restaurant.findUnique({
        where: { id },
        include: {
          users: true,
          menuItems: true,
          tables: true
        }
      })
      if (!restaurant) {
        res.status(404).json({ error: 'Restaurant not found' })
        return
      }
      res.json({ success: true, data: restaurant })
    } catch (error) {
      console.error('Error fetching restaurant:', error)
      res.status(500).json({ error: 'Failed to fetch restaurant' })
    }
  },

  updateRestaurant: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data = UpdateRestaurantSchema.parse(req.body)
      const restaurant = await prisma.restaurant.update({
        where: { id },
        data
      })
      res.json({ success: true, data: restaurant })
    } catch (error) {
      console.error('Error updating restaurant:', error)
      res.status(500).json({ error: 'Failed to update restaurant' })
    }
  },

  createMenuItem: async (req: Request, res: Response) => {
    try {
      const data = MenuItemSchema.parse(req.body)
      const menuItem = await prisma.menuItem.create({
        data
      })
      res.status(201).json({ success: true, data: menuItem })
    } catch (error) {
      console.error('Error creating menu item:', error)
      res.status(500).json({ error: 'Failed to create menu item' })
    }
  },

  updateMenuItem: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data = UpdateMenuItemSchema.parse(req.body)
      const menuItem = await prisma.menuItem.update({
        where: { id },
        data
      })
      res.json({ success: true, data: menuItem })
    } catch (error) {
      console.error('Error updating menu item:', error)
      res.status(500).json({ error: 'Failed to update menu item' })
    }
  },

  deleteMenuItem: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      await prisma.menuItem.delete({
        where: { id }
      })
      res.json({ success: true, message: 'Menu item deleted successfully' })
    } catch (error) {
      console.error('Error deleting menu item:', error)
      res.status(500).json({ error: 'Failed to delete menu item' })
    }
  }
}
