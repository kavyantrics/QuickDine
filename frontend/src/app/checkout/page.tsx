'use client'

import { CheckoutForm } from '@/components/CheckoutForm'
import { useCart } from '@/contexts/cart-context'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, total, restaurantId, tableId } = useCart()
  const router = useRouter()

  if (!restaurantId || !tableId) {
    router.push('/')
    return null
  }

  const handleSuccess = () => {
    router.push('/order-success')
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <CheckoutForm
            restaurantId={restaurantId}
            tableId={tableId}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  )
} 