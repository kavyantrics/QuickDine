'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import AdminNavbar from '@/components/AdminNavbar'
import { Table } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
  fetchTables,
  addTableThunk,
  updateTableThunk,
  deleteTableThunk,
} from '@/store/tables/TablesThunks'

export default function TablesPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { data: tables, isLoading, error } = useAppSelector((state) => state.tables)
  const restaurantId = user?.restaurantId || ''
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [formData, setFormData] = useState({
    number: '',
    capacity: 4,
    status: 'available'
  })

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchTables(restaurantId))
    }
  }, [dispatch, restaurantId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (editingTable) {
        await dispatch(updateTableThunk({
          restaurantId,
          tableId: editingTable.id,
          data: formData
        })).unwrap()
        toast.success('Table updated')
      } else {
        await dispatch(addTableThunk({
          restaurantId,
          data: formData
        })).unwrap()
        toast.success('Table added')
      }
      setIsDialogOpen(false)
      resetForm()
    } catch {
      toast.error('Failed to save table')
    }
  }

  const handleEdit = (table: Table) => {
    setEditingTable(table)
    setFormData({
      number: table.number,
      capacity: table.capacity,
      status: table.status
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return
    try {
      await dispatch(deleteTableThunk({ restaurantId, tableId: id })).unwrap()
      toast.success('Table deleted')
    } catch {
      toast.error('Failed to delete table')
    }
  }

  const resetForm = () => {
    setFormData({
      number: '',
      capacity: 4,
      status: 'available'
    })
    setEditingTable(null)
  }

  if (!user) {
    return <div>Please log in as a restaurant admin.</div>
  }

  if (isLoading) {
    return <div>Loading tables...</div>
  }

  if (error) {
    return <div>Error loading tables: {error}</div>
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Table Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTable ? 'Edit Table' : 'Add Table'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1">Table Number</label>
                  <Input
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Capacity</label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTable ? 'Update' : 'Add'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables?.map((table) => (
            <Card key={table.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Table {table.number}</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(table)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(table.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    Capacity: {table.capacity} people
                  </p>
                  <p className={`text-sm ${
                    table.status === 'available' ? 'text-green-500' :
                    table.status === 'occupied' ? 'text-red-500' :
                    'text-yellow-500'
                  }`}>
                    Status: {table.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
} 