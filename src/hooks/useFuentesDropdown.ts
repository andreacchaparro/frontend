import { useQuery } from '@tanstack/react-query'
import { fuentesService } from '@/services/fuentes.service'

export function useFuentesDropdown(proyectoId?: number | null) {
  return useQuery({
    queryKey: ['fuentes-dropdown', proyectoId ?? null],
    queryFn: () => fuentesService.listFuentesDropdown(proyectoId ?? undefined),
  })
}
