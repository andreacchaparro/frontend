import { useMemo } from 'react'
import { Select } from '@/components/common/Select'
import { useAppStore } from '@/store/useAppStore'
import { useSitios } from '@/hooks/useSitios'
import { GAS_LABELS } from '@/utils/formatters'
import type { GasType, SitioProyecto } from '@/types'

const GAS_OPTIONS: { value: GasType; label: string; disabled?: boolean }[] = [
  { value: 'CO2', label: GAS_LABELS.CO2 },
  { value: 'CH4', label: GAS_LABELS.CH4, disabled: true },
  { value: 'N2O', label: GAS_LABELS.N2O, disabled: true },
]

export function FilterPanel() {
  const { filters, setYear, setGas, setProyecto } = useAppStore()
  const { data: sitios } = useSitios()

  const years = useMemo(() => {
    const set = new Set<number>()
    sitios?.features.forEach((f) => {
      const { desde, hasta } = f.properties.rango_fechas
      const from = desde ? new Date(desde).getFullYear() : null
      const to = hasta ? new Date(hasta).getFullYear() : null
      if (from != null && to != null) {
        for (let y = from; y <= to; y++) set.add(y)
      } else if (from != null) {
        set.add(from)
      } else if (to != null) {
        set.add(to)
      }
    })
    return [...set].sort((a, b) => b - a)
  }, [sitios])

  const proyectos = useMemo(() => {
    const map = new Map<number, SitioProyecto>()
    sitios?.features.forEach((f) => {
      f.properties.proyectos.forEach((p) => map.set(p.id, p))
    })
    return [...map.values()].sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [sitios])

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Año"
        value={filters.year != null ? String(filters.year) : ''}
        options={[
          { value: '', label: 'Todos los años' },
          ...years.map((y) => ({ value: String(y), label: String(y) })),
        ]}
        onChange={(v) => setYear(v ? Number(v) : null)}
      />
      <Select
        label="Gas"
        value={filters.gas}
        options={GAS_OPTIONS}
        onChange={(v) => setGas(v as GasType)}
      />
      <Select
        label="Proyecto"
        value={filters.proyectoId != null ? String(filters.proyectoId) : ''}
        options={[
          { value: '', label: 'Todos los proyectos' },
          ...proyectos.map((p) => ({ value: String(p.id), label: p.nombre })),
        ]}
        onChange={(v) => setProyecto(v ? Number(v) : null)}
      />
    </div>
  )
}
