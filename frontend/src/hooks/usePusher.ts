import { useEffect } from 'react'
import { pusher } from '@/lib/pusher'
import { Order } from '@/types'

interface UsePusherProps {
  channel: string
  event: string
  onEvent: (data: Order) => void
}

export function usePusher({ channel, event, onEvent }: UsePusherProps) {
  useEffect(() => {
    const pusherChannel = pusher.subscribe(channel)

    pusherChannel.bind(event, onEvent)

    return () => {
      pusherChannel.unbind(event, onEvent)
      pusher.unsubscribe(channel)
    }
  }, [channel, event, onEvent])
} 