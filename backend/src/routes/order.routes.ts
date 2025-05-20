import { Router, RequestHandler } from 'express'
import { orderController } from '../controllers/order.controller'

const router = Router()

// Create new order
router.post('/', orderController.createOrder as RequestHandler)

// Get all orders for a restaurant
router.get('/restaurant/:restaurantId', orderController.getRestaurantOrders as RequestHandler)

// Get single order
router.get('/:id', orderController.getOrder as RequestHandler)

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus as RequestHandler)

export default router