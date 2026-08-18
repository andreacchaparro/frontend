import { useMemo } from 'react'
import { Select } from '@/components/common/Select'
import { useAppStore } from '@/store/useAppStore'
import { useSitios } from '@/hooks/useSitios'
import { useResumenGeo } from '@/hooks/useResumenGeo'
import { buildGeoResumenBaseFilters } from '@/utils/geoFilters'
import { GAS_LABELS } from '@/utils/formatters'
import type { GasType, SitioProyecto } from '@/types'

const GAS_OPTIONS: { value: GasType; label: string; disabled?: boolean }[] = [
  { value: 'CO2', label: GAS_LABELS.CO2 },
  { value: 'CH4', label: GAS_LABELS.CH4 },
  { value: 'N2O', label: GAS_LABELS.N2O, disabled: true },
]

export function FilterPanel() {
  const {
    filters,
    setYear,
    setGas,
    setProyecto,
    departamento,
    municipio,
    vereda,
    setDepartamento,
    setMunicipio,
    setVereda,
  } = useAppStore()
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

  const baseGeoFilters = useMemo(() => buildGeoResumenBaseFilters(filters), [filters])

  const { data: departamentosData } = useResumenGeo('departamento', baseGeoFilters)
  const { data: municipiosData } = useResumenGeo(
    'municipio',
    { ...baseGeoFilters, departamento: departamento?.id },
    departamento != null
  )
  const { data: veredasData } = useResumenGeo(
    'vereda',
    { ...baseGeoFilters, municipio: municipio?.id },
    municipio != null
  )

  const departamentoOptions = useMemo(
    () => [...(departamentosData?.features ?? [])].sort((a, b) => a.properties.nombre.localeCompare(b.properties.nombre)),
    [departamentosData]
  )
  const municipioOptions = useMemo(
    () => [...(municipiosData?.features ?? [])].sort((a, b) => a.properties.nombre.localeCompare(b.properties.nombre)),
    [municipiosData]
  )
  const veredaOptions = useMemo(
    () => [...(veredasData?.features ?? [])].sort((a, b) => a.properties.nombre.localeCompare(b.properties.nombre)),
    [veredasData]
  )

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

      <div className="border-t border-border pt-4 flex flex-col gap-4">
        <p className="text-xs text-fg-muted font-semibold uppercase tracking-wider">Ubicación</p>

        <Select
          label="Departamento"
          value={departamento != null ? String(departamento.id) : ''}
          options={[
            { value: '', label: 'Todos los departamentos' },
            ...departamentoOptions.map((f) => ({ value: String(f.properties.id), label: f.properties.nombre })),
          ]}
          onChange={(v) => {
            if (!v) return setDepartamento(null)
            const f = departamentoOptions.find((f) => String(f.properties.id) === v)
            if (f) setDepartamento({ id: f.properties.id, nombre: f.properties.nombre })
          }}
        />

        <Select
          label="Municipio"
          value={municipio != null ? String(municipio.id) : ''}
          options={[
            { value: '', label: departamento ? 'Todos los municipios' : 'Elegí un departamento primero' },
            ...municipioOptions.map((f) => ({ value: String(f.properties.id), label: f.properties.nombre })),
          ]}
          onChange={(v) => {
            if (!v) return setMunicipio(null)
            const f = municipioOptions.find((f) => String(f.properties.id) === v)
            if (f) setMunicipio({ id: f.properties.id, nombre: f.properties.nombre })
          }}
        />

        <Select
          label="Vereda"
          value={vereda != null ? String(vereda.id) : ''}
          options={[
            { value: '', label: municipio ? 'Todas las veredas' : 'Elegí un municipio primero' },
            ...veredaOptions.map((f) => ({ value: String(f.properties.id), label: f.properties.nombre })),
          ]}
          onChange={(v) => {
            if (!v) return setVereda(null)
            const f = veredaOptions.find((f) => String(f.properties.id) === v)
            if (f) setVereda({ id: f.properties.id, nombre: f.properties.nombre })
          }}
        />
      </div>
    </div>
  )
}
