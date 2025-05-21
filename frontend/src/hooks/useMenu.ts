import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setMenu, setLoading, setError } from '@/store/menu/MenuSlice'
import { getMenu } from '@/lib/api'
import { useEffect } from 'react'

export function useMenu(restaurantId: string, tableId: string) {
  const dispatch = useAppDispatch()
  const { data, isLoading, error } = useAppSelector((state) => state.menu)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        dispatch(setLoading(true))
        const response = await getMenu(restaurantId, tableId)
        dispatch(setMenu(response))
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch menu'))
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchMenu()
  }, [dispatch, restaurantId, tableId])

  return {
    data,
    isLoading,
    error,
  }
} 