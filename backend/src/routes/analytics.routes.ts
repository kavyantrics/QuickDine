import { Router } from 'express'
import { getAnalytics } from '../controllers/analytics.controller'


const router = Router()


// Get analytics data
router.get('/:restaurantId', getAnalytics as any)

export default router 