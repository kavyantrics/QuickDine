import { Router } from 'express'
import { restaurantController } from '../controllers/restaurant.controller'

const router = Router()

router.post('/register', restaurantController.register)
router.get('/menu', restaurantController.getMenu)

export default router