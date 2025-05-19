import { useEffect } from 'react'
import { usePusher as usePusherContext } from '@/contexts/pusher-context'
import { Order } from '@/types'

interface UsePusherProps {
  channel: string
  event: string
  onEvent: (data: Order) => void
}

export function usePusher({ channel, event, onEvent }: UsePusherProps) {
  const { pusher, isConnected } = usePusherContext()

  useEffect(() => {
    if (!pusher || !isConnected) return

    const pusherChannel = pusher.subscribe(channel)
    pusherChannel.bind(event, onEvent)

    return () => {
      pusherChannel.unbind(event, onEvent)
      pusher.unsubscribe(channel)
    }
  }, [pusher, isConnected, channel, event, onEvent])
} 