import type { FilterState, GeoResumenFilters } from '@/types'

// El selector "Año" del panel de filtros se traduce al rango desde/hasta que
// espera /api/geo/resumen/ (no hay un date-range picker separado).
export function buildGeoResumenBaseFilters(filters: FilterState): GeoResumenFilters {
  const f: GeoResumenFilters = { gas: filters.gas }
  if (filters.year != null) {
    f.desde = `${filters.year}-01-01`
    f.hasta = `${filters.year}-12-31`
  }
  if (filters.proyectoId != null) f.proyecto = filters.proyectoId
  return f
}
