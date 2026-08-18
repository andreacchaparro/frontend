import { useQuery } from '@tanstack/react-query'
import { geoService } from '@/services/geo.service'
import { useAppStore } from '@/store/useAppStore'
import type { SeriesFilters } from '@/types'

export function useSeries(overrides: SeriesFilters = {}) {
  const { year, gas, proyectoId } = useAppStore((s) => s.filters)

  const filters: SeriesFilters = {
    anio: year ?? undefined,
    gas,
    proyecto: proyectoId ?? undefined,
    ...overrides,
  }

  return useQuery({
    queryKey: ['series', filters],
    queryFn: () => geoService.getSeries(filters),
  })
}
