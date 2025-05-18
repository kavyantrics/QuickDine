'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signupRestaurant } from '@/lib/api'
import { toast } from 'sonner'

export default function RestaurantSignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signupRestaurant(formData)
      toast.success('Restaurant registered successfully!')
      router.push('/auth/signin')
    } catch (err) {
      console.error('Restaurant registration failed:', err)
      toast.error('Failed to register restaurant')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Register Restaurant</CardTitle>
            <CardDescription>Create your restaurant account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Restaurant Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register Restaurant'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 