import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './auth/AuthSlice'
import menuReducer from './menu/MenuSlice'
import ordersReducer from './orders/OrdersSlice'
import cartReducer from './cart/CartSlice'
import pusherReducer from './pusher/PusherSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  orders: ordersReducer,
  cart: cartReducer,
  pusher: pusherReducer,
  // Add other reducers here
})

export default rootReducer 