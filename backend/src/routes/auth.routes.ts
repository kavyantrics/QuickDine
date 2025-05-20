import { RequestHandler, Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authLimiter } from '../middleware/rateLimit'

const router = Router()

router.post('/signup', authLimiter, authController.signup)
router.post('/login', authLimiter, authController.login)
router.post('/refresh', authLimiter, authController.refresh as RequestHandler)
router.patch('/users/:id', authController.updateUser as RequestHandler)

export default router