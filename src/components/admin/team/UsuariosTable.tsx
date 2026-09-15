import { useMemo, useState } from 'react'
import { ConfirmModal } from '@/components/common/ConfirmModal'
import { useUsuarioDrawerStore } from '@/store/useUsuarioDrawerStore'
import { useEliminarUsuario } from '@/hooks/useUsuarioMutations'
import type { Responsable } from '@/types'

interface Props {
  usuarios: Responsable[]
  isLoading: boolean
}

export function UsuariosTable({ usuarios, isLoading }: Props) {
  const { openDrawer } = useUsuarioDrawerStore()
  const eliminar = useEliminarUsuario()
  const [busqueda, setBusqueda] = useState('')
  const [aBorrar, setABorrar] = useState<Responsable | null>(null)

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return usuarios
    return usuarios.filter(
      (r) =>
        r.nombre.toLowerCase().includes(q) ||
        (r.cargo || '').toLowerCase().includes(q) ||
        (r.correo || r.correo_institucional || '').toLowerCase().includes(q) ||
        (r.institucion_nombre || '').toLowerCase().includes(q) ||
        r.nivel.toLowerCase().includes(q)
    )
  }, [usuarios, busqueda])

  function confirmarBorrar() {
    if (!aBorrar) return
    eliminar.mutate(aBorrar.id, { onSuccess: () => setABorrar(null) })
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex gap-2.5 items-center flex-wrap">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, cargo, correo, institución o rol"
          className="flex-1 min-w-[240px] max-w-[420px] bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal"
        />
        <span className="ml-auto text-xs text-fg-muted font-semibold">
          {isLoading ? 'Cargando…' : `${usuarios.length} usuario${usuarios.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      <div className="overflow-x-auto border border-border rounded-xl bg-panel">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              {['Nombre', 'Cargo', 'Correo', 'Institución', 'Nivel', 'Acciones'].map((h) => (
                <th
                  key={h}
                  className="bg-surface px-3.5 py-3 text-left text-xs font-bold uppercase tracking-wider text-fg-muted border-b border-border"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-fg-muted py-9">
                  {isLoading ? 'Cargando usuarios…' : 'No hay usuarios para mostrar.'}
                </td>
              </tr>
            ) : (
              filtrados.map((r) => {
                const correo = r.correo || r.correo_institucional || ''
                return (
                  <tr key={r.id} className="hover:bg-surface">
                    <td className="px-3.5 py-3 border-b border-border align-top">
                      <div className="font-extrabold text-fg">{r.nombre}</div>
                      <div className="text-xs text-fg-muted">ID {r.id}</div>
                    </td>
                    <td className="px-3.5 py-3 border-b border-border align-top">
                      {r.cargo || <span className="text-fg-muted">Sin cargo</span>}
                    </td>
                    <td className="px-3.5 py-3 border-b border-border align-top">
                      {correo ? (
                        <a href={`mailto:${correo}`} className="text-brand-teal-dark dark:text-brand-teal-bright">
                          {correo}
                        </a>
                      ) : (
                        <span className="text-fg-muted">Sin correo</span>
                      )}
                    </td>
                    <td className="px-3.5 py-3 border-b border-border align-top">
                      {r.institucion_nombre || <span className="text-fg-muted">Sin institución</span>}
                    </td>
                    <td className="px-3.5 py-3 border-b border-border align-top capitalize">
                      {r.nivel}
                    </td>
                    <td className="px-3.5 py-3 border-b border-border align-top">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => openDrawer(r)}
                          className="border border-border bg-panel hover:border-brand-teal hover:text-brand-teal-dark text-fg text-xs font-bold px-2.5 py-1.5 rounded-md transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setABorrar(r)}
                          className="border border-border bg-panel hover:border-red-500 hover:text-red-500 text-fg text-xs font-bold px-2.5 py-1.5 rounded-md transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={aBorrar != null}
        title="Eliminar usuario"
        description={`¿Eliminar el usuario "${aBorrar?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
        loading={eliminar.isPending}
        onConfirm={confirmarBorrar}
        onCancel={() => setABorrar(null)}
      />
    </div>
  )
}
