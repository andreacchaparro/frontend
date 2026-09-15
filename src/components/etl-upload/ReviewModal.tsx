import { useEtlUploadStore } from '@/store/useEtlUploadStore'
import { HorasPanel } from './HorasPanel'
import { NulosPanel } from './NulosPanel'

interface Props {
  idx: number
  onClose: () => void
}

export function ReviewModal({ idx, onClose }: Props) {
  const { columnas, mapeoSeleccion, mapeoValores, camposDestino, ultimosErroresPorColumna } = useEtlUploadStore()
  const col = columnas[idx]
  const seleccion = mapeoSeleccion[idx]
  const erroresPrevios = ultimosErroresPorColumna[col.nombre] ?? []

  const campoMeta = seleccion?.modelo
    ? camposDestino?.modelos[seleccion.modelo]?.find((c) => c.nombre === seleccion.campo)
    : undefined
  const esTimeField = campoMeta?.tipo_raw === 'TimeField'
  const interpretaciones = col.interpretaciones_hora ?? {}
  const valoresUnicos = col.valores_unicos ?? []

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-panel border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-3 border-b border-border flex items-center justify-between">
          <h3 className="text-base font-bold text-fg">
            Revisión — {col.nombre}
            {seleccion?.campo && (
              <span className="text-fg-muted font-normal">
                {' '}
                → {seleccion.modelo}.{seleccion.campo}
              </span>
            )}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-fg-muted hover:text-fg hover:bg-surface rounded-md p-1 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {erroresPrevios.length > 0 && (
            <div className="border border-red-500 rounded-lg p-3">
              <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1.5">
                ✗ {erroresPrevios.length} error(es) en la última validación
              </p>
              {erroresPrevios.slice(0, 20).map((e, i) => (
                <p key={i} className="text-xs text-fg-muted mt-1">
                  Fila {e.fila ?? '?'}: {e.mensaje || e.tipo}
                </p>
              ))}
              {erroresPrevios.length > 20 && (
                <p className="text-xs text-fg-muted mt-1">… y {erroresPrevios.length - 20} más</p>
              )}
            </div>
          )}

          <HorasPanel idx={idx} />
          <NulosPanel idx={idx} />

          {esTimeField && Object.keys(interpretaciones).length > 0 ? (
            <div className="border border-border rounded-lg p-3">
              <p className="text-xs font-bold text-fg mb-2">🕐 Cómo quedarán estos valores (formato 24h)</p>
              <div className="max-h-56 overflow-y-auto flex flex-col">
                {Object.entries(interpretaciones).map(([origen, interpretacionBase]) => {
                  const valorFinal = mapeoValores[idx]?.[origen] ?? interpretacionBase
                  return (
                    <div key={origen} className="flex gap-2 py-1 border-b border-border text-xs">
                      <span className="flex-1 text-fg-muted">{origen}</span>
                      <span className="text-fg-subtle">→</span>
                      <span className="flex-1 font-semibold text-fg">{valorFinal}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            valoresUnicos.length > 0 && (
              <div className="border border-border rounded-lg p-3">
                <p className="text-xs font-bold text-fg mb-2">
                  📋 Valores posibles en la columna ({valoresUnicos.length}
                  {valoresUnicos.length >= 50 ? '+' : ''})
                </p>
                <p className="text-xs text-fg-muted max-h-40 overflow-y-auto">{valoresUnicos.join(', ')}</p>
              </div>
            )
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-bold px-4 py-2 rounded-md transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
