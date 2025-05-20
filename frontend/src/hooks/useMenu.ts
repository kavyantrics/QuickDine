import { useCallback, useEffect, useState } from 'react'
import { getMenu, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { MenuItem } from '@/types'

export function useMenu(restaurantId: string, tableId: string) {
  const [state, setState] = useState<ApiState<MenuItem[]>>(createInitialApiState())

  const fetchMenu = useCallback(async () => {
    setState(createLoadingApiState())
    try {
      const data = await getMenu(restaurantId, tableId)
      setState(createSuccessApiState(data))
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to fetch menu'))
    }
  }, [restaurantId, tableId])

  useEffect(() => {
    if (restaurantId && tableId) fetchMenu()
  }, [restaurantId, tableId, fetchMenu])

  return { ...state, refetch: fetchMenu }
} 