import { Router } from 'express'
import orderRoutes from './order.routes'
import authRoutes from './auth.routes'
import restaurantRoutes from './restaurant.routes'

const router = Router()

router.use('/orders', orderRoutes)
router.use('/restaurants', restaurantRoutes)
router.use('/auth', authRoutes)

export default router