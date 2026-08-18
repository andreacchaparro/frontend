import { create } from 'zustand'
import type { FilterState, GasType, GeoDrillEntity, MapViewMode } from '@/types'

interface AppStore {
  filters: FilterState
  setYear: (year: number | null) => void
  setGas: (gas: GasType) => void
  setProyecto: (proyectoId: number | null) => void

  // Drill-down geográfico compartido entre el panel de filtros y el mapa
  // (departamento → municipio → vereda), para que ambos queden sincronizados.
  mapViewMode: MapViewMode
  departamento: GeoDrillEntity | null
  municipio: GeoDrillEntity | null
  vereda: GeoDrillEntity | null
  setMapViewMode: (mode: MapViewMode) => void
  setDepartamento: (departamento: GeoDrillEntity | null) => void
  setMunicipio: (municipio: GeoDrillEntity | null) => void
  setVereda: (vereda: GeoDrillEntity | null) => void
  resetDrill: () => void
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

  mapViewMode: 'sitios',
  departamento: null,
  municipio: null,
  vereda: null,
  setMapViewMode: (mapViewMode) => set({ mapViewMode }),
  // Elegir un departamento/municipio nuevo descarta la selección de los
  // niveles hijos, que ya no aplican.
  setDepartamento: (departamento) =>
    set({ departamento, municipio: null, vereda: null, mapViewMode: 'regiones' }),
  setMunicipio: (municipio) => set({ municipio, vereda: null, mapViewMode: 'regiones' }),
  setVereda: (vereda) => set({ vereda, mapViewMode: 'regiones' }),
  resetDrill: () => set({ departamento: null, municipio: null, vereda: null }),
}))
