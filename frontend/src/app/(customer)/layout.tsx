'use client'

import CustomerNavbar from '@/components/CustomerNavbar'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />
      <main>{children}</main>
    </div>
  )
} 