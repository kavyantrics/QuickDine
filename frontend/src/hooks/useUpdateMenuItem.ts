import { useState } from 'react'
import { updateMenuItem, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { MenuItem } from '@/types'

export function useUpdateMenuItem() {
  const [state, setState] = useState<ApiState<MenuItem>>(createInitialApiState())

  const mutate = async (restaurantId: string, menuItemId: string, data: Partial<MenuItem>) => {
    setState(createLoadingApiState())
    try {
      const updated = await updateMenuItem(restaurantId, menuItemId, data)
      setState(createSuccessApiState(updated))
      return updated
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to update menu item'))
      throw err
    }
  }

  const reset = () => setState(createInitialApiState())
  return { ...state, mutate, reset }
}
