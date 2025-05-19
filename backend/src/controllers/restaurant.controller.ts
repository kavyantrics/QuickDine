import { Request, Response, NextFunction, RequestHandler } from 'express'
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

export const restaurantController = {
  register: (async (req: Request, res: Response, next: NextFunction) => {
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
      const result = await prisma.$transaction(async (tx) => {
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
  }) as RequestHandler,

  getMenu: (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { restaurantId, tableId } = req.query

      if (!restaurantId || !tableId) {
        return res.status(400).json({
          success: false,
          error: 'Restaurant ID and Table ID are required'
        })
      }

      // For development/testing, if using test IDs, return sample menu items
      if (restaurantId === 'admin' && tableId === 'menu') {
        return res.json({
          success: true,
          data: [
            {
              id: '1',
              name: 'Margherita Pizza',
              description: 'Classic tomato sauce, mozzarella, and basil',
              price: 12.99,
              category: 'Pizza',
              image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
              isAvailable: true,
              restaurantId: 'admin',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: '2',
              name: 'Caesar Salad',
              description: 'Romaine lettuce, croutons, parmesan, and Caesar dressing',
              price: 8.99,
              category: 'Salads',
              image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
              isAvailable: true,
              restaurantId: 'admin',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: '3',
              name: 'Chocolate Cake',
              description: 'Rich chocolate cake with ganache frosting',
              price: 6.99,
              category: 'Desserts',
              image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
              isAvailable: true,
              restaurantId: 'admin',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
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
      next(error)
    }
  }) as RequestHandler
}