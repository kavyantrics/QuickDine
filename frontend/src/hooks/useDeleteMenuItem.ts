import { useState } from 'react'
import { deleteMenuItem, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'

export function useDeleteMenuItem() {
  const [state, setState] = useState<ApiState<null>>(createInitialApiState())

  const mutate = async (restaurantId: string, menuItemId: string) => {
    setState(createLoadingApiState())
    try {
      await deleteMenuItem(restaurantId, menuItemId)
      setState(createSuccessApiState(null))
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to delete menu item'))
      throw err
    }
  }

  const reset = () => setState(createInitialApiState())
  return { ...state, mutate, reset }
}
