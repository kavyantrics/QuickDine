'use client'

import { useState } from 'react'
import { MenuItem } from '@/types'
import { MenuCard } from '@/components/MenuCard'
import { CartDrawer } from '@/components/CartDrawer'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

interface MenuClientProps {
  menu: MenuItem[]
  restaurantId: string
  tableId: string
}

export function MenuClient({ menu, restaurantId, tableId }: MenuClientProps) {
  const { addToCart, items, total, clearCart } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Menu</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCartOpen(true)}
          className="relative"
        >
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {items.length}
            </span>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={() => addToCart(item)}
          />
        ))}
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        total={total}
        onClear={clearCart}
        restaurantId={restaurantId}
        tableId={tableId}
      />
    </div>
  )
} 