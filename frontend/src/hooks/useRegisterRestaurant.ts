import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setRestaurant, setLoading, setError } from '@/store/restaurant/RestaurantSlice'
import { registerRestaurant } from '@/lib/api'
import { Restaurant } from '@/store/restaurant/Types'

export function useRegisterRestaurant() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.restaurant)

  const mutate = async (userId: string, data: Partial<Restaurant>) => {
    dispatch(setLoading(true))
    try {
      const registered = await registerRestaurant(userId, data)
      dispatch(setRestaurant(registered))
      return registered
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to register restaurant'))
      throw err
    }
  }

  return { isLoading, error, registerRestaurant: mutate }
} 