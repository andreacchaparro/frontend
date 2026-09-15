import { useEtlUploadStore } from '@/store/useEtlUploadStore'

interface Props {
  idx: number
}

export function HorasPanel({ idx }: Props) {
  const { columnas, mapeoValores, setValorChoice } = useEtlUploadStore()
  const col = columnas[idx]
  const sugerencias = col.sugerencias_hora ?? {}
  const valores = mapeoValores[idx] ?? {}
  const valoresAmbiguos = Object.keys(sugerencias)

  if (valoresAmbiguos.length === 0) return null

  return (
    <div className="border border-amber-500 rounded-lg p-3">
      <p className="text-xs font-bold text-fg mb-1">⏱️ Horas ambiguas por revisar</p>
      <p className="text-xs text-fg-muted mb-3">
        Estos valores mezclan formato 24h con a. m./p. m. de forma contradictoria (p. ej. "14:29:00 a. m.").
        Confirma o corrige la interpretación antes de guardar.{' '}
        <strong className="text-fg">Formato esperado: 24 horas, HH:MM:ss</strong> (ej. <code>14:29:00</code>).
      </p>
      <div className="flex flex-col gap-1.5">
        {valoresAmbiguos.map((valorOrigen) => {
          const valorActual = valores[valorOrigen] ?? sugerencias[valorOrigen]
          const sinConfirmar = valorActual === sugerencias[valorOrigen]
          return (
            <div key={valorOrigen} className="flex items-center gap-2">
              <span className="text-xs font-mono text-fg w-40 truncate flex items-center gap-1" title={valorOrigen}>
                {valorOrigen}
                {sinConfirmar && (
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">❓ confirmar</span>
                )}
              </span>
              <span className="text-fg-subtle">→</span>
              <input
                type="text"
                placeholder="HH:MM:ss (24h)"
                value={valorActual}
                onChange={(e) => setValorChoice(idx, valorOrigen, e.target.value)}
                className="bg-surface border border-border text-fg text-xs font-mono rounded-md px-2 py-1 w-32 focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
