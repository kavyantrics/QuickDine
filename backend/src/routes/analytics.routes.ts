import { Router } from 'express'
import { getAnalytics } from '../controllers/analytics.controller'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Get analytics data
router.get('/:restaurantId', authenticateToken, getAnalytics)

export default router 