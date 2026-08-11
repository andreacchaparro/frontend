export type GasType = 'CO2' | 'CH4' | 'N2O'

export interface FilterState {
  year: number | null
  gas: GasType
  proyectoId: number | null
}

// ── mediciones crudas de flujo (/api/geo/series/) ───────────────────

export interface SerieLectura {
  fecha: string
  valor: number
  unidad: string
  gas: string
  sitio_id: number
  sitio_nombre: string
  departamento_id: number | null
  departamento: string | null
  proyecto_id: number
  proyecto_nombre: string
}

export interface SerieResponse {
  count: number
  resultados: SerieLectura[]
}

export interface SeriesFilters {
  anio?: number
  sitio?: number
  proyecto?: number
  departamento?: number
}

// ── sitios georreferenciados (GeoJSON) ──────────────────────────────

export interface SitioProyecto {
  id: number
  nombre: string
}

export interface SitioUnidadMuestreo {
  id: number
  nombre: string
  tipo: string
}

export interface UltimaMedicionCO2 {
  fecha: string
  valor: number
  unidad: string
}

export interface RangoFechas {
  desde: string | null
  hasta: string | null
}

export interface SitioProperties {
  id: number
  nombre: string
  municipio: string | null
  departamento: string | null
  altitud: number | null
  uso_actual: string | null
  proyectos: SitioProyecto[]
  unidades_muestreo: SitioUnidadMuestreo[]
  total_muestras_co2: number
  rango_fechas: RangoFechas
  ultima_medicion_co2: UltimaMedicionCO2 | null
}

export interface SitioFeature {
  type: 'Feature'
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: SitioProperties
}

export interface SitiosFeatureCollection {
  type: 'FeatureCollection'
  features: SitioFeature[]
}
