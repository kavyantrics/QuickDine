import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setRestaurant, setLoading, setError } from '@/store/restaurant/RestaurantSlice'
import { getRestaurant, updateRestaurant } from '@/lib/api'
import { useCallback, useEffect } from 'react'

export function useRestaurantProfile(userId: string, restaurantId: string) {
  const dispatch = useAppDispatch()
  const { data: restaurant, isLoading, error } = useAppSelector((state) => state.restaurant)

  const fetchRestaurant = useCallback(async () => {
    if (!userId || !restaurantId) return
    dispatch(setLoading(true))
    try {
      const data = await getRestaurant(userId, restaurantId)
      dispatch(setRestaurant(data))
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch restaurant'))
    }
  }, [dispatch, userId, restaurantId])

  useEffect(() => {
    fetchRestaurant()
  }, [fetchRestaurant])

  const update = async (data: Partial<typeof restaurant>) => {
    dispatch(setLoading(true))
    try {
      await updateRestaurant(userId, restaurantId, data)
      await fetchRestaurant()
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to update restaurant'))
      throw err
    }
  }

  return { restaurant, isLoading, error, updateRestaurant: update, refetch: fetchRestaurant }
} 