'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminNavbar from '@/components/AdminNavbar'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { format } from 'date-fns'
import { fetchAnalyticsData } from '@/store/analytics/AnalyticsThunks'
import { fetchOrders } from '@/store/orders/OrdersThunks'

export default function AnalyticsPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useAppSelector((state) => state.analytics)
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useAppSelector((state) => state.orders)
  const restaurantId = user?.restaurantId || ''

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchAnalyticsData(restaurantId))
      dispatch(fetchOrders(restaurantId))
    }
  }, [dispatch, restaurantId])

  if (!user) {
    return <div>Please log in as a restaurant admin.</div>
  }

  if (analyticsLoading || ordersLoading) {
    return <div>Loading analytics...</div>
  }

  if (analyticsError || ordersError) {
    return <div>Error loading analytics</div>
  }

  const totalRevenue = analytics?.revenuePerDay?.reduce((sum, day) => sum + day.revenue, 0) || 0
  const totalOrders = analytics?.revenuePerDay?.length || 0
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <>
      <AdminNavbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Analytics</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-sm text-gray-500">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-sm text-gray-500">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
              <p className="text-sm text-gray-500">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics?.revenuePerDay || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.topItems || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalQuantity" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders?.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.createdAt), 'PPpp')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <p className={`text-sm ${
                      order.status === 'COMPLETED' ? 'text-green-500' :
                      order.status === 'PENDING' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 