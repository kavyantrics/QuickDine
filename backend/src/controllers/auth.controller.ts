import { Request, Response, NextFunction, RequestHandler } from 'express'
import { prisma } from '../utils/db'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { UserRole } from '@prisma/client'
import { hashPassword, verifyPassword, isStrongPassword } from '../middleware/auth'
import { AppError } from '../utils/errors'
import { validatePasswordComplexity, checkLoginAttempts, incrementLoginAttempts, resetLoginAttempts } from '../utils/password'
import { SignupSchema, LoginSchema } from '../schemas/validation'
import { REFRESH_TOKEN_EXPIRY, ACCESS_TOKEN_EXPIRY, PASSWORD_RESET_EXPIRY } from '../lib/constants'

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

// Add these new endpoints to authController
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

      // Check if account is locked
      const canLogin = await checkLoginAttempts(user.id)
      if (!canLogin) {
        return next(new AppError('Account is locked. Please try again later.', 423))
      }

      const isValidPassword = await verifyPassword(password, user.password)
      if (!isValidPassword) {
        await incrementLoginAttempts(user.id)
        return next(new AppError('Invalid credentials', 401))
      }

      // Reset login attempts on successful login
      await resetLoginAttempts(user.id)

      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)

      // Store refresh token
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
  },

  updatePassword: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = z.object({
      email: z.string().email(),
      password: z.string()
    }).parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return next(new AppError('Reset token not found. Please request again.', 400));
    }

    const passwordValidation = validatePasswordComplexity(password);
    if (!passwordValidation.isValid) {
      return next(new AppError(passwordValidation.message, 400));
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    res.json({
      success: true,
      message: 'Password has been updated successfully'
    });
  } catch (error) {
    next(error);
  }
},

  verifyResetPasswordToken: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, token } = z.object({
      email: z.string().email(),
      token: z.string()
    }).parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return next(new AppError('Invalid or expired reset token', 400));
    }

    if (new Date() > user.resetTokenExpiry) {
      return next(new AppError('Reset token has expired', 400));
    }

    const isValidToken = await verifyPassword(token, user.resetToken);
    if (!isValidToken) {
      return next(new AppError('Invalid reset token', 400));
    }

    res.json({
      success: true,
      message: 'Reset token is valid'
    });
  } catch (error) {
    next(error);
  }
}
}