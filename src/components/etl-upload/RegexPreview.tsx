import { useState } from 'react'
import { useVerificarExistencia } from '@/hooks/useVerificarExistencia'
import { advertenciaLookbehindPython, aplicarRegexValor, muestraAleatoria } from '@/utils/etlMapeo'
import type { ColumnaOrigen } from '@/types'

interface Props {
  col: ColumnaOrigen
  patron: string
  fuenteId: number | null
  modelo: string
  campo: string
}

export function RegexPreview({ col, patron, fuenteId, modelo, campo }: Props) {
  const [valores] = useState(() => muestraAleatoria(col, 5))
  const aviso = patron ? advertenciaLookbehindPython(patron) : null

  const resultados = valores.map((v) => ({ v, r: patron ? aplicarRegexValor(patron, v) : null }))
  const resultadosOk = [...new Set(resultados.filter((x) => x.r?.estado === 'ok').map((x) => (x.r as { resultado: string }).resultado))]

  const { data: existencia } = useVerificarExistencia(fuenteId, modelo, campo, resultadosOk)
  const existentesSet = new Set(existencia?.soportado ? existencia.existentes : [])

  return (
    <div className="mt-2 p-3 bg-surface border border-border rounded-lg w-full">
      <p className="text-[10px] font-bold text-fg-muted uppercase tracking-wide mb-1.5">
        🔍 Vista previa (5 valores al azar)
      </p>
      {aviso && (
        <p className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/40 border border-red-500 rounded-md px-2 py-1.5 mb-2">
          ⚠️ {aviso}
        </p>
      )}
      {valores.length === 0 ? (
        <p className="text-xs text-fg-muted">No hay valores de muestra disponibles para esta columna.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {resultados.map(({ v, r }, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-mono flex-wrap">
              <span className="text-fg-muted">"{v}"</span>
              <span className="text-fg-subtle">→</span>
              {!patron ? (
                <span className="text-fg-muted">— escribe un patrón —</span>
              ) : r?.estado === 'error' ? (
                <span className="text-red-600 dark:text-red-400">{r.mensaje}</span>
              ) : r?.estado === 'sin-match' ? (
                <span className="text-red-600 dark:text-red-400">sin match → se guardaría vacío</span>
              ) : (
                r?.estado === 'ok' && (
                  <>
                    <span className="text-brand-teal-dark dark:text-brand-teal-bright font-semibold">
                      "{r.resultado}"
                    </span>
                    {existentesSet.has(r.resultado) ? (
                      <span className="font-sans text-blue-600 dark:text-blue-400">♻️ ya existe — se reutiliza</span>
                    ) : (
                      <span className="font-sans text-amber-700 dark:text-amber-400">＋ se crearía nuevo</span>
                    )}
                  </>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
