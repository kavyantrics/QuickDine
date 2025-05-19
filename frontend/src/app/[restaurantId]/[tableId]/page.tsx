import { Suspense } from 'react'
import { use } from 'react'
import MenuClient from './MenuClient'

interface PageProps {
  params: {
    restaurantId: string
    tableId: string
  }
}

export default function MenuPage({ params }: PageProps) {
  const { restaurantId, tableId } = use(Promise.resolve(params))
  
  return (
    <Suspense fallback={<div className="container mx-auto py-8">Loading...</div>}>
      <MenuClient restaurantId={restaurantId} tableId={tableId} />
    </Suspense>
  )
} 