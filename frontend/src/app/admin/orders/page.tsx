'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOrders, updateOrderStatus } from '@/lib/api'
import { Order } from '@/types'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { usePusher } from '@/contexts/pusher-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function OrdersPage() {
  const router = useRouter()
  const { pusher } = usePusher()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [generatingBillId, setGeneratingBillId] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const restaurantId = localStorage.getItem('restaurantId')
        if (!restaurantId) {
          toast.error('Restaurant ID not found')
          router.push('/auth/signin')
          return
        }
        const response = await getOrders(restaurantId)
        setOrders(response)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        toast.error('Failed to fetch orders')
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [router])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!pusher) return
    
    const restaurantId = localStorage.getItem('restaurantId')
    if (!restaurantId) return

    const channel = pusher.subscribe(`restaurant-${restaurantId}`)
    
    channel.bind('order-created', (newOrder: Order) => {
      setOrders(prev => [newOrder, ...prev])
      toast.success('New order received!')
    })

    channel.bind('order-updated', (updatedOrder: Order) => {
      setOrders(prev => prev.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ))
      toast.info('Order updated!')
    })

    channel.bind('order-status-updated', (data: { orderId: string, status: Order['status'] }) => {
      setOrders(prev => prev.map(order => 
        order.id === data.orderId ? { ...order, status: data.status } : order
      ))
      toast.info('Order status updated!')
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [pusher])

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Update local state immediately
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      
      // Make API call
      await updateOrderStatus(orderId, newStatus)
      toast.success('Order status updated')
    } catch (error) {
      // Revert the state if API call fails
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: order.status } : order
      ))
      console.error('Failed to update order status:', error)
      toast.error('Failed to update order status')
    }
  }

  const handleGenerateBill = (order: Order) => {
    setGeneratingBillId(order.id)
    printBill(order)
    setTimeout(() => {
      toast.success(`Bill generated for Order #${order.id}`)
      setGeneratingBillId(null)
    }, 1000)
  }

  function printBill(order: Order) {
    const billWindow = window.open('', '_blank', 'width=600,height=800')
    if (!billWindow) return

    const billHtml = `
      <html>
        <head>
          <title>Bill for Order #${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; }
            h2 { margin-bottom: 0.5rem; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            .items-table th, .items-table td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
            .items-table th { background: #f5f5f5; }
            .total { font-weight: bold; font-size: 1.2rem; margin-top: 1rem; }
          </style>
        </head>
        <body>
          <h2>QuickDine - Bill</h2>
          <div><strong>Order #:</strong> ${order.id}</div>
          <div><strong>Table #:</strong> ${order.table?.number ?? '?'}</div>
          <div><strong>Customer:</strong> ${order.customerName}</div>
          <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.menuItem.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.menuItem.price.toFixed(2)}</td>
                  <td>$${(item.menuItem.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Total: $${((order.total ?? order.totalAmount ?? 0).toFixed(2))}</div>
          <div style="margin-top:2rem;">Thank you for dining with us!</div>
        </body>
      </html>
    `

    billWindow.document.write(billHtml)
    billWindow.document.close()
    billWindow.focus()
    billWindow.print()
  }

  if (isLoading) {
    return <div>Loading orders...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No orders found</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Table #{order.table?.number ?? '?'}</span>
                <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="font-semibold">Customer:</span> {order.customerName}
              </div>
              <div>
                <span className="font-semibold">Items:</span>
                <ul className="ml-4 mt-1 space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{item.menuItem.name}</span>
                      <span>x{item.quantity}</span>
                      <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-green-600">
                  ${((order.total ?? order.totalAmount ?? 0).toFixed(2))}
                </span>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Select
                  value={order.status}
                  onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="served">Served</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={() => handleGenerateBill(order)} 
                  disabled={generatingBillId === order.id}
                >
                  {generatingBillId === order.id ? 'Generating...' : 'Generate Bill'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}