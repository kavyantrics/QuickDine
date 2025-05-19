import { Suspense } from 'react'
import MenuClient from './MenuClient'

interface PageProps {
  params: {
    restaurantId: string
    tableId: string
  }
}

export default async function MenuPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="container mx-auto py-8">Loading...</div>}>
      <MenuClient restaurantId={params.restaurantId} tableId={params.tableId} />
    </Suspense>
  )
} 