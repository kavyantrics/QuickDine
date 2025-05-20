import { useState, useCallback, useEffect } from 'react'
import { updateUser, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { User } from '@/types'

export function useUserProfile(userId: string, initialData?: User) {
  const [state, setState] = useState<ApiState<User>>(initialData ? createSuccessApiState(initialData) : createInitialApiState())

  const fetchUser = useCallback(async () => {
    // If you have a getUser API, use it here. For now, just use initialData.
    if (initialData) setState(createSuccessApiState(initialData))
  }, [initialData])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const update = async (data: Partial<User>) => {
    setState(createLoadingApiState())
    try {
      const updated = await updateUser(userId, data)
      setState(createSuccessApiState(updated))
      return updated
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to update user'))
      throw err
    }
  }

  return { ...state, updateUser: update, refetch: fetchUser }
} 