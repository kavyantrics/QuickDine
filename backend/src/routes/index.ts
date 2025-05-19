import { Router } from 'express'
import orderRoutes from './order.routes'
import authRoutes from './auth.routes'
import restaurantRoutes from './restaurant.routes'
import analyticsRoutes from './analytics.routes'

const router = Router()

router.use('/orders', orderRoutes)
router.use('/restaurants', restaurantRoutes)
router.use('/auth', authRoutes)
router.use('/analytics', analyticsRoutes)

export default router