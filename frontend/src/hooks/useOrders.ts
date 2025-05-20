import { useCallback, useEffect, useState } from 'react'
import { getOrders, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { Order } from '@/types'

export function useOrders(restaurantId: string) {
  const [state, setState] = useState<ApiState<Order[]>>(createInitialApiState())

  const fetchOrders = useCallback(async () => {
    setState(createLoadingApiState())
    try {
      const data = await getOrders(restaurantId)
      setState(createSuccessApiState(data))
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to fetch orders'))
    }
  }, [restaurantId])

  useEffect(() => {
    if (restaurantId) fetchOrders()
  }, [restaurantId, fetchOrders])

  return { ...state, refetch: fetchOrders }
} 