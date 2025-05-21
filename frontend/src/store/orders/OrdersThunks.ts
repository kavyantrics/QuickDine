import { createAsyncThunk } from '@reduxjs/toolkit'
import { setOrders, setLoading, setError, updateOrder, removeOrder } from './OrdersSlice'
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/types'
import { api } from '@/lib/api'
import { ApiResponse } from '../types'

// Fetch orders
export const fetchOrders = createAsyncThunk(
  'orders/fetch',
  async (restaurantId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await api.get<ApiResponse<Order[]>>(`/orders/restaurant/${restaurantId}`)
      dispatch(setOrders(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async (
    { orderId, status }: { orderId: string; status: OrderStatus },
    { dispatch }
  ) => {
    try {
      const response = await api.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, {
        status,
      })
      dispatch(updateOrder(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order status'
      dispatch(setError(errorMessage))
      throw error
    }
  }
)

// Update payment status
export const updatePaymentStatus = createAsyncThunk(
  'orders/updatePaymentStatus',
  async (
    { orderId, status }: { orderId: string; status: PaymentStatus },
    { dispatch }
  ) => {
    try {
      const response = await api.patch<ApiResponse<Order>>(`/orders/${orderId}/payment`, {
        status,
      })
      dispatch(updateOrder(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update payment status'
      dispatch(setError(errorMessage))
      throw error
    }
  }
)

// Update payment method
export const updatePaymentMethod = createAsyncThunk(
  'orders/updatePaymentMethod',
  async (
    { orderId, method }: { restaurantId: string; orderId: string; method: PaymentMethod },
    { dispatch }
  ) => {
    try {
      const response = await api.patch<ApiResponse<Order>>(
        `/orders/${orderId}/payment-method`,
        { method }
      )
      dispatch(updateOrder(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update payment method'
      dispatch(setError(errorMessage))
      throw error
    }
  }
)

// Update order table
export const updateOrderTable = createAsyncThunk(
  'orders/updateTable',
  async (
    {  orderId, tableId }: { restaurantId: string; orderId: string; tableId: string },
    { dispatch }
  ) => {
    try {
      const response = await api.patch<ApiResponse<Order>>(
        `/orders/${orderId}/table`,
        { tableId }
      )
      dispatch(updateOrder(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order table'
      dispatch(setError(errorMessage))
      throw error
    }
  }
)

// Update order items
export const updateOrderItems = createAsyncThunk(
  'orders/updateItems',
  async (
    {  orderId, items }: { restaurantId: string; orderId: string; items: { id: string; quantity: number }[] },
    { dispatch }
  ) => {
    try {
      const response = await api.patch<ApiResponse<Order>>(
        `/orders/${orderId}/items`,
        { items }
      )
      dispatch(updateOrder(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order items'
      dispatch(setError(errorMessage))
      throw error
    }
  }
)

// Delete order
export const deleteOrder = createAsyncThunk(
  'orders/delete',
  async (
    { orderId }: { orderId: string },
    { dispatch }
  ) => {
    try {
      await api.delete(`/orders/${orderId}`)
      dispatch(removeOrder(orderId))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete order'
      dispatch(setError(errorMessage))
      throw error
    }
  }
) 