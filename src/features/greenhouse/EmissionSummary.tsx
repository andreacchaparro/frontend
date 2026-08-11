import { useSitios } from '@/hooks/useSitios'
import { useSeries } from '@/hooks/useSeries'
import { useAppStore } from '@/store/useAppStore'
import { GAS_COLORS } from '@/utils/formatters'

const GAS_LIST = ['CO2', 'CH4', 'N2O'] as const

export function EmissionSummary() {
  const { data: sitios } = useSitios()
  const { data: series, isLoading } = useSeries()
  const { filters } = useAppStore()

  const proyecto = filters.proyectoId
    ? sitios?.features
        .flatMap((f) => f.properties.proyectos)
        .find((p) => p.id === filters.proyectoId)
    : null

  const totalMuestras = series?.count ?? 0
  const sitiosActivos = sitios?.features.length ?? 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-fg-muted">
          {proyecto ? proyecto.nombre : 'Nacional'} · {filters.year ?? 'Todos los años'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface rounded-md p-3 text-center border border-border">
          <p className="text-2xl font-bold text-fg">{isLoading ? '…' : totalMuestras}</p>
          <p className="text-xs text-fg-muted mt-1">muestras registradas</p>
        </div>
        <div className="bg-surface rounded-md p-3 text-center border border-border">
          <p className="text-2xl font-bold text-fg">{sitiosActivos}</p>
          <p className="text-xs text-fg-muted mt-1">sitios activos</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {GAS_LIST.map((gas) => {
          const count = gas === 'CO2' ? totalMuestras : null
          return (
            <div key={gas} className="bg-surface rounded-md p-2 text-center border border-border">
              <p className="text-xs font-semibold mb-1" style={{ color: GAS_COLORS[gas] }}>
                {gas}
              </p>
              <p className="text-sm font-bold text-fg">
                {count == null ? 'Sin datos' : isLoading ? '…' : count}
              </p>
              <p className="text-xs text-fg-subtle">{count == null ? '' : 'muestras'}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
