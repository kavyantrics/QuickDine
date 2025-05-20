import { useState } from 'react'
import { createRestaurant, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { Restaurant } from '@/types'

export function useCreateRestaurant() {
  const [state, setState] = useState<ApiState<Restaurant>>(createInitialApiState())

  const mutate = async (userId: string, data: Partial<Restaurant>) => {
    setState(createLoadingApiState())
    try {
      const created = await createRestaurant(userId, data)
      setState(createSuccessApiState(created))
      return created
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to create restaurant'))
      throw err
    }
  }

  const reset = () => setState(createInitialApiState())
  return { ...state, createRestaurant: mutate, reset }
} 