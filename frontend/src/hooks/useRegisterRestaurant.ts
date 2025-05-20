import { useState } from 'react'
import { registerRestaurant, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { Restaurant } from '@/types'

export function useRegisterRestaurant() {
  const [state, setState] = useState<ApiState<Restaurant>>(createInitialApiState())

  const mutate = async (userId: string, data: Partial<Restaurant>) => {
    setState(createLoadingApiState())
    try {
      const registered = await registerRestaurant(userId, data)
      setState(createSuccessApiState(registered))
      return registered
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to register restaurant'))
      throw err
    }
  }

  const reset = () => setState(createInitialApiState())
  return { ...state, registerRestaurant: mutate, reset }
} 