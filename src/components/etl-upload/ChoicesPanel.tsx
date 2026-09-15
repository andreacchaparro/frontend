import { useEtlUploadStore } from '@/store/useEtlUploadStore'
import type { ChoiceCampo } from '@/types'

interface Props {
  idx: number
  choices: ChoiceCampo[]
}

export function ChoicesPanel({ idx, choices }: Props) {
  const { columnas, mapeoValores, setValorChoice } = useEtlUploadStore()
  const col = columnas[idx]
  const valores = mapeoValores[idx] ?? {}

  return (
    <div className="px-4 pb-3 pt-1 flex flex-col gap-1.5">
      <p className="text-xs font-bold text-fg-muted mb-0.5">
        Este campo solo acepta valores de una lista — asigna a qué opción corresponde cada valor de la columna:
      </p>
      {(col.valores_unicos ?? []).map((valorOrigen) => (
        <div key={valorOrigen} className="flex items-center gap-2">
          <span className="text-xs font-mono text-fg w-48 truncate" title={valorOrigen}>
            {valorOrigen}
          </span>
          <span className="text-fg-subtle">→</span>
          <select
            value={valores[valorOrigen] ?? ''}
            onChange={(e) => setValorChoice(idx, valorOrigen, e.target.value)}
            className="bg-surface border border-border text-fg text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-teal"
          >
            <option value="">— ignorar —</option>
            {choices.map((ch) => (
              <option key={String(ch.valor)} value={ch.valor}>
                {ch.etiqueta}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}
