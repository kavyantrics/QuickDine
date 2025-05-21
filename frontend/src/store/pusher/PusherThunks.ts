import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import {
  setConnected,
  setChannel,
  clearChannel,
  setError,
} from './PusherSlice'
import { SubscribeToChannelData } from './Types'
import Pusher from 'pusher-js'

let pusherInstance: Pusher | null = null

// Initialize Pusher
export const initializePusher = createAsyncThunk<
  void,
  { key: string; cluster: string },
  { dispatch: AppDispatch }
>('pusher/initialize', async ({ key, cluster }, { dispatch }) => {
  try {
    if (pusherInstance) {
      pusherInstance.disconnect()
    }

    pusherInstance = new Pusher(key, {
      cluster,
      enabledTransports: ['ws', 'wss'],
      forceTLS: true,
      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pusher/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    })

    pusherInstance.connection.bind('state_change', (states: { current: string }) => {
      dispatch(setConnected(states.current === 'connected'))
    })

    pusherInstance.connection.bind('error', (error: Error) => {
      dispatch(setError(error.message))
    })

    await pusherInstance.connect()
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to initialize Pusher'))
    throw error
  }
})

// Subscribe to channel
export const subscribeToChannel = createAsyncThunk<
  void,
  SubscribeToChannelData,
  { dispatch: AppDispatch }
>('pusher/subscribe', async ({ channelName, eventName, callback }, { dispatch }) => {
  try {
    if (!pusherInstance) {
      throw new Error('Pusher not initialized')
    }

    const channel = pusherInstance.subscribe(channelName)
    channel.bind(eventName, callback)
    dispatch(setChannel({ name: channelName, channel }))
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to subscribe to channel'))
    throw error
  }
})

// Unsubscribe from channel
export const unsubscribeFromChannel = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch }
>('pusher/unsubscribe', async (channelName, { dispatch }) => {
  try {
    dispatch(clearChannel(channelName))
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to unsubscribe from channel'))
    throw error
  }
})

// Disconnect Pusher
export const disconnectPusher = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch }
>('pusher/disconnect', async (_, { dispatch }) => {
  try {
    if (pusherInstance) {
      pusherInstance.disconnect()
      pusherInstance = null
    }
    dispatch(setConnected(false))
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to disconnect Pusher'))
    throw error
  }
}) 