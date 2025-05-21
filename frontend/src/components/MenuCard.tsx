'use client'

import { MenuItem } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/store/hooks'
import { addItem } from '@/store/cart/CartSlice'
import { toast } from 'sonner'
import Image from 'next/image'

interface MenuCardProps {
  item: MenuItem
}

export function MenuCard({ item }: MenuCardProps) {
  const dispatch = useAppDispatch()

  const handleAddToCart = () => {
    dispatch(addItem({ ...item, quantity: 1 }))
    toast.success(`${item.name} added to cart`)
  }

  return (
    <Card className="h-full flex flex-col">
      {item.image && (
        <div className="aspect-video relative">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-t-lg"
            priority={false}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-1">{item.name}</CardTitle>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        )}
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold">${item.price.toFixed(2)}</span>
          <Button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            size="sm"
            className="w-full"
          >
            {item.isAvailable ? 'Add to Cart' : 'Not Available'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 