import { Router, RequestHandler } from 'express'
import { restaurantController } from '../controllers/restaurant.controller'

const router = Router()

// Specific routes first
router.get('/menu', restaurantController.getMenu as RequestHandler)

// Generic routes after
router.post('/', restaurantController.createRestaurant as RequestHandler)
router.get('/:id', restaurantController.getRestaurant as RequestHandler)
router.patch('/:id', restaurantController.updateRestaurant as RequestHandler)
router.post('/register', restaurantController.register as RequestHandler)

export default router
