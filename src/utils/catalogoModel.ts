import catalogoJson from '@/assets/data/catalogo.json'
import type { CampoDestino, CatalogoData, EntidadCatalogo, GrupoCatalogo } from '@/types'

// Empaquetado como archivo estático del proyecto (no hay endpoint API):
// se regenera con `python manage.py generate_catalogo` en el backend y
// se copia a este archivo cada vez que se despliega una nueva versión.
export const CATALOGO = catalogoJson as CatalogoData

export const GRUPO_PALETTE = [
  '#475569', '#16a34a', '#d97706', '#db2777',
  '#7c3aed', '#2563eb', '#ea580c', '#0891b2', '#dc2626',
]

export interface EntidadInfo {
  nombre: string
  groupName: string
  icono: string
  color: string
  campos: CampoDestino[]
  entidad: EntidadCatalogo
}

export interface RelacionCatalogo {
  from: string
  to: string
  field: string
}

function colorPorGrupo(grupos: GrupoCatalogo[]): Map<string, string> {
  const mapa = new Map<string, string>()
  grupos.forEach((g, idx) => mapa.set(g.nombre, GRUPO_PALETTE[idx % GRUPO_PALETTE.length]))
  return mapa
}

export const COLOR_POR_GRUPO = colorPorGrupo(CATALOGO.grupos)

export function colorDeGrupo(nombreGrupo: string): string {
  return COLOR_POR_GRUPO.get(nombreGrupo) ?? '#0d4f40'
}

export const ENTIDAD_MAP: Record<string, EntidadInfo> = (() => {
  const mapa: Record<string, EntidadInfo> = {}
  CATALOGO.grupos.forEach((g) => {
    const color = colorDeGrupo(g.nombre)
    g.entidades.forEach((e) => {
      mapa[e.nombre] = { nombre: e.nombre, groupName: g.nombre, icono: g.icono, color, campos: e.campos, entidad: e }
    })
  })
  return mapa
})()

export const RELACIONES: RelacionCatalogo[] = (() => {
  const rels: RelacionCatalogo[] = []
  Object.entries(ENTIDAD_MAP).forEach(([nombre, info]) => {
    info.campos.forEach((c) => {
      if (c.es_fk && c.modelo_fk && ENTIDAD_MAP[c.modelo_fk]) {
        rels.push({ from: nombre, to: c.modelo_fk, field: c.nombre })
      }
    })
  })
  return rels
})()

export function findEntidad(nombre: string): EntidadCatalogo | null {
  return ENTIDAD_MAP[nombre]?.entidad ?? null
}

export const TOTAL_ENTIDADES = Object.keys(ENTIDAD_MAP).length
export const TOTAL_RELACIONES = RELACIONES.length
