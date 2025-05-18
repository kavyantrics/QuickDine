import { useState, useCallback } from 'react'
import { MenuItem } from '@/types'

interface CartItem {
  item: MenuItem
  quantity: number
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = useCallback((item: MenuItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.item.id === item.id)
      if (existingItem) {
        return currentItems.map(i =>
          i.item.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...currentItems, { item, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((itemId: string) => {
    setItems(currentItems =>
      currentItems.filter(i => i.item.id !== itemId)
    )
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setItems(currentItems =>
      currentItems.map(i =>
        i.item.id === itemId
          ? { ...i, quantity }
          : i
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const total = items.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  )

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total
  }
} 