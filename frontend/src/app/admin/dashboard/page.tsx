'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useOrders } from '@/hooks/useOrders'
import { useMenu } from '@/hooks/useMenu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Utensils, Users, TrendingUp, ShoppingCart } from 'lucide-react'
import AdminNavbar from '@/components/AdminNavbar'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const restaurantId = user?.restaurantId || ''
  const { data: analytics } = useAnalytics(restaurantId)
  const { data: orders } = useOrders(restaurantId)
  const { data: menuItems } = useMenu(restaurantId, '')

  const recentOrders = orders?.slice(0, 5) || []
  const lowStockItems = menuItems?.filter(item => item.stock < 10) || []

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'orders':
        router.push('/admin/orders')
        break
      case 'menu':
        router.push('/admin/menu')
        break
      case 'analytics':
        router.push('/admin/analytics')
        break
      case 'users':
        router.push('/admin/user')
        break
    }
  }

  if (!user) {
    return <div>Please log in as a restaurant admin.</div>
  }

  const totalRevenue = analytics?.revenuePerDay?.reduce((sum, day) => sum + day.revenue, 0) || 0
  const totalOrders = analytics?.revenuePerDay?.length || 0
  const menuItemsCount = menuItems?.length || 0

  return (
    <>
      <AdminNavbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:bg-gray-50" onClick={() => handleQuickAction('orders')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-gray-50" onClick={() => handleQuickAction('analytics')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-gray-50" onClick={() => handleQuickAction('menu')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuItemsCount}</div>
              <p className="text-xs text-muted-foreground">Total items</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-gray-50" onClick={() => handleQuickAction('users')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Total staff</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu Insights</TabsTrigger>
            <TabsTrigger value="staff">Staff Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
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
                        <Bar dataKey="quantity" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total?.toFixed(2)}</p>
                        <p className={`text-sm ${
                          order.status === 'completed' ? 'text-green-500' :
                          order.status === 'pending' ? 'text-yellow-500' :
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
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lowStockItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-red-500">{item.stock} remaining</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Menu Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      menuItems?.reduce((acc, item) => {
                        acc[item.category] = (acc[item.category] || 0) + 1
                        return acc
                      }, {} as Record<string, number>) || {}
                    ).map(([category, count]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <p className="font-medium">{category}</p>
                        <p className="text-sm text-gray-500">{count} items</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    className="w-full"
                    onClick={() => router.push('/admin/user')}
                  >
                    Manage Staff
                  </Button>
                  <p className="text-sm text-gray-500 text-center">
                    Add, edit, or remove staff members and manage their roles
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
} 