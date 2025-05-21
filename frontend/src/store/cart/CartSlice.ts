import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem } from './Types'

interface CartState {
  items: CartItem[]
  total: number
}

const initialState: CartState = {
  items: [],
  total: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    updateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.itemId)
      if (item) {
        item.quantity = action.payload.quantity
        state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer 