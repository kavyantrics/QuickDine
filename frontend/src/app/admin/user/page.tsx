'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import AdminNavbar from '@/components/AdminNavbar'
import { updateUser, getRestaurant, updateRestaurant } from '@/lib/api'

export default function UserDetailsPage() {
  const { user, setUser } = useAuth()
  const [userForm, setUserForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    logo: '',
    email: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [restaurantLoading, setRestaurantLoading] = useState(true)

  // Fetch restaurant details on mount
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (user?.restaurantId) {
        try {
          setRestaurantLoading(true)
          const restaurant = await getRestaurant(user.restaurantId)
          setRestaurantForm({
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
          setRestaurantLoading(false)
        }
      }
    }
    fetchRestaurant()
  }, [user?.restaurantId])

  if (!user) {
    return <div className="container mx-auto py-8">Please log in as a restaurant admin.</div>
  }

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const updatedUser = await updateUser(user.id, userForm)
      setUser({ ...user, ...updatedUser })
      toast.success('User profile updated!')
    } catch {
      toast.error('Failed to update user profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await updateRestaurant(user.restaurantId, restaurantForm)
      toast.success('Restaurant profile updated!')
    } catch {
      toast.error('Failed to update restaurant profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container max-w-md mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Account Details</h1>
        <form onSubmit={handleUserSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block mb-1">Name</label>
            <Input
              value={userForm.name}
              onChange={e => setUserForm({ ...userForm, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <Input
              type="email"
              value={userForm.email}
              onChange={e => setUserForm({ ...userForm, email: e.target.value })}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>

        <h1 className="text-2xl font-bold mb-4">Restaurant Details</h1>
        {restaurantLoading ? (
          <div>Loading restaurant details...</div>
        ) : (
          <form onSubmit={handleRestaurantSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Restaurant Name</label>
              <Input
                value={restaurantForm.name}
                onChange={e => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <Input
                type="email"
                value={restaurantForm.email}
                onChange={e => setRestaurantForm({ ...restaurantForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Address</label>
              <Input
                value={restaurantForm.address}
                onChange={e => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1">Phone</label>
              <Input
                value={restaurantForm.phone}
                onChange={e => setRestaurantForm({ ...restaurantForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <Input
                value={restaurantForm.description}
                onChange={e => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1">Logo URL</label>
              <Input
                value={restaurantForm.logo}
                onChange={e => setRestaurantForm({ ...restaurantForm, logo: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        )}
      </div>
    </>
  )
}
