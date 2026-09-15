import { useState } from 'react'
import { useEtlUploadStore } from '@/store/useEtlUploadStore'
import { useRegexSugerido } from '@/hooks/useRegexSugerido'
import { RegexPreview } from './RegexPreview'

interface Props {
  extraIdx: number
}

export function ExtraRow({ extraIdx }: Props) {
  const { fuenteId, columnas, camposDestino, extrasDestino, actualizarExtraDestino, quitarExtraDestino } =
    useEtlUploadStore()
  const extra = extrasDestino[extraIdx]
  const col = columnas[extra.colIdx]
  const modelosDestino = camposDestino?.modelos ?? {}
  const tiposCobertura = camposDestino?.tipos_cobertura ?? []
  const grupos = camposDestino?.grupos ?? {}

  const [sugerenciaRegexMsg, setSugerenciaRegexMsg] = useState('')
  const regexSugerido = useRegexSugerido()

  const muestra = (col.muestra ?? []).slice(0, 2).map((v) => `"${v}"`).join(', ')
  const campos = modelosDestino[extra.modelo] ?? []
  const mostrarTipoCobertura = extra.modelo === 'Cobertura' && extra.campo === 'nombre'

  const modelosPorGrupo = new Map<string, string[]>()
  Object.keys(modelosDestino).forEach((m) => {
    const grupoInfo = grupos[m]
    const etiqueta = grupoInfo ? `${grupoInfo.icono} ${grupoInfo.nombre}` : 'Otros'
    const lista = modelosPorGrupo.get(etiqueta) ?? []
    lista.push(m)
    modelosPorGrupo.set(etiqueta, lista)
  })

  function toggleRegex() {
    const activar = !extra.aplicarRegex
    actualizarExtraDestino(extraIdx, { aplicarRegex: activar })
    setSugerenciaRegexMsg('')
    if (activar && !extra.regexPatron && fuenteId != null) {
      regexSugerido.mutate(
        { fuenteId, modelo: extra.modelo, campo: extra.campo },
        {
          onSuccess: (data) => {
            if (!data.regex_patron) return
            actualizarExtraDestino(extraIdx, { regexPatron: data.regex_patron })
            setSugerenciaRegexMsg(
              `💡 Sugerido a partir de "${data.columna_origen}" en la fuente "${data.fuente_nombre}" — puedes editarlo.`
            )
          },
        }
      )
    }
  }

  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-b-0 flex-wrap">
      <div className="flex-1 min-w-[180px]">
        <div className="text-sm font-semibold text-fg flex items-center gap-1.5">
          ↳ {col.nombre}
          <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
            destino extra
          </span>
        </div>
        {muestra && <div className="text-xs text-fg-muted mt-0.5">muestra: {muestra}</div>}
      </div>

      <span className="text-fg-subtle mt-1.5">→</span>

      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={extra.modelo}
          onChange={(e) => actualizarExtraDestino(extraIdx, { modelo: e.target.value, campo: '' })}
          className="bg-surface border border-border text-fg text-xs rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-teal"
        >
          {[...modelosPorGrupo.entries()].map(([etiqueta, modelos]) => (
            <optgroup key={etiqueta} label={etiqueta}>
              {modelos.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <select
          value={extra.campo}
          onChange={(e) => actualizarExtraDestino(extraIdx, { campo: e.target.value })}
          className="bg-surface border border-border text-fg text-xs rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-teal"
        >
          {campos.map((c) => (
            <option key={c.nombre} value={c.nombre}>
              {c.verbose_name || c.nombre}
            </option>
          ))}
        </select>

        {mostrarTipoCobertura && (
          <select
            value={extra.tipoCobertura ? String(extra.tipoCobertura) : ''}
            onChange={(e) =>
              actualizarExtraDestino(extraIdx, { tipoCobertura: e.target.value ? Number(e.target.value) : null })
            }
            className="bg-surface border border-border text-fg text-xs rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-teal"
          >
            <option value="">— sistema de clasificación —</option>
            {tiposCobertura.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={toggleRegex}
          className="text-xs font-semibold text-brand-teal-dark dark:text-brand-teal-bright hover:underline whitespace-nowrap"
        >
          {extra.aplicarRegex ? 'quitar regex' : '🧩 aplicar regex al campo'}
        </button>

        <button
          type="button"
          onClick={() => quitarExtraDestino(extraIdx)}
          title="Quitar este destino extra"
          className="text-fg-muted hover:text-fg text-sm"
        >
          ✕
        </button>
      </div>

      {extra.aplicarRegex && (
        <div className="w-full flex flex-col gap-1.5">
          <input
            type="text"
            placeholder={String.raw`^SWAMP_CO2_(.+?)_\d+$`}
            value={extra.regexPatron || ''}
            onChange={(e) => actualizarExtraDestino(extraIdx, { regexPatron: e.target.value })}
            className="min-w-[220px] max-w-full font-mono text-xs bg-surface border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-teal"
          />
          {sugerenciaRegexMsg && <p className="text-xs text-fg-muted">{sugerenciaRegexMsg}</p>}
          <RegexPreview col={col} patron={extra.regexPatron || ''} fuenteId={fuenteId} modelo={extra.modelo} campo={extra.campo} />
        </div>
      )}
    </div>
  )
}
