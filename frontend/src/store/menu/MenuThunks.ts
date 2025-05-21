import { createAsyncThunk } from '@reduxjs/toolkit'
import { setMenu, setLoading, setError, addMenuItem, updateMenuItem as updateMenuItemAction, deleteMenuItem } from './MenuSlice'
import { MenuItem } from '@/types'
import { api } from '@/lib/api'
import { ApiResponse } from '@/types'

// Fetch menu items
export const fetchMenu = createAsyncThunk(
  'menu/fetchMenu',
  async ({ restaurantId, tableId }: { restaurantId: string; tableId: string }, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await api.get<ApiResponse<MenuItem[]>>(`/restaurants/menu?restaurantId=${restaurantId}&tableId=${tableId}`)
      dispatch(setMenu(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch menu'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Fetch admin menu
export const fetchAdminMenu = createAsyncThunk(
  'menu/fetchAdminMenu',
  async (restaurantId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await api.get<ApiResponse<MenuItem[]>>(`/restaurants/admin-menu/${restaurantId}`)
      dispatch(setMenu(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch admin menu'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Create menu item
export const createMenuItem = createAsyncThunk(
  'menu/createMenuItem',
  async (
    { restaurantId, data }: { restaurantId: string; data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'> },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true))
      const response = await api.post<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu`, data)
      dispatch(addMenuItem(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create menu item'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Update menu item
export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async (
    { restaurantId, menuItemId, data }: { restaurantId: string; menuItemId: string; data: Partial<MenuItem> },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true))
      const response = await api.patch<ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu/${menuItemId}`, data)
      dispatch(updateMenuItemAction(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update menu item'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Delete menu item
export const removeMenuItem = createAsyncThunk(
  'menu/removeMenuItem',
  async ({ restaurantId, menuItemId }: { restaurantId: string; menuItemId: string }, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      await api.delete(`/restaurants/${restaurantId}/menu/${menuItemId}`)
      dispatch(deleteMenuItem(menuItemId))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete menu item'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
) 