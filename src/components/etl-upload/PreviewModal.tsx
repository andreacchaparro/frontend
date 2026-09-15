import type { DetalleModeloPreview } from '@/types'

interface Props {
  open: boolean
  tituloSeccion: string
  detalle: Record<string, DetalleModeloPreview>
  ordenModelo: (modelo: string) => number
  loading?: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export function PreviewModal({
  open,
  tituloSeccion,
  detalle,
  ordenModelo,
  loading = false,
  onConfirmar,
  onCancelar,
}: Props) {
  if (!open) return null

  const modelos = Object.keys(detalle)
    .filter((m) => detalle[m].registros.length > 0)
    .sort((a, b) => ordenModelo(a) - ordenModelo(b))

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4" onClick={onCancelar}>
      <div
        className="bg-panel border border-border rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-3 border-b border-border">
          <h3 className="text-base font-bold text-fg">Vista previa — {tituloSeccion}</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
          {modelos.length === 0 ? (
            <p className="text-sm text-fg-muted">
              Esta sección no crea ni reutiliza registros con los mapeos actuales.
            </p>
          ) : (
            modelos.map((modelo) => {
              const info = detalle[modelo]
              const columnas: string[] = []
              info.registros.forEach((r) =>
                Object.keys(r.campos).forEach((c) => {
                  if (!columnas.includes(c)) columnas.push(c)
                })
              )
              return (
                <div key={modelo}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-fg">{modelo}</span>
                    <span className="text-xs text-fg-muted">
                      {info.total} registro{info.total === 1 ? '' : 's'} · {info.creados} nuevo
                      {info.creados === 1 ? '' : 's'}, {info.reutilizados} reutilizado
                      {info.reutilizados === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-border rounded-lg">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-surface">
                          <th className="px-2.5 py-1.5" />
                          {columnas.map((c) => (
                            <th key={c} className="px-2.5 py-1.5 text-left font-bold text-fg-muted">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {info.registros.map((r, i) => (
                          <tr key={i} className="border-t border-border">
                            <td className="px-2.5 py-1.5">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                  r.accion === 'creado'
                                    ? 'bg-brand-teal-light dark:bg-brand-teal/10 text-brand-teal-dark dark:text-brand-teal-bright'
                                    : 'bg-surface text-fg-muted'
                                }`}
                              >
                                {r.accion === 'creado' ? '➕ nuevo' : '♻️ existente'}
                              </span>
                            </td>
                            {columnas.map((c) => (
                              <td key={c} className="px-2.5 py-1.5 text-fg" title={String(r.campos[c] ?? '')}>
                                {r.campos[c] != null ? String(r.campos[c]) : '—'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {info.truncado && (
                    <p className="text-xs text-fg-muted mt-1">
                      Mostrando los primeros {info.registros.length} de {info.total} registros.
                    </p>
                  )}
                </div>
              )
            })
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancelar}
            disabled={loading}
            className="bg-surface border border-border text-fg-muted hover:text-fg disabled:opacity-50 text-sm font-semibold px-4 py-2 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={loading}
            className="bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-md transition-colors"
          >
            {loading ? 'Guardando…' : 'Confirmar e importar'}
          </button>
        </div>
      </div>
    </div>
  )
}
