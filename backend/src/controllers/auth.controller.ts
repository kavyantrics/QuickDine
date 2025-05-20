import { Request, Response, NextFunction, RequestHandler } from 'express'
import { prisma } from '../utils/db'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserRole } from '@prisma/client'

// Validation schemas
const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  role: z.nativeEnum(UserRole).optional().default(UserRole.STAFF),
  restaurantId: z.string().optional() // Required for staff, optional for admin
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const authController = {
  // User signup
  signup: (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = SignupSchema.parse(req.body)

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists'
        })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role,
          restaurantId: userData.restaurantId
        }
      })

      // Generate JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          role: user.role,
          restaurantId: user.restaurantId 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      )

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            restaurantId: user.restaurantId
          },
          token
        }
      })
    } catch (error) {
      next(error)
    }
  }) as RequestHandler,

  // User login
  login: (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = LoginSchema.parse(req.body)

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          ownedRestaurants: {
            include: {
              restaurant: true
            }
          }
        }
      })

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        })
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        })
      }

      // Generate JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          role: user.role,
          restaurantId: user.restaurantId 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      )

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            restaurantId: user.restaurantId,
            ownedRestaurants: user.ownedRestaurants.map(ro => ({
              id: ro.restaurant.id,
              name: ro.restaurant.name,
              role: ro.role
            }))
          },
          token
        }
      })
    } catch (error) {
      next(error)
    }
  }) as RequestHandler,

  // PATCH /api/users/:id
  updateUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { name, email, role } = req.body

      // Validate role if provided
      if (role && !Object.values(UserRole).includes(role)) {
        return res.status(400).json({ error: 'Invalid role' })
      }

      const user = await prisma.user.update({
        where: { id },
        data: { 
          name, 
          email,
          role: role as UserRole
        }
      })

      res.json({ success: true, data: user })
    } catch (error) {
      console.error('Error updating user:', error)
      res.status(500).json({ error: 'Failed to update user' })
    }
  }
}