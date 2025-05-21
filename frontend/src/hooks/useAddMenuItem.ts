import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLoading, setError } from '@/store/menu/MenuSlice'
import { addMenuItem } from '@/lib/api'
import { MenuItem } from '@/types'

export function useAddMenuItem() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.menu)

  const mutate = async (restaurantId: string, item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch(setLoading(true))
    try {
      const data = await addMenuItem(restaurantId, item)
      return data
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to add menu item'))
      throw err
    }
  }

  return { isLoading, error, mutate }
}
