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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Printer, Download } from 'lucide-react'

export default function OrdersPage() {
  const router = useRouter()
  const { pusher, isConnected } = usePusher()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBill, setSelectedBill] = useState<Order | null>(null)

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
    if (!pusher || !isConnected) {
      return
    }

    const restaurantId = localStorage.getItem('restaurantId')
    if (!restaurantId) {
      return
    }

    const channelName = `restaurant-${restaurantId}`
    const newChannel = pusher.subscribe(channelName)

    const handleSubscriptionSucceeded = () => {
    }

    const handleSubscriptionError = (error: Error) => {
      console.error('Failed to subscribe to channel:', error)
      toast.error('Failed to connect to real-time updates')
    }

    const handleNewOrder = (data: { order: Order, message: string }) => {
      setOrders(prev => [data.order, ...prev])
      toast.success(data.message)
    }

    const handleOrderStatusUpdate = (data: { 
      orderId: string, 
      status: Order['status'],
      orderNumber: string,
      tableNumber: string,
      message: string 
    }) => {
      setOrders(prev => prev.map(order =>
        order.id === data.orderId ? { ...order, status: data.status } : order
      ))
      toast.info(data.message)
    }

    newChannel.bind('pusher:subscription_succeeded', handleSubscriptionSucceeded)
    newChannel.bind('pusher:subscription_error', handleSubscriptionError)
    newChannel.bind('new-order', handleNewOrder)
    newChannel.bind('order-status-updated', handleOrderStatusUpdate)

    return () => {
      if (newChannel) {
        newChannel.unbind('pusher:subscription_succeeded', handleSubscriptionSucceeded)
        newChannel.unbind('pusher:subscription_error', handleSubscriptionError)
        newChannel.unbind('new-order', handleNewOrder)
        newChannel.unbind('order-status-updated', handleOrderStatusUpdate)
        newChannel.unsubscribe()
      }
    }
  }, [pusher, isConnected])

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
    setSelectedBill(order)
  }

  const handlePrintBill = () => {
    if (!selectedBill) return

    const billWindow = window.open('', '_blank', 'width=600,height=800')
    if (!billWindow) return

    const billHtml = `
      <html>
        <head>
          <title>Bill for Order #${selectedBill.id}</title>
          <style>
            @media print {
              body { font-family: 'Courier New', monospace; }
              .no-print { display: none; }
            }
            body { 
              font-family: 'Courier New', monospace;
              padding: 2rem;
              max-width: 80mm;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 1rem;
            }
            .header h1 {
              font-size: 1.2rem;
              margin: 0;
            }
            .header p {
              margin: 0.2rem 0;
              font-size: 0.9rem;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 0.5rem 0;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
              font-size: 0.9rem;
            }
            .items-table th {
              text-align: left;
              padding: 0.2rem 0;
            }
            .items-table td {
              padding: 0.2rem 0;
            }
            .total {
              font-weight: bold;
              margin-top: 1rem;
              text-align: right;
            }
            .footer {
              text-align: center;
              margin-top: 2rem;
              font-size: 0.9rem;
            }
            .print-button {
              position: fixed;
              top: 1rem;
              right: 1rem;
              padding: 0.5rem 1rem;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            .print-button:hover {
              background: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>QuickDine</h1>
            <p>Restaurant Bill</p>
            <p>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          </div>
          <div class="divider"></div>
          <div>
            <p><strong>Order #:</strong> ${selectedBill.id}</p>
            <p><strong>Table #:</strong> ${selectedBill.table?.number ?? '?'}</p>
            <p><strong>Customer:</strong> ${selectedBill.customerName}</p>
            <p><strong>Date:</strong> ${new Date(selectedBill.createdAt).toLocaleString()}</p>
          </div>
          <div class="divider"></div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${selectedBill.items.map(item => `
                <tr>
                  <td>${item.menuItem.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.menuItem.price.toFixed(2)}</td>
                  <td>$${(item.menuItem.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="divider"></div>
          <div class="total">
            <p>Subtotal: $${((selectedBill.total ?? selectedBill.totalAmount ?? 0) * 0.9).toFixed(2)}</p>
            <p>Tax (10%): $${((selectedBill.total ?? selectedBill.totalAmount ?? 0) * 0.1).toFixed(2)}</p>
            <p>Total: $${((selectedBill.total ?? selectedBill.totalAmount ?? 0).toFixed(2))}</p>
          </div>
          <div class="footer">
            <p>Thank you for dining with us!</p>
            <p>Please visit again</p>
          </div>
          <button class="print-button no-print" onclick="window.print()">Print Bill</button>
        </body>
      </html>
    `

    billWindow.document.write(billHtml)
    billWindow.document.close()
    billWindow.focus()
  }

  const handleDownloadBill = () => {
    if (!selectedBill) return

    const billContent = `
QuickDine - Restaurant Bill
------------------------
Order #: ${selectedBill.id}
Table #: ${selectedBill.table?.number ?? '?'}
Customer: ${selectedBill.customerName}
Date: ${new Date(selectedBill.createdAt).toLocaleString()}

Items:
${selectedBill.items.map(item => 
  `${item.menuItem.name} x${item.quantity} - $${(item.menuItem.price * item.quantity).toFixed(2)}`
).join('\n')}

------------------------
Subtotal: $${((selectedBill.total ?? selectedBill.totalAmount ?? 0) * 0.9).toFixed(2)}
Tax (10%): $${((selectedBill.total ?? selectedBill.totalAmount ?? 0) * 0.1).toFixed(2)}
Total: $${((selectedBill.total ?? selectedBill.totalAmount ?? 0).toFixed(2))}

Thank you for dining with us!
Please visit again
    `

    const blob = new Blob([billContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bill-${selectedBill.id}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
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
                  className="flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Generate Bill
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bill Preview</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <h3 className="text-lg font-bold">QuickDine</h3>
              <p className="text-sm text-gray-500">Restaurant Bill</p>
            </div>
            <div className="space-y-2">
              <p><strong>Order #:</strong> {selectedBill?.id}</p>
              <p><strong>Table #:</strong> {selectedBill?.table?.number ?? '?'}</p>
              <p><strong>Customer:</strong> {selectedBill?.customerName}</p>
              <p><strong>Date:</strong> {selectedBill && new Date(selectedBill.createdAt).toLocaleString()}</p>
            </div>
            <div className="border-t border-b py-2">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill?.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.menuItem.name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.menuItem.price.toFixed(2)}</td>
                      <td>${(item.menuItem.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right space-y-1">
              <p>Subtotal: ${selectedBill && ((selectedBill.total ?? selectedBill.totalAmount ?? 0) * 0.9).toFixed(2)}</p>
              <p>Tax (10%): ${selectedBill && ((selectedBill.total ?? selectedBill.totalAmount ?? 0) * 0.1).toFixed(2)}</p>
              <p className="font-bold">Total: ${selectedBill && ((selectedBill.total ?? selectedBill.totalAmount ?? 0).toFixed(2))}</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleDownloadBill} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button onClick={handlePrintBill} className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}