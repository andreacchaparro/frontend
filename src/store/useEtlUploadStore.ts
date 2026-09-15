import { create } from 'zustand'
import type {
  AtributoManual,
  CamposDestinoResponse,
  ColumnaConErrores,
  ColumnaOrigen,
  ExtraDestino,
  MapeoColumnaPrevio,
  MapeoSeleccion,
} from '@/types'
import { SIN_MAPEAR_ORDEN, aplicarSugerenciasHora, aplicarSugerenciasValores, sugerirMapeo } from '@/utils/etlMapeo'

interface EtlUploadStore {
  step: 1 | 2
  fuenteId: number | null
  cargaId: number | null
  columnas: ColumnaOrigen[]
  sheets: string[]
  hojaActiva: string
  totalFilas: number
  camposDestino: CamposDestinoResponse | null
  mapeoSeleccion: Record<number, MapeoSeleccion>
  mapeoValores: Record<number, Record<string, string>>
  atributosManuales: AtributoManual[]
  extrasDestino: ExtraDestino[]
  ultimosErroresPorColumna: Record<string, ColumnaConErrores['errores']>
  seccionIdx: number
  seccionesGuardadas: Set<number>

  setFuenteId: (fuenteId: number | null) => void
  setAnalisis: (
    analisis: {
      cargaId: number
      columnas: ColumnaOrigen[]
      sheets: string[]
      hojaActiva: string
      totalFilas: number
      mapeosPrevios: MapeoColumnaPrevio[]
    },
    camposDestino: CamposDestinoResponse
  ) => void
  setModeloColumna: (idx: number, modelo: string) => void
  setCampoColumna: (idx: number, campo: string) => void
  setTipoCoberturaColumna: (idx: number, tipoCobertura: number | null) => void
  setEstrategiaNulos: (idx: number, estrategia: string) => void
  setValorRellenoManual: (idx: number, valor: string) => void
  setValorChoice: (idx: number, valorOrigen: string, valorElegido: string) => void
  setAplicarRegexColumna: (idx: number, activar: boolean) => void
  setRegexPatronColumna: (idx: number, patron: string) => void
  agregarAtributoManual: (modelo: string) => void
  actualizarAtributoManual: (i: number, patch: Partial<AtributoManual>) => void
  quitarAtributoManual: (i: number) => void
  agregarExtraDestino: (colIdx: number) => void
  actualizarExtraDestino: (extraIdx: number, patch: Partial<ExtraDestino>) => void
  quitarExtraDestino: (extraIdx: number) => void
  setUltimosErroresPorColumna: (columnas: ColumnaConErrores[]) => void
  setSeccionIdx: (orden: number) => void
  marcarSeccionGuardada: (orden: number) => void
  setStep: (step: 1 | 2) => void
  reset: () => void
}

const initialState = {
  step: 1 as const,
  fuenteId: null as number | null,
  cargaId: null as number | null,
  columnas: [] as ColumnaOrigen[],
  sheets: [] as string[],
  hojaActiva: '',
  totalFilas: 0,
  camposDestino: null as CamposDestinoResponse | null,
  mapeoSeleccion: {} as Record<number, MapeoSeleccion>,
  mapeoValores: {} as Record<number, Record<string, string>>,
  atributosManuales: [] as AtributoManual[],
  extrasDestino: [] as ExtraDestino[],
  ultimosErroresPorColumna: {} as Record<string, ColumnaConErrores['errores']>,
  seccionIdx: SIN_MAPEAR_ORDEN,
  seccionesGuardadas: new Set<number>(),
}

// Recupera en `mapeoSeleccion`/`mapeoValores`/`atributosManuales`/
// `extrasDestino` lo que ya se había guardado en cargas previas de la misma
// fuente (el backend copia esos mapeos a la carga nueva en /upload/).
function aplicarMapeosGuardados(
  columnas: ColumnaOrigen[],
  mapeosPrevios: MapeoColumnaPrevio[]
): {
  mapeoSeleccion: Record<number, MapeoSeleccion>
  mapeoValores: Record<number, Record<string, string>>
  atributosManuales: AtributoManual[]
  extrasDestino: ExtraDestino[]
} {
  const atributosManuales: AtributoManual[] = mapeosPrevios
    .filter((m) => m.transformacion === 'constante')
    .map((m) => ({ modelo: m.modelo_destino || '', campo: m.campo_destino || '', valor: m.valor_constante || '' }))

  const porNombre = new Map<string, MapeoColumnaPrevio[]>()
  mapeosPrevios
    .filter((m) => m.transformacion !== 'constante')
    .forEach((m) => {
      const lista = porNombre.get(m.columna_origen) ?? []
      lista.push(m)
      porNombre.set(m.columna_origen, lista)
    })

  const mapeoSeleccion: Record<number, MapeoSeleccion> = {}
  const mapeoValores: Record<number, Record<string, string>> = {}
  const extrasDestino: ExtraDestino[] = []
  columnas.forEach((col, idx) => {
    const [m, ...extrasGuardados] = porNombre.get(col.nombre) ?? []
    if (!m) return
    if (m.transformacion === 'ignorar') {
      mapeoSeleccion[idx] = { modelo: '', campo: '' }
      return
    }
    if (!m.modelo_destino) return
    mapeoSeleccion[idx] = {
      modelo: m.modelo_destino,
      campo: m.campo_destino || '',
      estrategiaNulos: m.estrategia_nulos || 'dejar_null',
      valorRellenoManual: m.valor_relleno_manual || '',
      aplicarRegex: m.transformacion === 'regex',
      regexPatron: m.regex_patron || '',
    }
    extrasGuardados.forEach((e) => {
      extrasDestino.push({
        colIdx: idx,
        modelo: e.modelo_destino || '',
        campo: e.campo_destino || '',
        aplicarRegex: e.transformacion === 'regex',
        regexPatron: e.regex_patron || '',
        tipoCobertura: null,
      })
    })
    if (m.mapeo_valores && Object.keys(m.mapeo_valores).length) {
      mapeoValores[idx] = { ...m.mapeo_valores }
    }
  })

  return { mapeoSeleccion, mapeoValores, atributosManuales, extrasDestino }
}

function aplicarSugerenciasMapeo(
  columnas: ColumnaOrigen[],
  mapeoSeleccion: Record<number, MapeoSeleccion>,
  modelosDestino: Record<string, import('@/types').CampoDestino[]>
): Record<number, MapeoSeleccion> {
  const resultado = { ...mapeoSeleccion }
  columnas.forEach((col, idx) => {
    if (resultado[idx]) return
    const sugerencia = sugerirMapeo(col.nombre, modelosDestino)
    if (sugerencia) resultado[idx] = { ...sugerencia, sugerido: true }
  })
  return resultado
}

export const useEtlUploadStore = create<EtlUploadStore>((set) => ({
  ...initialState,
  setFuenteId: (fuenteId) => set({ ...initialState, seccionesGuardadas: new Set(), fuenteId }),
  setAnalisis: (analisis, camposDestino) => {
    const {
      mapeoSeleccion: recuperado,
      mapeoValores: valoresRecuperados,
      atributosManuales,
      extrasDestino,
    } = aplicarMapeosGuardados(analisis.columnas, analisis.mapeosPrevios)
    const mapeoSeleccion = aplicarSugerenciasMapeo(analisis.columnas, recuperado, camposDestino.modelos)
    const mapeoValoresChoices = aplicarSugerenciasValores(
      analisis.columnas,
      mapeoSeleccion,
      valoresRecuperados,
      camposDestino.modelos
    )
    const mapeoValores = aplicarSugerenciasHora(analisis.columnas, mapeoValoresChoices)
    set({
      step: 2,
      cargaId: analisis.cargaId,
      columnas: analisis.columnas,
      sheets: analisis.sheets,
      hojaActiva: analisis.hojaActiva,
      totalFilas: analisis.totalFilas,
      camposDestino,
      mapeoSeleccion,
      mapeoValores,
      atributosManuales,
      extrasDestino,
      ultimosErroresPorColumna: {},
      seccionIdx: SIN_MAPEAR_ORDEN,
      seccionesGuardadas: new Set(),
    })
  },
  setModeloColumna: (idx, modelo) =>
    set((s) => ({
      mapeoSeleccion: {
        ...s.mapeoSeleccion,
        [idx]: {
          modelo,
          campo: '',
          estrategiaNulos: s.mapeoSeleccion[idx]?.estrategiaNulos,
          valorRellenoManual: s.mapeoSeleccion[idx]?.valorRellenoManual,
          aplicarRegex: false,
          regexPatron: '',
          tipoCobertura: null,
        },
      },
    })),
  setCampoColumna: (idx, campo) =>
    set((s) => ({
      mapeoSeleccion: { ...s.mapeoSeleccion, [idx]: { ...s.mapeoSeleccion[idx], campo } },
    })),
  setTipoCoberturaColumna: (idx, tipoCobertura) =>
    set((s) => ({
      mapeoSeleccion: { ...s.mapeoSeleccion, [idx]: { ...s.mapeoSeleccion[idx], tipoCobertura } },
    })),
  setEstrategiaNulos: (idx, estrategiaNulos) =>
    set((s) => ({
      mapeoSeleccion: { ...s.mapeoSeleccion, [idx]: { ...s.mapeoSeleccion[idx], estrategiaNulos } },
    })),
  setValorRellenoManual: (idx, valorRellenoManual) =>
    set((s) => ({
      mapeoSeleccion: { ...s.mapeoSeleccion, [idx]: { ...s.mapeoSeleccion[idx], valorRellenoManual } },
    })),
  setValorChoice: (idx, valorOrigen, valorElegido) =>
    set((s) => ({
      mapeoValores: { ...s.mapeoValores, [idx]: { ...s.mapeoValores[idx], [valorOrigen]: valorElegido } },
    })),
  setAplicarRegexColumna: (idx, aplicarRegex) =>
    set((s) => ({
      mapeoSeleccion: { ...s.mapeoSeleccion, [idx]: { ...s.mapeoSeleccion[idx], aplicarRegex } },
    })),
  setRegexPatronColumna: (idx, regexPatron) =>
    set((s) => ({
      mapeoSeleccion: { ...s.mapeoSeleccion, [idx]: { ...s.mapeoSeleccion[idx], regexPatron } },
    })),
  agregarAtributoManual: (modelo) =>
    set((s) => ({ atributosManuales: [...s.atributosManuales, { modelo, campo: '', valor: '' }] })),
  actualizarAtributoManual: (i, patch) =>
    set((s) => ({
      atributosManuales: s.atributosManuales.map((a, idx) => (idx === i ? { ...a, ...patch } : a)),
    })),
  quitarAtributoManual: (i) =>
    set((s) => ({ atributosManuales: s.atributosManuales.filter((_, idx) => idx !== i) })),
  agregarExtraDestino: (colIdx) =>
    set((s) => ({
      extrasDestino: [
        ...s.extrasDestino,
        { colIdx, modelo: '', campo: '', aplicarRegex: false, regexPatron: '', tipoCobertura: null },
      ],
    })),
  actualizarExtraDestino: (extraIdx, patch) =>
    set((s) => ({
      extrasDestino: s.extrasDestino.map((e, i) => (i === extraIdx ? { ...e, ...patch } : e)),
    })),
  quitarExtraDestino: (extraIdx) =>
    set((s) => ({ extrasDestino: s.extrasDestino.filter((_, i) => i !== extraIdx) })),
  setUltimosErroresPorColumna: (columnas) =>
    set((s) => {
      const nuevo = { ...s.ultimosErroresPorColumna }
      columnas.forEach((c) => {
        nuevo[c.columna] = c.errores
      })
      return { ultimosErroresPorColumna: nuevo }
    }),
  setSeccionIdx: (orden) => set({ seccionIdx: orden }),
  marcarSeccionGuardada: (orden) =>
    set((s) => ({ seccionesGuardadas: new Set(s.seccionesGuardadas).add(orden) })),
  setStep: (step) => set({ step }),
  reset: () => set({ ...initialState, seccionesGuardadas: new Set() }),
}))
