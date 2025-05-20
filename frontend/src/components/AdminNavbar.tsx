'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AdminNavbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth/signin')
  }

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/admin/menu" className="font-bold hover:underline">Menu</Link>
        <Link href="/admin/orders" className="font-bold hover:underline">Orders</Link>
        <Link href="/admin/analytics" className="font-bold hover:underline">Analytics</Link>
        <Link href="/admin/user" className="font-bold hover:underline">Account</Link>
      </div>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm">Hi, {user.name}</span>}
        <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  )
}
