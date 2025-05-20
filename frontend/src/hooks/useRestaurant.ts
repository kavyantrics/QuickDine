import { useCallback, useEffect, useState } from 'react'
import { getRestaurant, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { Restaurant } from '@/types'

export function useRestaurant(userId: string, restaurantId: string) {
  const [state, setState] = useState<ApiState<Restaurant>>(createInitialApiState())

  const fetchRestaurant = useCallback(async () => {
    setState(createLoadingApiState())
    try {
      const data = await getRestaurant(userId, restaurantId)
      setState(createSuccessApiState(data))
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to fetch restaurant'))
    }
  }, [userId, restaurantId])

  useEffect(() => {
    if (userId && restaurantId) fetchRestaurant()
  }, [userId, restaurantId, fetchRestaurant])

  return { ...state, refetch: fetchRestaurant }
}
