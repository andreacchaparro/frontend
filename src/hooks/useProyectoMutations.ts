import { useMutation, useQueryClient } from '@tanstack/react-query'
import { proyectosService } from '@/services/proyectos.service'
import type { ProyectoPayload } from '@/types'

export function useCrearProyecto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProyectoPayload) => proyectosService.crearProyecto(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuentes-dropdown'] })
    },
  })
}
