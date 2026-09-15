import { useEffect, useState, type FormEvent } from 'react'
import { useFuenteDrawerStore } from '@/store/useFuenteDrawerStore'
import { useFuentesDropdown } from '@/hooks/useFuentesDropdown'
import { useResponsables } from '@/hooks/useResponsables'
import { useCrearFuente, useActualizarFuente, useSubirArchivoFuente } from '@/hooks/useFuenteMutations'

const TIPOS = [
  { value: 'excel', label: 'Excel' },
  { value: 'csv', label: 'CSV' },
  { value: 'shapefile', label: 'Shapefile' },
  { value: 'geojson', label: 'GeoJSON' },
  { value: 'api', label: 'API externa' },
  { value: 'base_de_datos', label: 'Base de datos' },
  { value: 'otro', label: 'Otro' },
]

const ESTADOS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'completo', label: 'Completo' },
  { value: 'con_errores', label: 'Con errores' },
]

const inputClass =
  'bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal w-full'
const labelClass = 'text-xs font-bold text-fg'

export function FuenteDrawer() {
  const { open, editingFuente, proyectoContextId, closeDrawer } = useFuenteDrawerStore()
  const { data: dropdownData } = useFuentesDropdown()
  const { data: responsables } = useResponsables()
  const crearFuente = useCrearFuente()
  const actualizarFuente = useActualizarFuente()
  const subirArchivo = useSubirArchivoFuente()

  const [proyectoId, setProyectoId] = useState('')
  const [nombre, setNombre] = useState('')
  const [url, setUrl] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [descripcion, setDescripcion] = useState('')
  const [tipo, setTipo] = useState('excel')
  const [estado, setEstado] = useState('pendiente')
  const [responsableId, setResponsableId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    if (editingFuente) {
      setProyectoId(editingFuente.proyecto?.id ? String(editingFuente.proyecto.id) : '')
      setNombre(editingFuente.nombre)
      setUrl(editingFuente.url || '')
      setDescripcion(editingFuente.descripcion || '')
      setTipo(editingFuente.tipo || 'excel')
      setEstado(editingFuente.estado || 'pendiente')
      setResponsableId(editingFuente.responsable_id ? String(editingFuente.responsable_id) : '')
    } else {
      setProyectoId(proyectoContextId ? String(proyectoContextId) : '')
      setNombre('')
      setUrl('')
      setDescripcion('')
      setTipo('excel')
      setEstado('pendiente')
      setResponsableId('')
    }
    setArchivo(null)
    setError('')
  }, [open, editingFuente, proyectoContextId])

  const guardando = crearFuente.isPending || actualizarFuente.isPending || subirArchivo.isPending

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nombreTrim = nombre.trim()
    if (!nombreTrim) {
      setError('El nombre es obligatorio.')
      return
    }
    setError('')

    const payload = {
      nombre: nombreTrim,
      descripcion: descripcion.trim(),
      url: url.trim(),
      tipo,
      estado,
      responsable_id_write: responsableId ? Number(responsableId) : null,
      proyecto_id: proyectoId ? Number(proyectoId) : null,
    }

    try {
      const fuente = editingFuente
        ? await actualizarFuente.mutateAsync({ id: editingFuente.id, payload })
        : await crearFuente.mutateAsync(payload)

      if (archivo) {
        await subirArchivo.mutateAsync({ fuenteId: fuente.id, archivo })
      }
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
          <h3 className="text-base font-extrabold text-fg">
            📂 {editingFuente ? 'Editar fuente de datos' : 'Nueva fuente de datos'}
          </h3>
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
            <label className={labelClass}>Proyecto</label>
            <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)} className={inputClass}>
              <option value="">— Sin proyecto —</option>
              {dropdownData?.proyectos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: SWAP Turbera La Cocha 2023"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Enlace o ruta al archivo</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/… o ./data/test.xlsx"
              className={inputClass}
            />
            <span className="text-xs text-fg-muted">
              Acepta una URL http(s) descargable o una ruta de archivo accesible por el backend.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>O sube el archivo directamente</label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              className="text-sm text-fg"
            />
            <span className="text-xs text-fg-muted">
              Si seleccionas un archivo aquí, reemplaza el enlace/ruta anterior de la fuente.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="¿Qué contiene este archivo? ¿De qué campaña de campo es?"
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Tipo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={inputClass}>
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Estado</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)} className={inputClass}>
                {ESTADOS.map((es) => (
                  <option key={es.value} value={es.value}>
                    {es.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Responsable</label>
            <select value={responsableId} onChange={(e) => setResponsableId(e.target.value)} className={inputClass}>
              <option value="">— Sin responsable —</option>
              {responsables?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.institucion_nombre ? `${r.nombre} — ${r.institucion_nombre}` : r.nombre}
                </option>
              ))}
            </select>
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
            disabled={guardando}
            className="flex-1 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-md transition-colors"
          >
            {guardando ? 'Guardando…' : editingFuente ? 'Guardar cambios' : 'Guardar fuente'}
          </button>
        </div>
      </div>
    </>
  )
}
