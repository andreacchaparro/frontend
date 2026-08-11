import { useQuery } from '@tanstack/react-query'
import { geoService } from '@/services/geo.service'

export function useSitios() {
  return useQuery({
    queryKey: ['sitios'],
    queryFn: () => geoService.getSitios(),
    staleTime: 5 * 60 * 1000,
  })
}
