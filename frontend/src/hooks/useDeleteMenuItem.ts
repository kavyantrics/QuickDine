import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLoading, setError } from '@/store/menu/MenuSlice'
import { deleteMenuItem } from '@/lib/api'

export function useDeleteMenuItem() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.menu)

  const mutate = async (restaurantId: string, menuItemId: string) => {
    dispatch(setLoading(true))
    try {
      await deleteMenuItem(restaurantId, menuItemId)
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to delete menu item'))
      throw err
    }
  }

  return { isLoading, error, mutate }
}
