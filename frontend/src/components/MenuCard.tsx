import { MenuItem } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { toast } from 'sonner'
import Image from 'next/image'

interface MenuCardProps {
  item: MenuItem
  onAddToCart: () => void
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(item)
    toast.success(`${item.name} added to cart`)
  }

  return (
    <Card className="h-full flex flex-col">
      {item.image && (
        <div className="aspect-video relative">
          <Image
            src={item.image}
            alt={item.name}
            className="object-cover w-full h-full rounded-t-lg"
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
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">${item.price.toFixed(2)}</span>
          <Button
            onClick={onAddToCart || handleAddToCart}
            disabled={!item.isAvailable}
            size="sm"
            className="w-full"
          >
            {item.isAvailable ? 'Add to Cart' : 'Not Available'}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        {item.description && (
          <p className="text-sm text-muted-foreground">
            {item.description}
          </p>
        )}
      </CardFooter>
    </Card>
  )
} 