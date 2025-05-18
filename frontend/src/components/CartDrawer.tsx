'use client'

import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { MenuItem } from '@/types'

interface CartItem {
  item: MenuItem
  quantity: number
}

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  total: number
  onClear: () => void
  restaurantId: string
  tableId: string
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  total,
  onClear,
  restaurantId,
  tableId
}: CartDrawerProps) {
  const router = useRouter()

  const handleCheckout = () => {
    router.push(`/checkout?r=${restaurantId}&t=${tableId}`)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4">
                {items.map(({ item, quantity }) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} x {quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center font-medium">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
                <Button onClick={handleCheckout} className="w-full">
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  onClick={onClear}
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 