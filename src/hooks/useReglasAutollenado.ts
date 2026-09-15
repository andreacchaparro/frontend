import { useQuery } from '@tanstack/react-query'
import { reglasService } from '@/services/reglas.service'
import type { ReglaAutollenado } from '@/types'

// Reglas sin cargar no bloquean la vista de datos (ver etl-datos.html original):
// ante un error, react-query deja `data` undefined y el consumidor trata
// eso como "sin reglas disponibles".
export function useReglasAutollenado() {
  return useQuery({
    queryKey: ['reglas-autollenado'],
    queryFn: () => reglasService.listReglasAutollenado(),
    select: (reglas): Record<string, ReglaAutollenado> => {
      const porCampo: Record<string, ReglaAutollenado> = {}
      reglas.forEach((r) => {
        porCampo[`${r.modelo_destino}.${r.campo_destino}`] = r
      })
      return porCampo
    },
    retry: false,
  })
}
