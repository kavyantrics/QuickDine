import { use } from 'react'
import CheckoutClient from './checkout-client'

interface PageProps {
  params: {
    restaurantId: string
    tableId: string
  }
}

export default function CheckoutPage({ params }: PageProps) {
  const { restaurantId, tableId } = use(Promise.resolve(params))
  return <CheckoutClient restaurantId={restaurantId} tableId={tableId} />
} 