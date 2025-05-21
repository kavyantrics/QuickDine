import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { addItem, removeItem, updateQuantity, clearCart } from './CartSlice'
import { CartItem } from './Types'
import { toast } from 'sonner'

// Add item to cart thunk
export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (item: CartItem, { dispatch }) => {
    try {
      dispatch(addItem(item))
      toast.success(`${item.name} added to cart`)
      return item
    } catch (error) {
      toast.error('Failed to add item to cart')
      throw error
    }
  }
)

// Remove item from cart thunk
export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (itemId: string, { dispatch }) => {
    try {
      dispatch(removeItem(itemId))
      toast.success('Item removed from cart')
      return itemId
    } catch (error) {
      toast.error('Failed to remove item from cart')
      throw error
    }
  }
)

// Update item quantity thunk
export const updateItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { dispatch }
  ) => {
    try {
      if (quantity < 1) {
        dispatch(removeItem(itemId))
        toast.success('Item removed from cart')
      } else {
        dispatch(updateQuantity({ itemId, quantity }))
        toast.success('Cart updated')
      }
      return { itemId, quantity }
    } catch (error) {
      toast.error('Failed to update cart')
      throw error
    }
  }
)

// Clear cart thunk
export const clearCartItems = createAsyncThunk(
  'cart/clearCart',
  async (_, { dispatch }) => {
    try {
      dispatch(clearCart())
      toast.success('Cart cleared')
    } catch (error) {
      toast.error('Failed to clear cart')
      throw error
    }
  }
)

// Save cart to local storage thunk
export const saveCart = createAsyncThunk(
  'cart/saveCart',
  async (_, { getState }) => {
    try {
      const state = getState() as { cart: { items: CartItem[]; total: number } }
      localStorage.setItem('cart', JSON.stringify(state.cart))
    } catch (error) {
      console.error('Failed to save cart:', error)
    }
  }
)

// Load cart from local storage thunk
export const loadCart = createAsyncThunk(
  'cart/loadCart',
  async (_, { dispatch }) => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const { items } = JSON.parse(savedCart)
        items.forEach((item: CartItem) => {
          dispatch(addItem(item))
        })
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    }
  }
) 