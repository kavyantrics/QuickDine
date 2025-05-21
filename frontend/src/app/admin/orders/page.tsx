'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import AdminNavbar from '@/components/AdminNavbar'
import { OrderStatus, PaymentStatus,
  //  PaymentMethod 
  } from '@/types'
import { format } from 'date-fns'
import {
  fetchOrders,
  updateOrderStatus,
  updatePaymentStatus,
  // updatePaymentMethod,
  // updateOrderTable,
  // updateOrderItems,
  deleteOrder,
} from '@/store/orders/OrdersThunks'

export default function OrdersPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { data: orders, isLoading, error } = useAppSelector((state) => state.orders)
  const restaurantId = user?.restaurantId || ''

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchOrders(restaurantId))
    }
  }, [dispatch, restaurantId])

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await dispatch(updateOrderStatus({ restaurantId, orderId, status })).unwrap()
      toast.success('Order status updated')
    } catch {
      toast.error('Failed to update order status')
    }
  }

  const handlePaymentStatusChange = async (orderId: string, status: PaymentStatus) => {
    try {
      await dispatch(updatePaymentStatus({ restaurantId, orderId, status })).unwrap()
      toast.success('Payment status updated')
    } catch {
      toast.error('Failed to update payment status')
    }
  }

  // const handlePaymentMethodChange = async (orderId: string, method: PaymentMethod) => {
  //   try {
  //     await dispatch(updatePaymentMethod({ restaurantId, orderId, method })).unwrap()
  //     toast.success('Payment method updated')
  //   } catch {
  //     toast.error('Failed to update payment method')
  //   }
  // }

  // const handleTableChange = async (orderId: string, tableId: string) => {
  //   try {
  //     await dispatch(updateOrderTable({ restaurantId, orderId, tableId })).unwrap()
  //     toast.success('Table updated')
  //   } catch {
  //     toast.error('Failed to update table')
  //   }
  // }

  // const handleItemsUpdate = async (orderId: string, items: { id: string; quantity: number }[]) => {
  //   try {
  //     await dispatch(updateOrderItems({ restaurantId, orderId, items })).unwrap()
  //     toast.success('Order items updated')
  //   } catch {
  //     toast.error('Failed to update order items')
  //   }
  // }

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return
    try {
      await dispatch(deleteOrder({ restaurantId, orderId })).unwrap()
      toast.success('Order deleted')
    } catch {
      toast.error('Failed to delete order')
    }
  }

  if (!user) {
    return <div>Please log in as a restaurant admin.</div>
  }

  if (isLoading) {
    return <div>Loading orders...</div>
  }

  if (error) {
    return <div>Error loading orders: {error}</div>
  }

  if (!orders || orders.length === 0) {
    return (
      <>
        <AdminNavbar />
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Orders</h1>
          <p>No orders found.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Orders</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Order #{order.id}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.createdAt), 'PPpp')}
                    </p>
                    <p className="font-medium">Table {order.tableId}</p>
                  </div>
                  <div>
                    <p className="font-medium">Items:</p>
                    <ul className="list-disc list-inside">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Total: ${(order.total || 0).toFixed(2)}</p>
                    <p className="text-sm">
                      Status: {order.status}
                    </p>
                    <p className="text-sm">
                      Payment: {order.paymentStatus} ({order.paymentMethod})
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(order.id, OrderStatus.PREPARING)}
                      disabled={order.status === OrderStatus.PREPARING}
                    >
                      Preparing
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(order.id, OrderStatus.READY)}
                      disabled={order.status === OrderStatus.READY}
                    >
                      Ready
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(order.id, OrderStatus.COMPLETED)}
                      disabled={order.status === OrderStatus.COMPLETED}
                    >
                      Completed
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handlePaymentStatusChange(order.id, PaymentStatus.PAID)}
                      disabled={order.paymentStatus === PaymentStatus.PAID}
                    >
                      Mark Paid
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}