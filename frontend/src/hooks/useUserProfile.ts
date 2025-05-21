import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setUser, setLoading, setError } from '@/store/auth/AuthSlice'
import { updateUser } from '@/lib/api'
import { User } from '@/store/auth/Types'

export function useUserProfile(userId: string, initialData?: User) {
  const dispatch = useAppDispatch()
  const { user, isLoading, error } = useAppSelector((state) => state.auth)

  const update = async (data: Partial<User>) => {
    dispatch(setLoading(true))
    try {
      const updated = await updateUser(userId, data)
      dispatch(setUser(updated))
      return updated
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to update user'))
      throw err
    }
  }

  return { user, isLoading, error, updateUser: update }
} 