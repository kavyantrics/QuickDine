'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { login, refreshToken } from '@/lib/api'

export interface User {
  id: string
  name: string
  email: string
  role: string
  restaurantId: string
  ownedRestaurants?: Array<{
    id: string
    name: string
    role: string
  }>
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load user and tokens from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        const storedRefreshToken = localStorage.getItem('refreshToken')
        
        if (storedUser && storedRefreshToken) {
          setUser(JSON.parse(storedUser))
          // Attempt to refresh the token
          await refreshUser()
        }
      } catch (err) {
        console.error('Error loading user:', err)
        setError('Failed to load user session')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Save user and tokens to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('accessToken')
    }
  }, [user])

  const refreshUser = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken')
      if (!storedRefreshToken) throw new Error('No refresh token found')

      const response = await refreshToken(storedRefreshToken)
      if (response.success) {
        localStorage.setItem('accessToken', response.data.accessToken)
        // Optionally update user data if needed
      } else {
        throw new Error('Failed to refresh token')
      }
    } catch (err) {
      console.error('Error refreshing token:', err)
      setUser(null)
      setError('Session expired. Please login again.')
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await login(email, password)
      
      if (response.success) {
        setUser(response.data.user)
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
      } else {
        throw new Error('Login failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        logout, 
        isLoading, 
        error, 
        login: handleLogin,
        refreshUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
