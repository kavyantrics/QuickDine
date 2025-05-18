'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Order } from '@/types'
import { getOrders, updateOrderStatus } from '@/lib/api'
import { usePusher } from '@/hooks/usePusher'
import { StatusBadge } from '@/components/StatusBadge'
import { OrderRow } from '@/components/OrderRow'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders('1') // TODO: Get restaurant ID from auth
        setOrders(data)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        toast.error('Failed to fetch orders')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  usePusher({
    channel: 'orders',
    event: 'new-order',
    onEvent: (newOrder: Order) => {
      setOrders(currentOrders => [newOrder, ...currentOrders])
      toast.success('New order received!')
    },
  })

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status)
      setOrders(currentOrders =>
        currentOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      )
      toast.success('Order status updated')
    } catch (error) {
      console.error('Failed to update order status:', error)
      toast.error('Failed to update order status')
    }
  }

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button onClick={() => router.push('/admin/menu')}>
          Manage Menu
        </Button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Order #{order.id}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-sm">
                  Customer: {order.customerName} ({order.customerPhone})
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="border-t pt-4">
              {order.items.map((item, index) => (
                <OrderRow key={`${item.menuItem.id}-${index}`} item={item} />
              ))}
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <span className="font-medium">Total</span>
                <span className="font-bold">
                  ${order.items.reduce(
                    (sum, item) => sum + item.menuItem.price * item.quantity,
                    0
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {order.status === 'PENDING' && (
                <Button
                  onClick={() => handleStatusUpdate(order.id, 'PREPARING')}
                  size="sm"
                >
                  Start Preparing
                </Button>
              )}
              {order.status === 'PREPARING' && (
                <Button
                  onClick={() => handleStatusUpdate(order.id, 'READY')}
                  size="sm"
                >
                  Mark as Ready
                </Button>
              )}
              {order.status === 'READY' && (
                <Button
                  onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                  size="sm"
                >
                  Complete Order
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 