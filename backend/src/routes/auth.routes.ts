import { RequestHandler, Router } from 'express'
import { authController } from '../controllers/auth.controller'

const router = Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.patch('/users/:id', authController.updateUser)

export default router