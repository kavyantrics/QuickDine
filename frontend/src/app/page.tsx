import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, QrCode, ShoppingCart, Clock, ChefHat, BarChart } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Restaurant Experience
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              QuickDine brings digital ordering to your tables with QR codes. No more paper menus or waiting for waitstaff.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/restaurant/signup">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/signin">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <QrCode className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Scan & Order</CardTitle>
              <CardDescription>
                Customers scan a table-specific QR code to access your digital menu instantly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <ShoppingCart className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Easy Checkout</CardTitle>
              <CardDescription>
                Customers can browse, add items to cart, and place orders without waiting for waitstaff.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Track order status in real-time with instant notifications for both customers and staff.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <ChefHat className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Kitchen Management</CardTitle>
              <CardDescription>
                Staff can view and manage orders efficiently through a dedicated admin dashboard.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>
                Track your restaurant&apos;s performance with detailed sales reports and analytics.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-muted">
        <div className="container mx-auto py-20 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuickDine?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">For Restaurants</h3>
              <ul className="space-y-2">
                <li>• Reduce waitstaff workload</li>
                <li>• Eliminate paper menu costs</li>
                <li>• Increase order accuracy</li>
                <li>• Improve customer satisfaction</li>
                <li>• Real-time order management</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">For Customers</h3>
              <ul className="space-y-2">
                <li>• No more waiting for menus</li>
                <li>• Order at your own pace</li>
                <li>• Track order status in real-time</li>
                <li>• Easy payment process</li>
                <li>• Better dining experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Restaurant?</h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join the digital revolution and provide a better experience for your customers.
          </p>
          <Button asChild size="lg">
            <Link href="/restaurant/signup">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
