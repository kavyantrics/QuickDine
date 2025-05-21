import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface PusherState {
  channel: any | null
  isConnected: boolean
  error: string | null
}

const initialState: PusherState = {
  channel: null,
  isConnected: false,
  error: null,
}

const pusherSlice = createSlice({
  name: 'pusher',
  initialState,
  reducers: {
    setChannel: (state, action: PayloadAction<any>) => {
      state.channel = action.payload
      state.isConnected = true
      state.error = null
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    clearChannel: (state) => {
      state.channel = null
      state.isConnected = false
      state.error = null
    },
  },
})

export const { setChannel, setConnected, setError, clearChannel } = pusherSlice.actions
export default pusherSlice.reducer 