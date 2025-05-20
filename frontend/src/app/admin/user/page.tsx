'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import AdminNavbar from '@/components/AdminNavbar'

export default function UserDetailsPage() {
  const { user, setUser } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [isLoading, setIsLoading] = useState(false)

  if (!user) {
    return <div className="container mx-auto py-8">Please log in as a restaurant admin.</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // TODO: Call your backend API to update user details here
      // Example:
      // await updateUser(user.id, formData)
      setUser({ ...user, ...formData })
      toast.success('Profile updated!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AdminNavbar />
    <div className="container max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Account Details</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <Input
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
            disabled // usually email is not editable
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
    </>
  )
}
