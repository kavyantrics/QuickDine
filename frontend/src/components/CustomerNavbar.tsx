'use client'

import { useRouter, useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logoutUser } from '@/store/auth/AuthThunks'
import { Button } from '@/components/ui/button'
import { CartDrawer } from '@/components/CartDrawer'

export default function CustomerNavbar() {
  const router = useRouter()
  const params = useParams()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">QuickDine</h1>
          {user && (
            <span className="text-sm text-muted-foreground">
              Welcome, {user.name}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {params.restaurantId && params.tableId && (
            <CartDrawer
              restaurantId={params.restaurantId as string}
              tableId={params.tableId as string}
            />
          )}
          {user && (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
} 