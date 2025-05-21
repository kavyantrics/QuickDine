'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { checkAuth } from '@/store/auth/AuthThunks'

const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Skip auth check for public paths
      if (publicPaths.includes(pathname)) {
        return
      }

      // If we have a user, no need to check auth
      if (user) {
        return
      }

      try {
        const result = await dispatch(checkAuth()).unwrap()
        if (!result && !publicPaths.includes(pathname)) {
          router.push('auth/login')
        }
      } catch {
        if (!publicPaths.includes(pathname)) {
          router.push('auth/login')
        }
      }
    }

    checkAuthStatus()
  }, [dispatch, pathname, router, user])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <>{children}</>
} 