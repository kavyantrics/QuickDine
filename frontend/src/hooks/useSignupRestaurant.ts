import { useState } from 'react'
import { signupRestaurant, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { Restaurant } from '@/types'

export function useSignupRestaurant() {
  const [state, setState] = useState<ApiState<Restaurant>>(createInitialApiState())

  const mutate = async (data: any) => {
    setState(createLoadingApiState())
    try {
      const registered = await signupRestaurant(data)
      setState(createSuccessApiState(registered))
      return registered
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to register restaurant'))
      throw err
    }
  }

  const reset = () => setState(createInitialApiState())
  return { ...state, signupRestaurant: mutate, reset }
} 