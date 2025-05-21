import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addItem, removeItem, updateQuantity, clearCart } from '@/store/cart/CartSlice'
import { CartItem } from '@/store/cart/Types'

export function useCartState() {
  const dispatch = useAppDispatch()
  const { items, total } = useAppSelector((state) => state.cart)

  const addToCart = (item: CartItem) => {
    dispatch(addItem(item))
  }

  const removeFromCart = (itemId: string) => {
    dispatch(removeItem(itemId))
  }

  const updateItemQuantity = (itemId: string, quantity: number) => {
    dispatch(updateQuantity({ itemId, quantity }))
  }

  const clearCartItems = () => {
    dispatch(clearCart())
  }

  return {
    items,
    total,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCartItems,
  }
} 