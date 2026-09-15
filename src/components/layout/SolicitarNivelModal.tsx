import { useState, type FormEvent } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useCrearSolicitudNivel, useSolicitudesNivel } from '@/hooks/useSolicitudesNivel'
import type { NivelAcceso } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
}

const NIVELES_ACCESO: NivelAcceso[] = ['ciudadano', 'investigador', 'reportador', 'admin']

const NOMBRES_NIVEL: Record<NivelAcceso, string> = {
  ciudadano: 'Ciudadano',
  investigador: 'Investigador',
  reportador: 'Reportador',
  admin: 'Administrador',
}

export function SolicitarNivelModal({ open, onClose }: Props) {
  const usuario = useAuthStore((s) => s.usuario)
  const { data: solicitudes } = useSolicitudesNivel()
  const crear = useCrearSolicitudNivel()
  const [nivelSolicitado, setNivelSolicitado] = useState<NivelAcceso | ''>('')
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')

  if (!open || !usuario) return null

  const nivelesSuperiores = NIVELES_ACCESO.filter(
    (n) => NIVELES_ACCESO.indexOf(n) > NIVELES_ACCESO.indexOf(usuario.nivel)
  )
  const pendiente = solicitudes?.find((s) => s.estado === 'pendiente')

  function limpiarYCerrar() {
    setNivelSolicitado('')
    setMotivo('')
    setError('')
    onClose()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!nivelSolicitado) {
      setError('Elige el nivel que quieres solicitar.')
      return
    }
    try {
      await crear.mutateAsync({ nivel_solicitado: nivelSolicitado, motivo: motivo.trim() })
      limpiarYCerrar()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la solicitud.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4" onClick={limpiarYCerrar}>
      <div
        className="bg-panel border border-border rounded-xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-fg">Solicitar otro nivel de acceso</h3>

        {pendiente ? (
          <p className="text-sm text-fg-muted">
            Ya tienes una solicitud pendiente para <strong>{NOMBRES_NIVEL[pendiente.nivel_solicitado]}</strong>. Un
            administrador debe resolverla antes de que puedas enviar otra.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-fg">Nivel solicitado</label>
              <select
                value={nivelSolicitado}
                onChange={(e) => setNivelSolicitado(e.target.value as NivelAcceso)}
                className="bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal"
              >
                <option value="">Elige un nivel…</option>
                {nivelesSuperiores.map((n) => (
                  <option key={n} value={n}>
                    {NOMBRES_NIVEL[n]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-fg">Motivo (opcional)</label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Cuéntale al admin por qué necesitas ese nivel"
                rows={3}
                className="bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal resize-none"
              />
            </div>
            {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
            <div className="flex items-center justify-end gap-2.5 mt-1">
              <button
                type="button"
                onClick={limpiarYCerrar}
                className="bg-surface border border-border text-fg-muted hover:text-fg text-sm font-semibold px-4 py-2 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={crear.isPending}
                className="bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-md transition-colors"
              >
                {crear.isPending ? 'Enviando…' : 'Solicitar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
