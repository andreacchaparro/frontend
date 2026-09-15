import { useQuery } from '@tanstack/react-query'
import { reglasService } from '@/services/reglas.service'

export function useReglaDetalle(codigo: string | null) {
  return useQuery({
    queryKey: ['regla-detalle', codigo],
    queryFn: () => reglasService.getDetalleRegla(codigo as string),
    enabled: codigo != null,
  })
}
