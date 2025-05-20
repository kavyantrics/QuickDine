import { Request, Response, NextFunction, RequestHandler } from 'express'
import { prisma } from '../utils/db'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserRole } from '@prisma/client'
import { hashPassword, verifyPassword, isStrongPassword } from '../middleware/auth'
import { AppError } from '../utils/errors'

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

const REFRESH_TOKEN_EXPIRY = '7d'
const ACCESS_TOKEN_EXPIRY = '15m'

function generateAccessToken(user: any) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      restaurantId: user.restaurantId
    },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  )
}

function generateRefreshToken(user: any) {
  return jwt.sign(
    {
      userId: user.id,
      tokenType: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  )
}

export const authController = {
  // User signup
  signup: (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = SignupSchema.parse(req.body)

      if (!isStrongPassword(userData.password)) {
        return next(new AppError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.', 400))
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (existingUser) {
        return next(new AppError('User already exists', 400))
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password)

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

      // Generate tokens
      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)
      // Store refresh token in DB (session)
      await prisma.session.create({
        data: {
          userId: user.id,
          sessionToken: refreshToken,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      })

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
          accessToken,
          refreshToken
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
        return next(new AppError('Invalid credentials', 401))
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password)

      if (!isValidPassword) {
        return next(new AppError('Invalid credentials', 401))
      }

      // Generate tokens
      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)
      // Store refresh token in DB (session)
      await prisma.session.create({
        data: {
          userId: user.id,
          sessionToken: refreshToken,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      })

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
          accessToken,
          refreshToken
        }
      })
    } catch (error) {
      next(error)
    }
  }) as RequestHandler,

  // Refresh token endpoint
  refresh: async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return next(new AppError('Refresh token required', 400))
    }
    try {
      // Verify refresh token
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any
      // Check if session exists and is valid
      const session = await prisma.session.findUnique({
        where: { sessionToken: refreshToken }
      })
      if (!session || !session.isValid) {
        return next(new AppError('Invalid refresh token', 401))
      }
      // Get user
      const user = await prisma.user.findUnique({ where: { id: payload.userId } })
      if (!user) {
        return next(new AppError('User not found', 401))
      }
      // Generate new access token
      const accessToken = generateAccessToken(user)
      res.json({ success: true, data: { accessToken } })
    } catch (error) {
      next(new AppError('Invalid or expired refresh token', 401))
    }
  },

  // PATCH /api/users/:id
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { name, email, role } = req.body

      // Validate role if provided
      if (role && !Object.values(UserRole).includes(role)) {
        return next(new AppError('Invalid role', 400))
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
      next(new AppError('Failed to update user', 500))
    }
  }
}