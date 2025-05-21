import { Request, Response } from 'express'
import { PrismaClient, MenuCategory, Order, OrderItem, MenuItem } from '@prisma/client'
import { startOfDay, endOfDay, subDays, parseISO } from 'date-fns'

const prisma = new PrismaClient()

type OrderWithItems = Order & {
  items: (OrderItem & {
    menuItem: MenuItem
  })[]
}

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params
    const { startDate, endDate, category } = req.query

    // Get date range
    const end = endDate ? parseISO(endDate as string) : new Date()
    const start = startDate ? parseISO(startDate as string) : subDays(end, 7)

    // Get orders within date range
    const orders = await prisma.order.findMany({
      where: {
        restaurantId,
        createdAt: {
          gte: startOfDay(start),
          lte: endOfDay(end),
        },
        ...(category ? {
          items: {
            some: {
              menuItem: {
                category: category as MenuCategory
              }
            }
          }
        } : {})
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    }) as OrderWithItems[]

    // Calculate revenue per day
    const revenuePerDay = orders.reduce((acc: { date: string; revenue: number }[], order) => {
      const date = order.createdAt.toISOString().split('T')[0]
      const existingDay = acc.find(day => day.date === date)
      
      if (existingDay) {
        existingDay.revenue += order.totalAmount
      } else {
        acc.push({
          date,
          revenue: order.totalAmount
        })
      }
      
      return acc
    }, [])

    // Calculate top selling items
    const itemCounts = orders.reduce((acc: Record<string, {
      id: string;
      name: string;
      price: number;
      category: MenuCategory;
      totalQuantity: number;
    }>, order) => {
      order.items.forEach(item => {
        const key = item.menuItem.id
        if (!acc[key]) {
          acc[key] = {
            id: item.menuItem.id,
            name: item.menuItem.name,
            price: item.menuItem.price,
            category: item.menuItem.category,
            totalQuantity: 0
          }
        }
        acc[key].totalQuantity += item.quantity
      })
      return acc
    }, {})

    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10)

    // Calculate total orders this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const totalOrdersThisMonth = await prisma.order.count({
      where: {
        restaurantId,
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    res.json({
      success: true,
      data: {
        totalOrdersThisMonth,
        revenuePerDay,
        topItems
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics data'
    })
  }
}