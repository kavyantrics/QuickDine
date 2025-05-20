'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: string
  restaurantId: string
  // add other fields as needed
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on mount
   useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])


  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
