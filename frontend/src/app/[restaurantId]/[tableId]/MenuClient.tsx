'use client'

import { useMenu } from '@/hooks/useMenu'
import { MenuCard } from '@/components/MenuCard'
import { CartDrawer } from '@/components/CartDrawer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { MenuItem } from '@/types'
import { useAppSelector } from '@/store/hooks'

interface MenuClientProps {
  restaurantId: string
  tableId: string
}

// Group menu items by category
const groupItemsByCategory = (items: MenuItem[]) => {
  return items.reduce((acc, item) => {
    const category = item.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)
}

// Format category name for display
const formatCategoryName = (category: string) => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export default function MenuClient({ restaurantId, tableId }: MenuClientProps) {
  const {isLoading: authLoading } = useAppSelector((state) => state.auth)
  const { data: menu, isLoading: menuLoading, error } = useMenu(restaurantId, tableId)

  if (authLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }



  if (menuLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          Failed to load menu. Please try again later.
        </div>
      </div>
    )
  }

  const groupedItems = groupItemsByCategory(menu || [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Menu</h1>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <AccordionItem
            key={category}
            value={category}
            className="border rounded-lg px-4 bg-white"
          >
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
              {formatCategoryName(category)}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                {items.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <CartDrawer restaurantId={restaurantId} tableId={tableId} />
    </div>
  )
} 