'use client'

import { useEffect, useState } from 'react'
import { getMenu } from '@/lib/api'
import { MenuItem } from '@/types'
import { MenuCard } from '@/components/MenuCard'
import { CartDrawer } from '@/components/CartDrawer'
import { toast } from 'sonner'

interface MenuClientProps {
  restaurantId: string
  tableId: string
}

export default function MenuClient({ restaurantId, tableId }: MenuClientProps) {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await getMenu(restaurantId, tableId)
        setMenu(response)
      } catch (error) {
        console.error('Failed to fetch menu:', error)
        toast.error('Failed to load menu')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenu()
  }, [restaurantId, tableId])

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading menu...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
      <CartDrawer restaurantId={restaurantId} tableId={tableId} />
    </div>
  )
} 