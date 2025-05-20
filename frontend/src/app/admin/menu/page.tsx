'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { MenuCategory, categoryLabels } from '@/lib/constants'
import { MenuItem } from '@/types'
import { useAuth } from '@/contexts/auth-context'
import AdminNavbar from '@/components/AdminNavbar'
import { useMenu } from '@/hooks/useMenu'
import { useAddMenuItem } from '@/hooks/useAddMenuItem'
import { useUpdateMenuItem } from '@/hooks/useUpdateMenuItem'
import { useDeleteMenuItem } from '@/hooks/useDeleteMenuItem'

export default function MenuPage() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId;
  const tableId = '';
  const { data: menuItems, isLoading, refetch } = useMenu(restaurantId || '', tableId);
  const { mutate: addMenuItem } = useAddMenuItem();
  const { mutate: updateMenuItem } = useUpdateMenuItem();
  const { mutate: deleteMenuItem } = useDeleteMenuItem();
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: MenuCategory.MAIN_COURSE,
    image: '',
    isAvailable: true
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!restaurantId) return;
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        isAvailable: formData.isAvailable,
        restaurantId: restaurantId
      }
      if (editingItem) {
        await updateMenuItem(restaurantId, editingItem.id, payload)
        toast.success('Menu item updated')
      } else {
        await addMenuItem(restaurantId, payload)
        toast.success('Menu item added')
      }
      setIsDialogOpen(false)
      refetch()
      resetForm()
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast.error('Failed to save menu item')
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isAvailable: item.isAvailable,
      image: item.image || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!restaurantId) return;
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      await deleteMenuItem(restaurantId, id)
      toast.success('Menu item deleted')
      refetch()
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('Failed to delete menu item')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: MenuCategory.MAIN_COURSE,
      isAvailable: true,
      image: ''
    })
    setEditingItem(null)
  }

  if (!user) {
    return <div>Please log in as a restaurant admin.</div>
  }

  return (
    <>
    <AdminNavbar />
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as MenuCategory })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, isAvailable: checked })}
                />
                <Label htmlFor="isAvailable">Available</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems?.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">${item.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">{categoryLabels[item.category as MenuCategory]}</span>
                </div>
                <div className="mt-2">
                  <span className={`text-sm ${item.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {item.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </>
  )
} 