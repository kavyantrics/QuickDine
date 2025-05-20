import { useState } from 'react'
import { submitOrder, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { Order } from '@/types'

export function useCreateOrder() {
  const [state, setState] = useState<ApiState<Order>>(createInitialApiState())

  const mutate = async (orderData: any) => {
    setState(createLoadingApiState())
    try {
      const data = await submitOrder(orderData)
      setState(createSuccessApiState(data))
      return data
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to create order'))
      throw err
    }
  }

  const reset = () => setState(createInitialApiState())
  return { ...state, mutate, reset }
}
