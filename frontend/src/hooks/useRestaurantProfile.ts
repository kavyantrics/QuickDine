import { useState, useCallback, useEffect } from 'react'
import { getRestaurant, updateRestaurant, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { Restaurant } from '@/types'

export function useRestaurantProfile(userId: string, restaurantId: string, initialData?: Restaurant) {
  const [state, setState] = useState<ApiState<Restaurant>>(initialData ? createSuccessApiState(initialData) : createInitialApiState())

  const fetchRestaurant = useCallback(async () => {
    if (!userId || !restaurantId) return
    setState(createLoadingApiState())
    try {
      const data = await getRestaurant(userId, restaurantId)
      setState(createSuccessApiState(data))
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to fetch restaurant'))
    }
  }, [userId, restaurantId])

  useEffect(() => {
    fetchRestaurant()
  }, [fetchRestaurant])

  const update = async (data: Partial<Restaurant>) => {
    setState(createLoadingApiState())
    try {
      await updateRestaurant(userId, restaurantId, data)
      await fetchRestaurant()
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to update restaurant'))
      throw err
    }
  }

  return { ...state, updateRestaurant: update, refetch: fetchRestaurant }
} 