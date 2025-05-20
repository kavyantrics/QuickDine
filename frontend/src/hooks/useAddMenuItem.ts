import { useState } from 'react'
import { addMenuItem, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { MenuItem } from '@/types'

export function useAddMenuItem() {
  const [state, setState] = useState<ApiState<MenuItem>>(createInitialApiState())

  const mutate = async (restaurantId: string, item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    setState(createLoadingApiState())
    try {
      const data = await addMenuItem(restaurantId, item)
      setState(createSuccessApiState(data))
      return data
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to add menu item'))
      throw err
    }
  }

  const reset = () => setState(createInitialApiState())
  return { ...state, mutate, reset }
}
