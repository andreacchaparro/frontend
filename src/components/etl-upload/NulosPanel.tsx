import { useEtlUploadStore } from '@/store/useEtlUploadStore'

interface Props {
  idx: number
}

const ESTRATEGIAS = [
  { value: 'dejar_null', label: 'Dejar vacío', detalle: 'Las filas sin este dato quedan con el campo vacío.' },
  {
    value: 'rellenar',
    label: 'Rellenar hacia abajo',
    detalle: 'Repite el último valor no vacío en las filas siguientes.',
  },
  { value: 'manual', label: 'Ingresar manualmente', detalle: 'Usa un valor fijo para las filas vacías.' },
  {
    value: 'ignorar_fila',
    label: 'Ignorar registros sin este valor',
    detalle: 'No se crea el registro para las filas donde esta columna venga vacía.',
  },
]

export function NulosPanel({ idx }: Props) {
  const { columnas, mapeoSeleccion, totalFilas, setEstrategiaNulos, setValorRellenoManual } = useEtlUploadStore()
  const col = columnas[idx]
  const seleccion = mapeoSeleccion[idx]

  if (!seleccion?.modelo || !seleccion.campo || !col.nulls) return null

  const estrategia = seleccion.estrategiaNulos || 'dejar_null'

  return (
    <div className="border border-amber-500 rounded-lg p-3">
      <p className="text-xs font-bold text-fg mb-2">
        ⚠️ {col.nulls} de {totalFilas || '?'} filas vienen vacías en esta columna
      </p>
      <div className="flex flex-col gap-2">
        {ESTRATEGIAS.map((e) => (
          <label key={e.value} className="flex items-start gap-2 text-xs text-fg-muted cursor-pointer">
            <input
              type="radio"
              name={`nulos-${idx}`}
              checked={estrategia === e.value}
              onChange={() => setEstrategiaNulos(idx, e.value)}
              className="mt-0.5"
            />
            <span>
              <strong className="text-fg">{e.label}</strong>
              <br />
              {e.detalle}
            </span>
          </label>
        ))}
      </div>
      {estrategia === 'manual' && (
        <input
          type="text"
          placeholder="valor de relleno…"
          value={seleccion.valorRellenoManual || ''}
          onChange={(e) => setValorRellenoManual(idx, e.target.value)}
          className="mt-2 ml-5 bg-surface border border-border text-fg text-xs rounded-md px-2.5 py-1.5 w-56 focus:outline-none focus:ring-1 focus:ring-brand-teal"
        />
      )}
    </div>
  )
}
