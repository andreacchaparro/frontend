import { useEffect, useState, type FormEvent } from 'react'
import { useProyectoDrawerStore } from '@/store/useProyectoDrawerStore'
import { useCrearProyecto } from '@/hooks/useProyectoMutations'

const inputClass =
  'bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal w-full'
const labelClass = 'text-xs font-bold text-fg'

export function ProyectoDrawer() {
  const { open, closeDrawer } = useProyectoDrawerStore()
  const crearProyecto = useCrearProyecto()

  const [nombre, setNombre] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [coordinador, setCoordinador] = useState('')
  const [correo, setCorreo] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setNombre('')
    setFechaInicio('')
    setFechaFin('')
    setCoordinador('')
    setCorreo('')
    setObjetivo('')
    setError('')
  }, [open])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nombreTrim = nombre.trim()
    if (!nombreTrim) {
      setError('El nombre es obligatorio.')
      return
    }
    setError('')
    try {
      await crearProyecto.mutateAsync({
        nombre: nombreTrim,
        coordinador: coordinador.trim(),
        correo_coordinador: correo.trim(),
        objetivo_general: objetivo.trim(),
        fecha_inicio: fechaInicio || null,
        fecha_fin: fechaFin || null,
      })
      closeDrawer()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar. Intenta de nuevo.')
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-[200] transition-opacity ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 w-[440px] max-w-full bg-panel z-[201] shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between">
          <h3 className="text-base font-extrabold text-fg">🗂 Nuevo proyecto</h3>
          <button
            type="button"
            onClick={closeDrawer}
            className="text-fg-muted hover:text-fg hover:bg-surface rounded-md p-1 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre completo del proyecto"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Fecha inicio</label>
              <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Fecha fin</label>
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Coordinador</label>
            <input
              type="text"
              value={coordinador}
              onChange={(e) => setCoordinador(e.target.value)}
              placeholder="Nombre del coordinador"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Correo del coordinador</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="coordinador@universidad.edu.co"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Objetivo general</label>
            <textarea
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              rows={4}
              placeholder="Describe el objetivo principal del proyecto…"
              className={`${inputClass} resize-y`}
            />
          </div>

          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
        </form>

        <div className="px-6 py-4 border-t border-border flex gap-2.5 items-center">
          <button
            type="button"
            onClick={closeDrawer}
            className="bg-surface border border-border text-fg-muted hover:text-fg text-sm font-semibold px-4 py-2.5 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={crearProyecto.isPending}
            className="flex-1 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-md transition-colors"
          >
            {crearProyecto.isPending ? 'Guardando…' : 'Guardar proyecto'}
          </button>
        </div>
      </div>
    </>
  )
}
