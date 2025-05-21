import { Channel } from 'pusher-js'

export interface PusherState {
  isConnected: boolean
  channels: Record<string, Channel>
  error: string | null
}

export interface SubscribeToChannelData {
  channelName: string
  eventName: string
  callback: (data: any) => void
} 