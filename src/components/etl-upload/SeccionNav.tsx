import { useEtlUploadStore } from '@/store/useEtlUploadStore'
import { contarColumnasSinMapear, seccionBloqueada, seccionesDisponibles, SIN_MAPEAR_ORDEN } from '@/utils/etlMapeo'

export function SeccionNav() {
  const { columnas, mapeoSeleccion, camposDestino, seccionIdx, seccionesGuardadas, setSeccionIdx } =
    useEtlUploadStore()

  if (!camposDestino) return null

  const secciones = seccionesDisponibles(camposDestino.grupos)
  const nSinMapear = contarColumnasSinMapear(columnas, mapeoSeleccion)

  return (
    <div className="flex gap-2 flex-wrap px-1">
      {secciones.map((s) => {
        const bloqueada = seccionBloqueada(s.orden, camposDestino.grupos, seccionesGuardadas)
        const hecha = seccionesGuardadas.has(s.orden) && s.orden !== seccionIdx
        const activa = s.orden === seccionIdx
        const icono = bloqueada ? '🔒' : hecha ? '✓' : s.icono
        const badge = s.orden === SIN_MAPEAR_ORDEN && nSinMapear ? ` (${nSinMapear} sin mapear)` : ''
        return (
          <button
            key={s.orden}
            type="button"
            disabled={bloqueada}
            onClick={() => setSeccionIdx(s.orden)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              activa
                ? 'bg-brand-teal text-white border-brand-teal'
                : hecha
                  ? 'bg-brand-teal-light dark:bg-brand-teal/10 text-brand-teal-dark dark:text-brand-teal-bright border-brand-teal/40'
                  : bloqueada
                    ? 'bg-surface text-fg-subtle border-border cursor-not-allowed opacity-60'
                    : 'bg-panel text-fg-muted border-border hover:text-fg'
            }`}
          >
            {icono} {s.nombre}
            {badge}
          </button>
        )
      })}
    </div>
  )
}
