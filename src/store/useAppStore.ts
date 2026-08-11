import { create } from 'zustand'
import type { FilterState, GasType } from '@/types'

interface AppStore {
  filters: FilterState
  setYear: (year: number | null) => void
  setGas: (gas: GasType) => void
  setProyecto: (proyectoId: number | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
  filters: {
    year: null,
    gas: 'CO2',
    proyectoId: null,
  },
  setYear: (year) => set((s) => ({ filters: { ...s.filters, year } })),
  setGas: (gas) => set((s) => ({ filters: { ...s.filters, gas } })),
  setProyecto: (proyectoId) => set((s) => ({ filters: { ...s.filters, proyectoId } })),
}))
