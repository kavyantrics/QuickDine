import bcrypt from 'bcrypt'
import { prisma } from './db'

const SALT_ROUNDS = 12
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function validatePasswordComplexity(password: string): { isValid: boolean; message: string } {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  if (password.length < minLength) {
    return { isValid: false, message: 'Password must be at least 8 characters long' }
  }
  if (!hasUpperCase) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' }
  }
  if (!hasLowerCase) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' }
  }
  if (!hasNumbers) {
    return { isValid: false, message: 'Password must contain at least one number' }
  }
  if (!hasSpecialChar) {
    return { isValid: false, message: 'Password must contain at least one special character' }
  }

  return { isValid: true, message: 'Password meets all requirements' }
}

export async function checkLoginAttempts(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { loginAttempts: true, lastFailedLogin: true }
  })

  if (!user) return false

  // Check if user is in lockout period
  if (user.lastFailedLogin && user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    const lockoutEnd = new Date(user.lastFailedLogin.getTime() + LOCKOUT_DURATION)
    if (new Date() < lockoutEnd) {
      return false
    }
    // Reset attempts if lockout period has passed
    await prisma.user.update({
      where: { id: userId },
      data: { loginAttempts: 0, lastFailedLogin: null }
    })
  }

  return true
}

export async function incrementLoginAttempts(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      loginAttempts: { increment: 1 },
      lastFailedLogin: new Date()
    }
  })
}

export async function resetLoginAttempts(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      loginAttempts: 0,
      lastFailedLogin: null
    }
  })
}