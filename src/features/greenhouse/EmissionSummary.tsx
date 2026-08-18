import { useMemo } from 'react'
import { useSitios } from '@/hooks/useSitios'
import { useSeries } from '@/hooks/useSeries'
import { useAppStore } from '@/store/useAppStore'
import { GAS_COLORS } from '@/utils/formatters'
import type { GasType } from '@/types'

const GAS_LIST = ['CO2', 'CH4', 'N2O'] as const

export function EmissionSummary() {
  const { data: sitios } = useSitios()
  // Total combinado (todos los gases), independiente del gas seleccionado
  // en el filtro -ese filtro solo afecta al mapa y la gráfica de tendencia-.
  const { data: series, isLoading } = useSeries({ gas: undefined })
  const { filters } = useAppStore()

  const muestrasPorGas = useMemo(() => {
    const totales: Partial<Record<GasType, number>> = {}
    sitios?.features.forEach((f) => {
      Object.entries(f.properties.resumen_por_gas ?? {}).forEach(([gas, resumen]) => {
        totales[gas as GasType] = (totales[gas as GasType] ?? 0) + resumen.total_muestras
      })
    })
    return totales
  }, [sitios])

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
          const count = muestrasPorGas[gas] ?? null
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
