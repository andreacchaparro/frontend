import { useQuery } from '@tanstack/react-query'
import { mapeoService } from '@/services/mapeo.service'

export function useMapeoCarga(fuenteId: number | null, cargaId: number | null) {
  return useQuery({
    queryKey: ['mapeo-carga', fuenteId, cargaId],
    queryFn: () => mapeoService.getMapeoCarga(fuenteId as number, cargaId as number),
    enabled: fuenteId != null && cargaId != null,
  })
}
