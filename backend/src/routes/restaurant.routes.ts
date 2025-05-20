import { Router, RequestHandler } from 'express'
import { restaurantController } from '../controllers/restaurant.controller'

const router = Router()

// Menu routes
router.get('/menu', restaurantController.getMenu as RequestHandler)
router.post('/:restaurantId/menu', restaurantController.createMenuItem as RequestHandler)
router.put('/:restaurantId/menu/:id', restaurantController.updateMenuItem as RequestHandler)
router.patch('/:restaurantId/menu/:id', restaurantController.updateMenuItem as RequestHandler)
router.delete('/:restaurantId/menu/:id', restaurantController.deleteMenuItem as RequestHandler)

// Add this route for admin menu fetching
router.get('/admin-menu/:restaurantId', restaurantController.getAdminMenu as RequestHandler)

// Restaurant routes (user-specific)
router.post('/user/:userId/restaurant', restaurantController.createRestaurant as RequestHandler)
router.get('/user/:userId/restaurant/:restaurantId', restaurantController.getRestaurant as RequestHandler)
router.patch('/user/:userId/restaurant/:restaurantId', restaurantController.updateRestaurant as RequestHandler)
router.post('/user/:userId/restaurant/register', restaurantController.register as RequestHandler)

export default router
