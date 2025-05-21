import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { setUser, setLoading, setError, logout } from './AuthSlice'
import { LoginCredentials, SignupCredentials, LoginResponse, User } from './Types'
import { api } from '@/lib/api'
import { ApiResponse } from '../types'

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
      const { user, accessToken, refreshToken } = response.data.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      dispatch(setUser(user))
      return user
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Login failed'))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Signup thunk
export const signupUser = createAsyncThunk<
  void,
  SignupCredentials,
  { dispatch: AppDispatch }
>('auth/signup', async (credentials, { dispatch }) => {
  try {
    dispatch(setLoading(true))
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/signup/restaurant', {
      name: credentials.restaurantName || credentials.name,
      email: credentials.email,
      password: credentials.password,
      address: credentials.address,
      phone: credentials.phone,
    })

    if (response.data.success) {
      const { user, accessToken, refreshToken } = response.data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      dispatch(setUser(user))
    } else {
      throw new Error('Invalid signup response')
    }
  } catch (error) {
    dispatch(
      setError(error instanceof Error ? error.message : 'Failed to signup')
    )
    throw error
  } finally {
    dispatch(setLoading(false))
  }
})

// Logout thunk
export const logoutUser = () => (dispatch: AppDispatch) => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  delete api.defaults.headers.common['Authorization']
  dispatch(logout())
}

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { dispatch }) => {
    try {
      const refreshTokenStr = localStorage.getItem('refreshToken')
      if (!refreshTokenStr) {
        return null
      }

      const response = await api.post<ApiResponse<LoginResponse>>('/auth/refresh', {
        refreshToken: refreshTokenStr
      })

      if (response.data.success) {
        const { accessToken, user } = response.data.data
        localStorage.setItem('accessToken', accessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        dispatch(setUser(user))
        return user
      }
      return null
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      delete api.defaults.headers.common['Authorization']
      return null
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await api.get<ApiResponse<User>>('/auth/me')
      const user = response.data.data
      dispatch(setUser(user))
      return user
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
) 