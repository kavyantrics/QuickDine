'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/contexts/cart-context'
import { toast } from 'sonner'
import { useCreateOrder } from '@/hooks/useCreateOrder'

interface CheckoutFormProps {
  restaurantId: string
  tableId: string
  onSuccess: () => void
}

export function CheckoutForm({ restaurantId, tableId, onSuccess }: CheckoutFormProps) {
  const { items, total, clearCart } = useCart()
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
  })
  const { mutate: placeOrder, isLoading, error } = useCreateOrder()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await placeOrder({
        restaurantId,
        tableId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        items: items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      })
      toast.success('Order placed successfully!')
      clearCart()
      onSuccess()
    } catch (err) {
      console.error('Order placement failed:', err)
      toast.error('Failed to place order. Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
        <CardDescription>Please provide your details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={formData.customerName}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  customerName: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.customerPhone}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  customerPhone: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || items.length === 0}
          >
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </Button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      </CardContent>
    </Card>
  )
}