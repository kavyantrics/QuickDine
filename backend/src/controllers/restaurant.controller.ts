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
  }) as RequestHandler
}