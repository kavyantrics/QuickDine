'use client'

import { useState, useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import AdminNavbar from '@/components/AdminNavbar'
import { useRestaurantProfile } from '@/hooks/useRestaurantProfile'
import { getRestaurant } from '@/lib/api'

export default function RestaurantProfilePage() {
  const { user } = useAppSelector((state) => state.auth)
  const restaurantId = user?.restaurantId || ''
  const { updateRestaurant, isLoading } = useRestaurantProfile(user?.id || '', restaurantId)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    logo: '',
    email: '',
  })
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (user?.restaurantId) {
        try {
          setIsLoadingData(true)
          const restaurant = await getRestaurant(user.id, user.restaurantId)
          setFormData({
            name: restaurant.name || '',
            address: restaurant.address || '',
            phone: restaurant.phone || '',
            description: restaurant.description || '',
            logo: restaurant.logo || '',
            email: restaurant.email || '',
          })
        } catch (error) {
          console.error('Failed to fetch restaurant details:', error)
          toast.error('Failed to fetch restaurant details')
        } finally {
          setIsLoadingData(false)
        }
      }
    }
    fetchRestaurant()
  }, [user?.restaurantId])

  if (!user) {
    return <div>Please log in as a restaurant admin.</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateRestaurant(formData)
      toast.success('Restaurant profile updated!')
    } catch {
      toast.error('Failed to update restaurant profile')
    }
  }

  if (isLoadingData) {
    return <div>Loading restaurant details...</div>
  }

  return (
    <>
      <AdminNavbar />
      <div className="container max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Restaurant Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Restaurant Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1">Logo URL</label>
                <Input
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 