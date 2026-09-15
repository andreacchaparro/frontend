import { useMutation } from '@tanstack/react-query'
import { etlService } from '@/services/etl.service'
import { useEtlUploadStore } from '@/store/useEtlUploadStore'
import { construirMapeos } from '@/utils/etlMapeo'

// Persiste el mapeo actual sin previsualizar/importar (parcial=true) — el
// wizard puede retomarse más tarde con lo mapeado hasta ahora.
export function useGuardarAvance() {
  return useMutation({
    mutationFn: () => {
      const { fuenteId, cargaId, columnas, mapeoSeleccion, mapeoValores, atributosManuales, extrasDestino } =
        useEtlUploadStore.getState()
      if (fuenteId == null || cargaId == null) throw new Error('Falta la fuente o la carga.')
      const mapeos = construirMapeos(columnas, mapeoSeleccion, mapeoValores, atributosManuales, extrasDestino)
      return etlService.postMapeo(fuenteId, cargaId, mapeos, true)
    },
  })
}
