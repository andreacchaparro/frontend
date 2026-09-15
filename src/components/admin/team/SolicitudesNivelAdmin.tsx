import { useSolicitudesNivel, useResolverSolicitudNivel } from '@/hooks/useSolicitudesNivel'
import type { NivelAcceso } from '@/types'

const NOMBRES_NIVEL: Record<NivelAcceso, string> = {
  ciudadano: 'Ciudadano',
  investigador: 'Investigador',
  reportador: 'Reportador',
  admin: 'Administrador',
}

export function SolicitudesNivelAdmin() {
  const { data: solicitudes, isLoading } = useSolicitudesNivel()
  const resolver = useResolverSolicitudNivel()

  const pendientes = (solicitudes ?? []).filter((s) => s.estado === 'pendiente')

  if (isLoading) return <p className="text-sm text-fg-muted">Cargando solicitudes…</p>
  if (pendientes.length === 0) return <p className="text-sm text-fg-muted">No hay solicitudes pendientes.</p>

  return (
    <div className="flex flex-col gap-3">
      {pendientes.map((s) => (
        <div
          key={s.id}
          className="bg-surface border border-border rounded-md px-4 py-3 flex items-start justify-between gap-4 flex-wrap"
        >
          <div>
            <p className="text-sm font-semibold text-fg">
              {s.usuario_nombre} — {NOMBRES_NIVEL[s.nivel_actual]} → {NOMBRES_NIVEL[s.nivel_solicitado]}
            </p>
            {s.motivo && <p className="text-xs text-fg-muted mt-1">{s.motivo}</p>}
            <p className="text-[10px] text-fg-subtle mt-1">
              {new Date(s.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => resolver.mutate({ id: s.id, estado: 'rechazada' })}
              disabled={resolver.isPending}
              className="bg-panel border border-border text-fg-muted hover:text-fg disabled:opacity-50 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
            >
              Rechazar
            </button>
            <button
              onClick={() => resolver.mutate({ id: s.id, estado: 'aprobada' })}
              disabled={resolver.isPending}
              className="bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-colors"
            >
              Aprobar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
