import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authLimiter } from '../middleware/rateLimit'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Authentication routes
router.post('/signup', authLimiter, authController.signup)
router.post('/login', authLimiter, authController.login)
router.post('/refresh', authLimiter, authController.refresh)
router.patch('/users/:id', authController.updateUser)

// Password reset routes
router.post('/reset-password', authLimiter, authController.updatePassword)
router.post('/verify-reset-token', authLimiter, authController.verifyResetPasswordToken)

// 2FA routes
router.post('/2fa/setup', authenticateToken, authController.setup2FA)
router.post('/2fa/verify', authenticateToken, authController.verify2FA)
router.post('/2fa/disable', authenticateToken, authController.disable2FA)
router.post('/2fa/verify-login', authLimiter, authController.verify2FALogin)

export default router