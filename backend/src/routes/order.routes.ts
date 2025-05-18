import { Router } from 'express'
import { orderController } from '../controllers/order.controller'

const router = Router()

// Create new order
router.post('/', orderController.createOrder)

// Get all orders for a restaurant
router.get('/restaurant/:restaurantId', orderController.getRestaurantOrders)

// Get single order
router.get('/:id', orderController.getOrder)

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus)

export default router