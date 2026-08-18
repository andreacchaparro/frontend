export type GasType = 'CO2' | 'CH4' | 'N2O'

export interface FilterState {
  year: number | null
  gas: GasType
  proyectoId: number | null
}

export type MapViewMode = 'sitios' | 'regiones'

// Selección de drill-down geográfico (departamento/municipio/vereda).
// "vereda" agrupa también manzana: el backend no expone un nivel separado.
export interface GeoDrillEntity {
  id: number
  nombre: string
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
  gas?: GasType
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

export interface ResumenGas {
  total_muestras: number
  rango_fechas: RangoFechas
  ultima_medicion: UltimaMedicionCO2 | null
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
  resumen_por_gas: Partial<Record<GasType, ResumenGas>>
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

// ── tabla desnormalizada por proyecto/sitio (/api/proyectos/<id>/datos/) ──

export type VistaDatos = 'submuestra_gei' | 'unidad_muestreo' | 'clima'

export interface ColumnaDatos {
  clave: string
  modelo: string
  campo: string
  verbose_name: string
}

export type FilaDatos = Record<string, string | number | null>

export interface DatosProyectoResponse {
  total: number
  offset: number
  limite: number
  columnas: ColumnaDatos[]
  filas: FilaDatos[]
  vistas: VistaDatos[]
  advertencia?: string
}

export interface DatosProyectoFilters {
  vista?: VistaDatos
  sitio?: number
  filtros?: Record<string, string>
  offset?: number
  limite?: number
}

// ── resumen geográfico agregado con drill-down (/api/geo/resumen/) ──

export type GeoNivel = 'region' | 'departamento' | 'municipio' | 'vereda' | 'sitio'

export interface GeoResumenProperties {
  id: number
  nombre: string
  total_muestras: number
  promedio: number | null
  minimo: number | null
  maximo: number | null
  rango_fechas: RangoFechas
  ultima_medicion: UltimaMedicionCO2 | null
  departamento_id?: number
  departamento?: string
  municipio_id?: number
  municipio?: string
}

export type GeoResumenGeometry =
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] }

export interface GeoResumenFeature {
  type: 'Feature'
  geometry: GeoResumenGeometry | null
  properties: GeoResumenProperties
}

export interface GeoResumenFeatureCollection {
  type: 'FeatureCollection'
  features: GeoResumenFeature[]
}

export interface GeoResumenFilters {
  gas?: GasType
  desde?: string
  hasta?: string
  proyecto?: number
  departamento?: number
  municipio?: number
  vereda?: number
}
