import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useSeries } from '@/hooks/useSeries'
import { useAppStore } from '@/store/useAppStore'
import { useThemeStore } from '@/store/useThemeStore'
import { GAS_COLORS } from '@/utils/formatters'

export function EmissionBarChart() {
  const { data: series, isLoading } = useSeries()
  const { filters, setProyecto } = useAppStore()
  const isDark = useThemeStore((s) => s.theme === 'dark')

  const byProyecto = new Map<number, { id: number; name: string; count: number }>()
  series?.resultados.forEach((r) => {
    const entry = byProyecto.get(r.proyecto_id) ?? {
      id: r.proyecto_id,
      name: r.proyecto_nombre,
      count: 0,
    }
    entry.count += 1
    byProyecto.set(r.proyecto_id, entry)
  })
  const chartData = [...byProyecto.values()].sort((a, b) => b.count - a.count)

  const barColor = GAS_COLORS.CO2
  const tickColor = isDark ? '#94a3b8' : '#64748b'
  const selectedFill = isDark ? '#ffffff' : '#0f172a'

  if (isLoading) {
    return (
      <div className="h-48 flex items-center justify-center text-fg-subtle text-sm">
        Cargando…
      </div>
    )
  }

  if (!chartData.length) {
    return (
      <div className="h-48 flex items-center justify-center text-fg-subtle text-sm">
        Sin datos
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 10 }} />
        <YAxis tick={{ fill: tickColor, fontSize: 10 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDark ? '#334155' : '#e2e8e4'}`,
            borderRadius: 6,
          }}
          labelStyle={{ color: isDark ? '#e2e8f0' : '#0f172a' }}
          formatter={(v) => [`${v} muestras`, 'Muestras']}
        />
        <Bar
          dataKey="count"
          radius={[3, 3, 0, 0]}
          style={{ cursor: 'pointer' }}
          onClick={(d) => {
            const id = (d as { id?: number }).id
            if (id != null) setProyecto(id === filters.proyectoId ? null : id)
          }}
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.id}
              fill={entry.id === filters.proyectoId ? selectedFill : barColor}
              opacity={entry.id === filters.proyectoId ? 1 : 0.75}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
