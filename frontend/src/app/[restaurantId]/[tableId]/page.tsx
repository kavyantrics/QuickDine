import { Suspense } from 'react'
import { getMenu } from '@/lib/api'
import { MenuClient } from './MenuClient'

export default async function MenuPage({
  params,
}: {
  params: { restaurantId: string; tableId: string }
}) {
  const menu = await getMenu(params.restaurantId, params.tableId)

  return (
    <Suspense fallback={<div className="container mx-auto py-8">Loading...</div>}>
      <MenuClient menu={menu} restaurantId={params.restaurantId} tableId={params.tableId} />
    </Suspense>
  )
} 