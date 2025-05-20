import { useState } from 'react'
import { login, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { User } from '@/types'

export function useLogin() {
  const [state, setState] = useState<ApiState<{ user: User; accessToken: string; refreshToken: string }>>(createInitialApiState())

  const mutate = async (email: string, password: string) => {
    setState(createLoadingApiState())
    try {
      const response = await login(email, password)
      if (response.success && response.data) {
        setState(createSuccessApiState(response.data))
        return response.data
      } else {
        throw new Error('Invalid login response')
      }
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to login'))
      throw err
    }
  }

  const reset = () => setState(createInitialApiState())
  return { ...state, loginUser: mutate, reset }
} 