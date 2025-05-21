'use client'

import AdminNavbar from '@/components/AdminNavbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main>{children}</main>
    </div>
  )
} 