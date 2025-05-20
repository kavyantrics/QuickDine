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
router.get('/admin-menu/:restaurantId', restaurantController.getAdminMenu as RequestHandler);

// Restaurant routes
router.post('/', restaurantController.createRestaurant as RequestHandler)
router.get('/:id', restaurantController.getRestaurant as RequestHandler)
router.patch('/:id', restaurantController.updateRestaurant as RequestHandler)
router.post('/register', restaurantController.register as RequestHandler)

export default router
