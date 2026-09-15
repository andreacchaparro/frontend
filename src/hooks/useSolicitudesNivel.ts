import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { solicitudesNivelService } from '@/services/solicitudesNivel.service'
import { useAuthStore } from '@/store/useAuthStore'
import type { SolicitudNivelPayload } from '@/types'

export function useSolicitudesNivel() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['solicitudes-nivel', token],
    queryFn: () => solicitudesNivelService.listar(token as string),
    enabled: !!token,
  })
}

export function useCrearSolicitudNivel() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SolicitudNivelPayload) => solicitudesNivelService.crear(token as string, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solicitudes-nivel'] }),
  })
}

export function useResolverSolicitudNivel() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: 'aprobada' | 'rechazada' }) =>
      solicitudesNivelService.resolver(token as string, id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes-nivel'] })
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}
