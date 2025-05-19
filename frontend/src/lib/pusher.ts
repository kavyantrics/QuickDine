import Pusher from 'pusher-js'

if (!process.env.NEXT_PUBLIC_PUSHER_APP_KEY) {
  throw new Error('Missing NEXT_PUBLIC_PUSHER_APP_KEY environment variable')
}
 
export const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
  enabledTransports: ['ws', 'wss'],
}) 