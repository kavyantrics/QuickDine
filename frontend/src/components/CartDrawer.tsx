'use client'

import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearCart } from '@/store/cart/CartSlice'

interface CartDrawerProps {
  restaurantId: string
  tableId: string
}

export function CartDrawer({ restaurantId, tableId }: CartDrawerProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { items, total } = useAppSelector((state) => state.cart)

  const handleCheckout = () => {
    router.push(`/${restaurantId}/${tableId}/checkout`)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} x ${item.price.toFixed(2)}
                </p>
              </div>
              <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">Total</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
            <Button className="w-full" onClick={handleCheckout} disabled={items.length === 0}>
              Checkout
            </Button>
            {items.length > 0 && (
              <Button variant="outline" className="w-full mt-2" onClick={() => dispatch(clearCart())}>
                Clear Cart
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 