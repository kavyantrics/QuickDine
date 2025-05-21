'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, QrCode, ShoppingCart, Clock, Star, Shield, Zap } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'

export default function HomePage() {
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)

  const handleGetStarted = () => {
    if (user) {
      // If user is logged in, redirect to their dashboard based on role
      if (user.role === 'RESTAURANT_OWNER') {
        router.push('/restaurant/dashboard')
      } else if (user.role === 'STAFF') {
        router.push('/staff/dashboard')
      } else {
        router.push('/dashboard')
      }
    } else {
      router.push('/auth/signup')
    }
  }

  const handleSignIn = () => {
    if (user) {
      // If already logged in, redirect to appropriate dashboard
      if (user.role === 'RESTAURANT_OWNER') {
        router.push('/restaurant/dashboard')
      } else if (user.role === 'STAFF') {
        router.push('/staff/dashboard')
      } else {
        router.push('/admin/dashboard')
      }
    } else {
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Transform Your Restaurant Experience
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Streamline ordering, boost efficiency, and enhance customer satisfaction with QuickDine&apos;s digital restaurant management solution.
            </p>
            <div className="flex gap-6 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6"
                onClick={handleGetStarted}
              >
                Get Started <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-24 px-4">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <Card className="transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <QrCode className="h-14 w-14 text-primary mb-6" />
              <CardTitle className="text-2xl mb-4">Scan & Order</CardTitle>
              <CardDescription className="text-lg">
                Customers scan a table-specific QR code to access your digital menu instantly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <ShoppingCart className="h-14 w-14 text-primary mb-6" />
              <CardTitle className="text-2xl mb-4">Easy Checkout</CardTitle>
              <CardDescription className="text-lg">
                Customers can browse, add items to cart, and place orders without waiting for waitstaff.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <Clock className="h-14 w-14 text-primary mb-6" />
              <CardTitle className="text-2xl mb-4">Real-time Updates</CardTitle>
              <CardDescription className="text-lg">
                Track order status in real-time with instant notifications for both customers and staff.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-muted py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose QuickDine?</h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <Star className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Enhanced Experience</h3>
              <p className="text-lg text-muted-foreground">
                Provide a modern, contactless ordering experience that delights customers and keeps them coming back.
              </p>
            </div>

            <div className="text-center">
              <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Reliable & Secure</h3>
              <p className="text-lg text-muted-foreground">
                Built with enterprise-grade security and reliability to handle your restaurant operations smoothly.
              </p>
            </div>

            <div className="text-center">
              <Zap className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Boost Efficiency</h3>
              <p className="text-lg text-muted-foreground">
                Reduce wait times, minimize errors, and optimize your staff&apos;s workflow with automated ordering.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto py-24 px-4 text-center">
        <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Restaurant?</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Join thousands of restaurants already using QuickDine to streamline their operations and delight customers.
        </p>
        <Button 
          size="lg" 
          className="text-lg px-8 py-6"
          onClick={handleGetStarted}
        >
          Get Started Today <ArrowRight className="ml-2 h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
