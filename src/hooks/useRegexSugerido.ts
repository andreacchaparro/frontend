import { useMutation } from '@tanstack/react-query'
import { etlService } from '@/services/etl.service'

// Se pide bajo demanda (al activar el toggle "aplicar regex"), no como
// query automática — solo tiene sentido una vez, al abrir el campo vacío.
export function useRegexSugerido() {
  return useMutation({
    mutationFn: ({ fuenteId, modelo, campo }: { fuenteId: number; modelo: string; campo: string }) =>
      etlService.getRegexSugerido(fuenteId, modelo, campo),
  })
}
