import { Order } from '@/types'
import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  status: Order['status']
}

const statusConfig: Record<Order['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  PREPARING: { label: 'Preparing', variant: 'default' },
  READY: { label: 'Ready', variant: 'outline' },
  COMPLETED: { label: 'Completed', variant: 'destructive' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
} 