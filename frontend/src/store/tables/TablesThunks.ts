import { createAsyncThunk } from '@reduxjs/toolkit'
import { setTables, setLoading, setError, addTable, updateTable, removeTable } from './TablesSlice'
import { Table } from '@/types'
import { api } from '@/lib/api'
import { ApiResponse } from '../types'

// Fetch tables
export const fetchTables = createAsyncThunk(
  'tables/fetch',
  async (restaurantId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await api.get<ApiResponse<Table[]>>(`/tables/restaurant/${restaurantId}`)
      dispatch(setTables(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tables'
      dispatch(setError(errorMessage))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// Add table
export const addTableThunk = createAsyncThunk(
  'tables/add',
  async (
    { restaurantId, data }: { restaurantId: string; data: { number: string; capacity: number; status: string } },
    { dispatch }
  ) => {
    try {
      const response = await api.post<ApiResponse<Table>>('/tables', {
        restaurantId,
        ...data,
      })
      dispatch(addTable(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add table'
      dispatch(setError(errorMessage))
      throw error
    }
  }
)

// Update table
export const updateTableThunk = createAsyncThunk(
  'tables/update',
  async (
    { restaurantId, tableId, data }: { restaurantId: string; tableId: string; data: { number: string; capacity: number; status: string } },
    { dispatch }
  ) => {
    try {
      const response = await api.patch<ApiResponse<Table>>(`/tables/${tableId}`, {
        restaurantId,
        ...data,
      })
      dispatch(updateTable(response.data.data))
      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update table'
      dispatch(setError(errorMessage))
      throw error
    }
  }
)

// Delete table
export const deleteTableThunk = createAsyncThunk(
  'tables/delete',
  async (
    {  tableId }: { restaurantId: string; tableId: string },
    { dispatch }
  ) => {
    try {
      await api.delete(`/tables/${tableId}`)
      dispatch(removeTable(tableId))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete table'
      dispatch(setError(errorMessage))
      throw error
    }
  }
) 