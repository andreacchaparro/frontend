import { useEffect, useState, type FormEvent } from 'react'
import { useUsuarioDrawerStore } from '@/store/useUsuarioDrawerStore'
import { useInstituciones, useRolesUsuario, useCrearUsuario, useActualizarUsuario } from '@/hooks/useUsuarioMutations'

const inputClass =
  'bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal w-full'
const labelClass = 'text-xs font-bold text-fg'

const ROLES_FALLBACK = [{ id: 0, codigo: 'reportador', nombre: 'Reportador' }]

export function UsuarioDrawer() {
  const { open, editingUsuario, closeDrawer } = useUsuarioDrawerStore()
  const { data: instituciones } = useInstituciones()
  const { data: roles } = useRolesUsuario()
  const crearUsuario = useCrearUsuario()
  const actualizarUsuario = useActualizarUsuario()

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [cargo, setCargo] = useState('')
  const [institucionId, setInstitucionId] = useState('')
  const [rolesSeleccionados, setRolesSeleccionados] = useState<Set<string>>(new Set(['reportador']))
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    if (editingUsuario) {
      setNombre(editingUsuario.nombre)
      setCorreo(editingUsuario.correo || editingUsuario.correo_institucional || '')
      setCargo(editingUsuario.cargo || '')
      setInstitucionId(editingUsuario.institucion ? String(editingUsuario.institucion) : '')
      setRolesSeleccionados(new Set(editingUsuario.roles))
    } else {
      setNombre('')
      setCorreo('')
      setCargo('')
      setInstitucionId('')
      setRolesSeleccionados(new Set(['reportador']))
    }
    setPassword('')
    setError('')
  }, [open, editingUsuario])

  const guardando = crearUsuario.isPending || actualizarUsuario.isPending
  const opcionesRoles = roles && roles.length > 0 ? roles : ROLES_FALLBACK

  function toggleRol(codigo: string) {
    setRolesSeleccionados((prev) => {
      const next = new Set(prev)
      if (next.has(codigo)) next.delete(codigo)
      else next.add(codigo)
      return next
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nombreTrim = nombre.trim()
    if (!nombreTrim) {
      setError('El nombre es obligatorio.')
      return
    }
    if (password && !correo.trim()) {
      setError('Para asignar contraseña el usuario necesita un correo.')
      return
    }
    setError('')

    const payload = {
      nombre: nombreTrim,
      cargo: cargo.trim(),
      correo: correo.trim(),
      institucion: institucionId ? Number(institucionId) : null,
      roles: [...rolesSeleccionados],
      ...(password ? { password } : {}),
    }

    try {
      if (editingUsuario) {
        await actualizarUsuario.mutateAsync({ id: editingUsuario.id, payload })
      } else {
        await crearUsuario.mutateAsync(payload)
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
          <h3 className="text-base font-extrabold text-fg">👤 {editingUsuario ? 'Editar usuario' : 'Nuevo usuario'}</h3>
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
              placeholder="Nombre del responsable"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Correo</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="responsable@universidad.edu.co"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Cargo</label>
            <input
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder="Coordinador, analista, investigador..."
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Institución</label>
            <select value={institucionId} onChange={(e) => setInstitucionId(e.target.value)} className={inputClass}>
              <option value="">Sin institución</option>
              {instituciones?.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Contraseña de acceso</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={editingUsuario ? 'Dejar en blanco para no cambiarla' : 'Opcional: define su contraseña de acceso'}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Roles</label>
            <div className="border border-border rounded-md p-2.5 flex flex-col gap-1.5 bg-surface">
              {opcionesRoles.map((rol) => (
                <label key={rol.codigo} className="flex items-center gap-2 text-sm text-fg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rolesSeleccionados.has(rol.codigo)}
                    onChange={() => toggleRol(rol.codigo)}
                  />
                  {rol.nombre}
                </label>
              ))}
            </div>
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
            {guardando ? 'Guardando…' : editingUsuario ? 'Guardar cambios' : 'Guardar usuario'}
          </button>
        </div>
      </div>
    </>
  )
}
