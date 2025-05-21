'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logoutUser } from '@/store/auth/AuthThunks'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AdminNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success('Successfully logged out')
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Failed to logout')
    }
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/admin/dashboard') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/orders"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/admin/orders') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Orders
            </Link>
            <Link
              href="/admin/menu"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/admin/menu') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Menu
            </Link>
            <Link
              href="/admin/tables"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/admin/tables') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Tables
            </Link>
            <Link
              href="/admin/analytics"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/admin/analytics') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Analytics
            </Link>
            <Link
              href="/admin/user"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/admin/user') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              User
            </Link>
            <Link
              href="/admin/restaurant"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/admin/restaurant') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Restaurant
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
