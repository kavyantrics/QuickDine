import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setRestaurant, setLoading, setError } from '@/store/restaurant/RestaurantSlice'
import { getRestaurant } from '@/lib/api'
import { useCallback, useEffect } from 'react'

export function useRestaurant(userId: string, restaurantId: string) {
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
    if (userId && restaurantId) fetchRestaurant()
  }, [userId, restaurantId, fetchRestaurant])

  return { restaurant, isLoading, error, refetch: fetchRestaurant }
}
