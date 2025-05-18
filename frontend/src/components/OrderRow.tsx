import { Order } from '@/types'
import { TableCell, TableRow } from '@/components/ui/table'

interface OrderRowProps {
  item: Order['items'][0]
}

export function OrderRow({ item }: OrderRowProps) {
  return (
    <TableRow>
      <TableCell>{item.menuItem.name}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell className="text-right">
        ${(item.menuItem.price * item.quantity).toFixed(2)}
      </TableCell>
    </TableRow>
  )
} 