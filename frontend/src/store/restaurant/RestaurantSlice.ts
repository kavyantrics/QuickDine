import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Restaurant } from './Types'

interface RestaurantState {
  data: Restaurant | null
  isLoading: boolean
  error: string | null
}

const initialState: RestaurantState = {
  data: null,
  isLoading: false,
  error: null,
}

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.data = action.payload
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearRestaurant: (state) => {
      state.data = null
      state.error = null
    },
  },
})

export const { setRestaurant, setLoading, setError, clearRestaurant } = restaurantSlice.actions
export default restaurantSlice.reducer 