import { Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/db'
import { z } from 'zod'
import Pusher from 'pusher'

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true
})

// Validation schemas
const OrderInputSchema = z.object({
  tableId: z.string(),
  restaurantId: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  specialRequests: z.string().optional(),
  items: z.array(z.object({
    menuItemId: z.string(),
    quantity: z.number().int().positive(),
    notes: z.string().optional()
  }))
})

const UpdateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'preparing', 'served', 'cancelled'])
})

export const orderController = {
  // Create new order
  createOrder: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderData = OrderInputSchema.parse(req.body)

      const menuItems = await prisma.menuItem.findMany({
        where: {
          id: { in: orderData.items.map(item => item.menuItemId) }
        }
      })

      const totalAmount = orderData.items.reduce((total, item) => {
        const menuItem = menuItems.find(mi => mi.id === item.menuItemId)
        return total + (menuItem?.price || 0) * item.quantity
      }, 0)

      const order = await prisma.order.create({
        data: {
          tableId: orderData.tableId,
          restaurantId: orderData.restaurantId,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          specialRequests: orderData.specialRequests,
          totalAmount,
          orderNumber: `ORD${Date.now()}`,
          items: {
            create: orderData.items.map(item => ({
              quantity: item.quantity,
              notes: item.notes,
              menuItemId: item.menuItemId,
              price: menuItems.find(mi => mi.id === item.menuItemId)?.price || 0
            }))
          }
        },
        include: {
          items: {
            include: {
              menuItem: true
            }
          },
          table: true
        }
      })

      await pusher.trigger(`restaurant-${orderData.restaurantId}`, 'new-order', {
        order,
        message: `New order #${order.orderNumber} received from Table ${order.table.number}`
      })

      res.status(201).json({ success: true, data: order })
    } catch (error) {
      console.log("🚀 ~ createOrder: ~ error:", error)
      next(error)
    }
  },

  // Get all orders for a restaurant
  getRestaurantOrders: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { restaurantId } = req.params
      const orders = await prisma.order.findMany({
        where: { restaurantId },
        include: {
          items: {
            include: {
              menuItem: true
            }
          },
          table: true
        },
        orderBy: { createdAt: 'desc' }
      })
      res.json({ success: true, data: orders })
    } catch (error) {
      next(error)
    }
  },

  // Get single order
  getOrder: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              menuItem: true
            }
          },
          table: true
        }
      })
      if (!order) {
        res.status(404).json({ success: false, error: 'Order not found' })
        return
      }
      res.json({ success: true, data: order })
    } catch (error) {
      next(error)
    }
  },

  // Update order status
  updateOrderStatus: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const { status } = UpdateOrderStatusSchema.parse(req.body)

      const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: {
            include: {
              menuItem: true
            }
          },
          table: true
        }
      })

      await pusher.trigger(`restaurant-${order.restaurantId}`, 'order-updated', {
        order,
        message: `Order #${order.orderNumber} status updated to ${status}`
      })

      res.json({ success: true, data: order })
    } catch (error) {
      next(error)
    }
  }
}