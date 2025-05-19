'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Pusher, { Channel } from 'pusher-js'

interface PusherContextType {
  pusher: Pusher | null
  isConnected: boolean
  subscribe: (channel: string) => Channel | null
}

const PusherContext = createContext<PusherContextType>({
  pusher: null,
  isConnected: false,
  subscribe: () => null,
})

export function PusherProvider({ children }: { children: React.ReactNode }) {
  const [pusher, setPusher] = useState<Pusher | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      enabledTransports: ['ws', 'wss'],
      forceTLS: true,
    })

    const handleStateChange = (states: { current: string; previous: string }) => {
      setIsConnected(states.current === 'connected')
    }

    pusherClient.connection.bind('state_change', handleStateChange)
    pusherClient.connection.bind('connected', () => {
      setIsConnected(true)
    })
    pusherClient.connection.bind('disconnected', () => {
      setIsConnected(false)
    })
    pusherClient.connection.bind('error', (error: Error) => {
      console.error('Pusher connection error:', error)
      setIsConnected(false)
    })

    setPusher(pusherClient)

    return () => {
      pusherClient.connection.unbind('state_change', handleStateChange)
      pusherClient.connection.unbind('connected')
      pusherClient.connection.unbind('disconnected')
      pusherClient.connection.unbind('error')
      pusherClient.disconnect()
    }
  }, [])

  const subscribe = (channel: string) => {
    if (!pusher || !isConnected) {
      return null
    }
    return pusher.subscribe(channel)
  }

  return (
    <PusherContext.Provider value={{ pusher, isConnected, subscribe }}>
      {children}
    </PusherContext.Provider>
  )
}

export const usePusher = () => useContext(PusherContext) 