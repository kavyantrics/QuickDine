import { createAsyncThunk } from '@reduxjs/toolkit'
import { setRestaurant, setLoading, setError, clearRestaurant } from './RestaurantSlice'
import { Restaurant } from './Types'
import { api } from '@/lib/api'

// Fetch restaurant data thunk
export const fetchRestaurant = createAsyncThunk(
  'restaurant/fetchRestaurant',
  async (restaurantId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await api.get<{ data: Restaurant }>(`/restaurants/${restaurantId}`)
      dispatch(setRestaurant(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch restaurant'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Update restaurant data thunk
export const updateRestaurant = createAsyncThunk(
  'restaurant/updateRestaurant',
  async (
    { restaurantId, data }: { restaurantId: string; data: Partial<Restaurant> },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true))
      const response = await api.patch<{ data: Restaurant }>(
        `/restaurants/${restaurantId}`,
        data
      )
      dispatch(setRestaurant(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update restaurant'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Fetch current user's restaurant thunk
export const fetchCurrentRestaurant = createAsyncThunk(
  'restaurant/fetchCurrentRestaurant',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await api.get<{ data: Restaurant }>('/restaurants/me')
      dispatch(setRestaurant(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch restaurant'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Delete restaurant thunk
export const deleteRestaurant = createAsyncThunk(
  'restaurant/deleteRestaurant',
  async (restaurantId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      await api.delete(`/restaurants/${restaurantId}`)
      dispatch(clearRestaurant())
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete restaurant'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Upload restaurant image thunk
export const uploadRestaurantImage = createAsyncThunk(
  'restaurant/uploadImage',
  async (
    { restaurantId, imageFile }: { restaurantId: string; imageFile: File },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true))
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await api.post<{ data: Restaurant }>(
        `/restaurants/${restaurantId}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      dispatch(setRestaurant(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
) 