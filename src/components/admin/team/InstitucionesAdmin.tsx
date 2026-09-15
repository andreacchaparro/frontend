import { useState, type FormEvent } from 'react'
import { ConfirmModal } from '@/components/common/ConfirmModal'
import {
  useInstituciones,
  useCrearInstitucion,
  useActualizarInstitucion,
  useEliminarInstitucion,
} from '@/hooks/useUsuarioMutations'
import type { Institucion } from '@/types'

const inputClass =
  'bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal'

export function InstitucionesAdmin() {
  const { data: instituciones, isLoading } = useInstituciones()
  const crear = useCrearInstitucion()
  const actualizar = useActualizarInstitucion()
  const eliminar = useEliminarInstitucion()

  const [editando, setEditando] = useState<Institucion | null>(null)
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState('')
  const [aBorrar, setABorrar] = useState<Institucion | null>(null)

  const guardando = crear.isPending || actualizar.isPending

  function editar(inst: Institucion) {
    setEditando(inst)
    setNombre(inst.nombre)
    setCorreo(inst.correo || '')
    setError('')
  }

  function cancelarEdicion() {
    setEditando(null)
    setNombre('')
    setCorreo('')
    setError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nombreTrim = nombre.trim()
    if (!nombreTrim) {
      setError('El nombre de la institución es obligatorio.')
      return
    }
    setError('')

    try {
      const payload = { nombre: nombreTrim, correo: correo.trim() }
      if (editando) {
        await actualizar.mutateAsync({ id: editando.id, payload })
      } else {
        await crear.mutateAsync(payload)
      }
      cancelarEdicion()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar institución.')
    }
  }

  function confirmarBorrar() {
    if (!aBorrar) return
    eliminar.mutate(aBorrar.id, {
      onSuccess: () => {
        setABorrar(null)
        if (editando?.id === aBorrar.id) cancelarEdicion()
      },
    })
  }

  return (
    <div className="bg-panel border border-border rounded-xl p-4 flex flex-col gap-3.5">
      <form onSubmit={handleSubmit} className="grid grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_auto] gap-2.5 items-end max-md:grid-cols-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-fg">
            Institución <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Universidad Nacional"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-fg">Correo de contacto</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="contacto@institucion.edu.co"
            className={inputClass}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={guardando}
            className="bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-md transition-colors whitespace-nowrap"
          >
            {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : '＋ Agregar'}
          </button>
          {editando && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="bg-surface border border-border text-fg-muted hover:text-fg text-sm font-semibold px-3 py-2 rounded-md transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <strong className="text-sm text-fg">Instituciones registradas</strong>
        <span className="text-xs text-fg-muted font-semibold">
          {isLoading ? 'Cargando…' : `${instituciones?.length ?? 0} institución${instituciones?.length !== 1 ? 'es' : ''}`}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {instituciones?.length === 0 && <span className="text-sm text-fg-muted">No hay instituciones registradas.</span>}
        {instituciones?.map((inst) => (
          <span
            key={inst.id}
            className="inline-flex items-center gap-1.5 border border-border rounded-full pl-3 pr-1.5 py-1.5 bg-surface text-sm font-bold text-fg"
          >
            {inst.nombre}
            {inst.correo && (
              <a href={`mailto:${inst.correo}`} className="text-brand-teal-dark dark:text-brand-teal-bright font-semibold">
                {inst.correo}
              </a>
            )}
            <span className="inline-flex gap-0.5 ml-0.5">
              <button
                type="button"
                onClick={() => editar(inst)}
                title="Editar"
                className="rounded-full px-1.5 py-0.5 text-xs font-extrabold text-fg-muted hover:text-brand-teal-dark"
              >
                ✎
              </button>
              <button
                type="button"
                onClick={() => setABorrar(inst)}
                title="Eliminar"
                className="rounded-full px-1.5 py-0.5 text-xs font-extrabold text-fg-muted hover:text-red-500"
              >
                ✕
              </button>
            </span>
          </span>
        ))}
      </div>

      {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

      <ConfirmModal
        open={aBorrar != null}
        title="Eliminar institución"
        description={`¿Eliminar la institución "${aBorrar?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
        loading={eliminar.isPending}
        onConfirm={confirmarBorrar}
        onCancel={() => setABorrar(null)}
      />
    </div>
  )
}
