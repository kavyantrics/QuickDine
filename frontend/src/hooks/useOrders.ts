import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setOrders, setLoading, setError } from '@/store/orders/OrdersSlice'
import { getOrders } from '@/lib/api'
import { useEffect } from 'react'

export function useOrders(restaurantId: string) {
  const dispatch = useAppDispatch()
  const { orders, isLoading, error } = useAppSelector((state) => state.orders)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(setLoading(true))
        const response = await getOrders(restaurantId)
        dispatch(setOrders(response))
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch orders'))
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchOrders()
  }, [dispatch, restaurantId])

  return {
    orders,
    isLoading,
    error,
  }
} 