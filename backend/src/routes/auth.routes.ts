import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authLimiter } from '../middleware/rateLimit'

const router = Router()

router.post('/signup', authLimiter, authController.signup)
router.post('/login', authLimiter, authController.login)
router.post('/refresh', authLimiter, authController.refresh)
router.patch('/users/:id', authController.updateUser)

export default router