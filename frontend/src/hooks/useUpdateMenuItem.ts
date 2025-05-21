import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLoading, setError } from '@/store/menu/MenuSlice'
import { updateMenuItem } from '@/lib/api'
import { MenuItem } from '@/store/menu/Types'

export function useUpdateMenuItem() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.menu)

  const mutate = async (restaurantId: string, menuItemId: string, data: Partial<MenuItem>) => {
    dispatch(setLoading(true))
    try {
      const updated = await updateMenuItem(restaurantId, menuItemId, data)
      return updated
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to update menu item'))
      throw err
    }
  }

  return { isLoading, error, mutate }
}
