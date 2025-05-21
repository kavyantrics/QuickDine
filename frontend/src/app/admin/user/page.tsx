'use client'

import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import AdminNavbar from '@/components/AdminNavbar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useRestaurantProfile } from '@/hooks/useRestaurantProfile'
import { useCreateRestaurant } from '@/hooks/useCreateRestaurant'
import { useRegisterRestaurant } from '@/hooks/useRegisterRestaurant'
import { getRestaurant } from '@/lib/api'
import { setUser } from '@/store/auth/AuthSlice'

export default function UserDetailsPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const userId = user?.id || ''
  const restaurantId = user?.restaurantId || ''
  const { updateUser } = useUserProfile(userId, user || undefined)
  const { updateRestaurant, isLoading: restaurantIsLoading } = useRestaurantProfile(userId, restaurantId)
  const { createRestaurant } = useCreateRestaurant()
  const { registerRestaurant } = useRegisterRestaurant()
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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<'create' | 'register'>('create')
  const [dialogForm, setDialogForm] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    description: '',
    logo: '',
    numberOfTables: 1,
    tableCapacity: 4,
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  })
  
  const [restaurantLoading, setRestaurantLoading] = useState(false)

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (user?.restaurantId) {
        try {
          setRestaurantLoading(true)
          const restaurant = await getRestaurant(user.id, user.restaurantId)
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
      const updatedUser = await updateUser(userForm)
      dispatch(setUser({ ...user, ...updatedUser }))
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
      await updateRestaurant(restaurantForm)
      toast.success('Restaurant profile updated!')
    } catch {
      toast.error('Failed to update restaurant profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (dialogAction === 'create') {
        await createRestaurant(userId, dialogForm)
        toast.success('Restaurant created!')
      } else {
        await registerRestaurant(userId, dialogForm)
        toast.success('Restaurant registered!')
      }
      setDialogOpen(false)
    } catch {
      toast.error(`Failed to ${dialogAction} restaurant`)
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
        {restaurantLoading || restaurantIsLoading ? (
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

        <h1 className="text-2xl font-bold mb-4">Restaurant Actions</h1>
        <div className="flex gap-4 mb-8">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setDialogAction('create'); setDialogOpen(true); }}>
                Create Restaurant
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button onClick={() => { setDialogAction('register'); setDialogOpen(true); }}>
                Register Restaurant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {dialogAction === 'create' ? 'Create Restaurant' : 'Register Restaurant'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleDialogSubmit} className="space-y-4">
                <Input
                  placeholder="Restaurant Name"
                  value={dialogForm.name}
                  onChange={e => setDialogForm({ ...dialogForm, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={dialogForm.email}
                  onChange={e => setDialogForm({ ...dialogForm, email: e.target.value })}
                  required
                />
                <Input
                  placeholder="Address"
                  value={dialogForm.address}
                  onChange={e => setDialogForm({ ...dialogForm, address: e.target.value })}
                />
                <Input
                  placeholder="Phone"
                  value={dialogForm.phone}
                  onChange={e => setDialogForm({ ...dialogForm, phone: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={dialogForm.description}
                  onChange={e => setDialogForm({ ...dialogForm, description: e.target.value })}
                />
                <Input
                  placeholder="Logo URL"
                  value={dialogForm.logo}
                  onChange={e => setDialogForm({ ...dialogForm, logo: e.target.value })}
                />
                <Input
                  placeholder="Number of Tables"
                  type="number"
                  min={1}
                  value={dialogForm.numberOfTables}
                  onChange={e => setDialogForm({ ...dialogForm, numberOfTables: Number(e.target.value) })}
                  required
                />
                <Input
                  placeholder="Table Capacity"
                  type="number"
                  min={1}
                  value={dialogForm.tableCapacity}
                  onChange={e => setDialogForm({ ...dialogForm, tableCapacity: Number(e.target.value) })}
                  required
                />
                {dialogAction === 'register' && (
                  <>
                    <Input
                      placeholder="Admin Name"
                      value={dialogForm.adminName}
                      onChange={e => setDialogForm({ ...dialogForm, adminName: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Admin Email"
                      type="email"
                      value={dialogForm.adminEmail}
                      onChange={e => setDialogForm({ ...dialogForm, adminEmail: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Admin Password"
                      type="password"
                      value={dialogForm.adminPassword}
                      onChange={e => setDialogForm({ ...dialogForm, adminPassword: e.target.value })}
                      required
                    />
                  </>
                )}
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Processing...' : dialogAction === 'create' ? 'Create' : 'Register'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}
