import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addOrder, setError } from '@/store/orders/OrdersSlice'
import { submitOrder } from '@/lib/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useCreateOrder() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isLoading, error } = useAppSelector((state) => state.orders)

  const createOrder = async (data: {
    restaurantId: string
    tableId: string
    customerName: string
    customerPhone: string
    items: {
      menuItemId: string
      quantity: number
    }[]
  }) => {
    try {
      const order = await submitOrder(data)
      dispatch(addOrder(order))
      toast.success('Order created successfully')
      router.push(`/${data.restaurantId}/${data.tableId}/order-confirmation`)
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to create order'))
      toast.error('Failed to create order')
      throw error
    }
  }

  return {
    createOrder,
    isLoading,
    error,
  }
}
