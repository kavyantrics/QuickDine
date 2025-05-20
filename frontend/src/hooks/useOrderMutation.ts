import { useState } from 'react'
import { updateOrderStatus, ApiState, createInitialApiState, createLoadingApiState, createErrorApiState, createSuccessApiState } from '@/lib/api'
import { Order, UpdateOrderStatusInput } from '@/types'

export function useOrderMutation(onOptimisticUpdate?: (input: UpdateOrderStatusInput) => void) {
  const [state, setState] = useState<ApiState<Order>>(createInitialApiState())

  const mutate = async (input: UpdateOrderStatusInput) => {
    setState(createLoadingApiState())
    if (onOptimisticUpdate) onOptimisticUpdate(input)
    try {
      const data = await updateOrderStatus(input.orderId, input.status)
      setState(createSuccessApiState(data))
      return data
    } catch (err) {
      setState(createErrorApiState(err instanceof Error ? err.message : 'Failed to update order'))
      throw err
    }
  }

  const reset = () => setState(createInitialApiState())

  return { ...state, mutate, reset }
} 