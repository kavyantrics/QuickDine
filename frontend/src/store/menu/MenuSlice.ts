import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MenuItem } from '@/types'
import { ApiState } from '@/types'

interface MenuState extends ApiState<MenuItem[]> {
  selectedCategory?: string
}

const initialState: MenuState = {
  data: null,
  error: null,
  isLoading: false,
  selectedCategory: undefined,
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<MenuItem[]>) => {
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
    setSelectedCategory: (state, action: PayloadAction<string | undefined>) => {
      state.selectedCategory = action.payload
    },
    addMenuItem: (state, action: PayloadAction<MenuItem>) => {
      if (state.data) {
        state.data.push(action.payload)
      }
    },
    updateMenuItem: (state, action: PayloadAction<MenuItem>) => {
      if (state.data) {
        const index = state.data.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.data[index] = action.payload
        }
      }
    },
    deleteMenuItem: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data = state.data.filter(item => item.id !== action.payload)
      }
    },
  },
})

export const {
  setMenu,
  setLoading,
  setError,
  setSelectedCategory,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = menuSlice.actions

export default menuSlice.reducer 