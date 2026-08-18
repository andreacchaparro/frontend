import { useQuery } from '@tanstack/react-query'
import { geoService } from '@/services/geo.service'
import type { GeoNivel, GeoResumenFilters } from '@/types'

export function useResumenGeo(nivel: GeoNivel, filters: GeoResumenFilters, enabled = true) {
  return useQuery({
    queryKey: ['resumen-geo', nivel, filters],
    queryFn: () => geoService.getResumen(nivel, filters),
    staleTime: 5 * 60 * 1000,
    enabled,
  })
}
