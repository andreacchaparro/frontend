import { useQuery } from '@tanstack/react-query'
import { etlService } from '@/services/etl.service'

export function useCamposDestino(fuenteId: number | null) {
  return useQuery({
    queryKey: ['campos-destino', fuenteId],
    queryFn: () => etlService.getCamposDestino(fuenteId),
    enabled: fuenteId != null,
  })
}
