import { Router } from 'express'
import orderRoutes from './order.routes'
import authRoutes from './auth.routes'
import restaurantRoutes from './restaurant.routes'
import analyticsRoutes from './analytics.routes'

const v1Router = Router()

v1Router.use('/orders', orderRoutes)
v1Router.use('/restaurants', restaurantRoutes)
v1Router.use('/auth', authRoutes)
v1Router.use('/analytics', analyticsRoutes)

export default v1Router