import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reglasService } from '@/services/reglas.service'

export function useActualizarParametrosRegla(codigo: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (parametros: Record<string, string>) =>
      reglasService.actualizarParametrosRegla(codigo, parametros),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regla-detalle', codigo] })
    },
  })
}

export function useAplicarRegla(codigo: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => reglasService.aplicarRegla(codigo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regla-detalle', codigo] })
    },
  })
}

export function useDeshacerLoteRegla(codigo: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lote: string) => reglasService.deshacerLoteRegla(lote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regla-detalle', codigo] })
    },
  })
}
