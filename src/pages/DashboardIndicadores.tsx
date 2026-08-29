import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '@/components/common/Card'
import { EmissionBarChart } from '@/components/charts/EmissionBarChart'
import { EmissionTrendChart } from '@/components/charts/EmissionTrendChart'
import { useSitios } from '@/hooks/useSitios'
import { useSeries } from '@/hooks/useSeries'
import { useResumenGeo } from '@/hooks/useResumenGeo'
import { useThemeStore } from '@/store/useThemeStore'

const TOTAL_DEPARTAMENTOS_COLOMBIA = 33

const PIE_COLORS = ['#15803d', '#22c55e', '#86efac', '#facc15', '#f59e0b', '#94a3b8']

export function DashboardIndicadores() {
  const { data: sitios, isLoading: sitiosLoading } = useSitios()
  const { data: series, isLoading: seriesLoading } = useSeries({ gas: undefined })
  const { data: departamentosData } = useResumenGeo('departamento', {})
  const isDark = useThemeStore((s) => s.theme === 'dark')

  const usoDistribucion = useMemo(() => {
    const counts = new Map<string, number>()
    sitios?.features.forEach((f) => {
      const key = f.properties.uso_actual || 'Sin especificar'
      counts.set(key, (counts.get(key) ?? 0) + 1)
    })
    return [...counts.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [sitios])

  const departamentosConDatos = departamentosData?.features.length ?? 0
  const coberturaPct = Math.round((departamentosConDatos / TOTAL_DEPARTAMENTOS_COLOMBIA) * 100)
  const coberturaData = [
    { name: 'Con datos', value: departamentosConDatos },
    { name: 'Sin datos', value: Math.max(TOTAL_DEPARTAMENTOS_COLOMBIA - departamentosConDatos, 0) },
  ]

  const sitiosActivos = sitios?.features.length ?? 0
  const totalMuestras = series?.count ?? 0
  const proyectosActivos = useMemo(() => {
    const ids = new Set<number>()
    sitios?.features.forEach((f) => f.properties.proyectos.forEach((p) => ids.add(p.id)))
    return ids.size
  }, [sitios])

  const tickColor = isDark ? '#94a3b8' : '#64748b'

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-xl font-bold text-fg">Resumen de carbono</h1>
        <p className="text-sm text-fg-muted mt-1">
          Indicadores agregados a partir de los datos disponibles en la plataforma.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-2xl font-bold text-fg">
            {seriesLoading ? '…' : totalMuestras.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-fg-muted mt-1">Muestras registradas</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-fg">{sitiosLoading ? '…' : sitiosActivos}</p>
          <p className="text-xs text-fg-muted mt-1">Sitios monitoreados</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-fg">{sitiosLoading ? '…' : proyectosActivos}</p>
          <p className="text-xs text-fg-muted mt-1">Proyectos activos</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-fg">{coberturaPct}%</p>
          <p className="text-xs text-fg-muted mt-1">Cobertura del territorio</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Muestras por proyecto">
          <EmissionBarChart />
        </Card>
        <Card title="Tendencia de mediciones">
          <EmissionTrendChart />
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Distribución por uso del sitio">
          {usoDistribucion.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={usoDistribucion} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {usoDistribucion.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11, color: tickColor }} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1e293b' : '#ffffff',
                    border: `1px solid ${isDark ? '#334155' : '#e2e8e4'}`,
                    borderRadius: 6,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-fg-subtle text-sm">
              Sin datos
            </div>
          )}
        </Card>

        <Card title="Cobertura de datos">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={coberturaData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                <Cell fill="#15803d" />
                <Cell fill={isDark ? '#334155' : '#e2e8e4'} />
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11, color: tickColor }} />
              <Tooltip
                contentStyle={{
                  background: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8e4'}`,
                  borderRadius: 6,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-fg-muted text-center mt-1">
            {departamentosConDatos} de {TOTAL_DEPARTAMENTOS_COLOMBIA} departamentos con datos
          </p>
        </Card>
      </div>
    </div>
  )
}
