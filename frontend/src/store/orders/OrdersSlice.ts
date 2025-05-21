import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Order, 
  // OrderStatus, PaymentStatus, PaymentMethod 
} from '@/types'
import { ApiState } from '../types'

interface OrdersState extends ApiState<Order[]> {
  selectedOrder?: Order
}

const initialState: OrdersState = {
  data: null,
  error: null,
  isLoading: false,
  selectedOrder: undefined,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.data = action.payload
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    setSelectedOrder: (state, action: PayloadAction<Order | undefined>) => {
      state.selectedOrder = action.payload
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      if (state.data) {
        state.data.push(action.payload)
      }
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      if (state.data) {
        const index = state.data.findIndex(order => order.id === action.payload.id)
        if (index !== -1) {
          state.data[index] = action.payload
        }
      }
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) => {
      if (state.data) {
        const order = state.data.find(order => order.id === action.payload.orderId)
        if (order) {
          order.status = action.payload.status
        }
      }
    },
    removeOrder: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data = state.data.filter(order => order.id !== action.payload)
      }
    },
  },
})

export const {
  setOrders,
  setLoading,
  setError,
  setSelectedOrder,
  addOrder,
  updateOrder,
  updateOrderStatus,
  removeOrder,
} = ordersSlice.actions

export default ordersSlice.reducer 