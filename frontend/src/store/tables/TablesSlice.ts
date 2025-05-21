import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Table } from '@/types'
import { ApiState } from '../types'

interface TablesState extends ApiState<Table[]> {
  selectedTable: Table | null
}

const initialState: TablesState = {
  data: null,
  error: null,
  isLoading: false,
  selectedTable: null,
}

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setTables: (state, action: PayloadAction<Table[]>) => {
      state.data = action.payload
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    setSelectedTable: (state, action: PayloadAction<Table | null>) => {
      state.selectedTable = action.payload
    },
    addTable: (state, action: PayloadAction<Table>) => {
      if (state.data) {
        state.data.push(action.payload)
      }
    },
    updateTable: (state, action: PayloadAction<Table>) => {
      if (state.data) {
        const index = state.data.findIndex(table => table.id === action.payload.id)
        if (index !== -1) {
          state.data[index] = action.payload
        }
      }
    },
    removeTable: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data = state.data.filter(table => table.id !== action.payload)
      }
    },
  },
})

export const {
  setTables,
  setLoading,
  setError,
  setSelectedTable,
  addTable,
  updateTable,
  removeTable,
} = tablesSlice.actions

export default tablesSlice.reducer 