import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { Paginacion } from '@/components/common/Paginacion'
import { useProyectoDrawerStore } from '@/store/useProyectoDrawerStore'
import type { FuenteDatos, ProyectoResumen } from '@/types'

interface Props {
  proyectos: ProyectoResumen[]
  fuentes: FuenteDatos[]
  onVerFuentes: (proyectoId: number) => void
}

const LIMITE = 10

export function ProyectosTable({ proyectos, fuentes, onVerFuentes }: Props) {
  const openProyectoDrawer = useProyectoDrawerStore((s) => s.openDrawer)
  const [busqueda, setBusqueda] = useState('')
  const [offset, setOffset] = useState(0)

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return proyectos
    return proyectos.filter((p) => p.nombre.toLowerCase().includes(q))
  }, [proyectos, busqueda])

  const pagina = filtrados.slice(offset, offset + LIMITE)

  function resumenFuentes(proyectoId: number) {
    const delProyecto = fuentes.filter((f) => f.proyecto?.id === proyectoId)
    const completas = delProyecto.filter((f) => f.estado === 'completo').length
    const pendientes = delProyecto.filter((f) => f.estado === 'pendiente').length
    const errores = delProyecto.filter((f) => f.estado === 'con_errores').length
    return { total: delProyecto.length, completas, pendientes, errores }
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <h2 className="text-base font-extrabold text-fg">Administración de proyectos</h2>
          <p className="text-sm text-fg-muted mt-0.5">Consulta proyectos y revisa cuántas fuentes tiene cada uno.</p>
        </div>
        <button
          type="button"
          onClick={() => openProyectoDrawer()}
          className="bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-bold px-4 py-2 rounded-md transition-colors whitespace-nowrap"
        >
          ＋ Nuevo proyecto
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setOffset(0)
          }}
          placeholder="Buscar proyecto por nombre"
          className="flex-1 min-w-[200px] bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal"
        />
        <span className="text-sm text-fg-muted">
          {filtrados.length} proyecto{filtrados.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-surface">
              <th className="px-3.5 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-fg-muted">
                Proyecto
              </th>
              <th className="px-3.5 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-fg-muted">
                Fuentes asociadas
              </th>
              <th className="px-3.5 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-fg-muted">
                Estado de fuentes
              </th>
              <th className="px-3.5 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-fg-muted">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {pagina.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-fg-muted text-sm py-8">
                  No hay proyectos para mostrar.
                </td>
              </tr>
            ) : (
              pagina.map((p) => {
                const r = resumenFuentes(p.id)
                return (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-3.5 py-2.5 font-semibold text-fg">{p.nombre}</td>
                    <td className="px-3.5 py-2.5 text-fg">
                      <strong>{r.total}</strong> fuente{r.total === 1 ? '' : 's'}
                    </td>
                    <td className="px-3.5 py-2.5 text-fg-muted">
                      {r.completas} completas · {r.pendientes} pendientes · {r.errores} con errores
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => onVerFuentes(p.id)}
                          className="bg-surface border border-border text-fg-muted hover:text-fg text-xs font-semibold px-2.5 py-1.5 rounded-md"
                        >
                          Ver fuentes
                        </button>
                        <Link
                          to={`/etl/datos?proyecto=${p.id}`}
                          className="bg-surface border border-border text-fg-muted hover:text-fg text-xs font-semibold px-2.5 py-1.5 rounded-md"
                        >
                          📊 Ver datos cargados
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {filtrados.length > LIMITE && (
        <Paginacion
          offset={offset}
          limite={LIMITE}
          total={filtrados.length}
          filasCount={pagina.length}
          onAnterior={() => setOffset(Math.max(offset - LIMITE, 0))}
          onSiguiente={() => setOffset(offset + LIMITE)}
        />
      )}
    </Card>
  )
}
