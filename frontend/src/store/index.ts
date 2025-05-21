import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './menu/MenuSlice'
import ordersReducer from './orders/OrdersSlice'
import analyticsReducer from './analytics/AnalyticsSlice'
import authReducer from './auth/AuthSlice'
import cartReducer from './cart/CartSlice'
import restaurantReducer from './restaurant/RestaurantSlice'
import tablesReducer from './tables/TablesSlice'

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    orders: ordersReducer,
    analytics: analyticsReducer,
    auth: authReducer,
    cart: cartReducer,
    restaurant: restaurantReducer,
    tables: tablesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 