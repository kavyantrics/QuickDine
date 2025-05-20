import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { AppError } from '../utils/errors'

const prisma = new PrismaClient()

// Define the user type
interface User {
  id: string
  email: string
  role: string
  restaurantId: string
}


export const getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { restaurantId } = req.params

    if (!restaurantId) {
      return next(new AppError('Restaurant ID is required', 400))
    }

    // Get current date and start of month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastWeek = new Date(now)
    startOfLastWeek.setDate(now.getDate() - 7)

    // Get total orders this month
    const totalOrdersThisMonth = await prisma.order.count({
      where: {
        restaurantId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    })

    // Get revenue per day for last 7 days
    const revenuePerDay = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        restaurantId,
        createdAt: {
          gte: startOfLastWeek,
        },
      },
      _sum: {
        totalAmount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Get most frequently ordered items
    const topItems = await prisma.orderItem.groupBy({
      by: ['menuItemId'],
      where: {
        order: {
          restaurantId,
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    })

    // Get menu item details for top items
    const topItemsWithDetails = await Promise.all(
      topItems.map(async (item) => {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
          select: {
            id: true,
            name: true,
            price: true,
            category: true,
          },
        })
        return {
          ...menuItem,
          totalQuantity: item._sum.quantity,
        }
      })
    )

    // Format revenue per day data
    const formattedRevenuePerDay = revenuePerDay.map((day) => ({
      date: day.createdAt.toISOString().split('T')[0],
      revenue: day._sum.totalAmount || 0,
    }))

    res.json({
      success: true,
      data: {
        totalOrdersThisMonth,
        revenuePerDay: formattedRevenuePerDay,
        topItems: topItemsWithDetails,
      }
    })
  } catch (error) {
    next(error instanceof Error ? error : new AppError('Failed to fetch analytics', 500))
  }
}