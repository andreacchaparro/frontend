import { useState } from 'react'
import { Card } from '@/components/common/Card'
import { ErdDiagram } from '@/components/db/ErdDiagram'
import { EntityExplorer } from '@/components/db/EntityExplorer'
import { CatalogoCampos } from '@/components/db/CatalogoCampos'
import { CATALOGO, TOTAL_ENTIDADES } from '@/utils/catalogoModel'

const primeraEntidad = CATALOGO.grupos[0]?.entidades[0]?.nombre ?? ''

export function DbModelo() {
  const [erdAbierta, setErdAbierta] = useState<string | null>(null)
  const [catalogoEntidad, setCatalogoEntidad] = useState(primeraEntidad)

  function seleccionarEnErd(nombre: string) {
    setErdAbierta((actual) => (actual === nombre ? null : nombre))
  }

  function seleccionarDesdeExplorador(nombre: string) {
    setErdAbierta(nombre)
    document.querySelector(`[data-erd-model="${nombre}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  function verEnCatalogo(nombre: string) {
    setCatalogoEntidad(nombre)
    document.getElementById('catalogo-seccion')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex-1 p-6 flex flex-col gap-8 max-w-[1140px] mx-auto w-full">
      <div>
        <h1 className="text-xl font-bold text-fg">Modelo de Base de Datos</h1>
        <p className="text-sm text-fg-muted mt-1">
          Esquema relacional del sistema COLFLUX: sitios de monitoreo, proyectos, flujo de cámaras, torres EC,
          caracterización de suelos y publicaciones científicas. {TOTAL_ENTIDADES} entidades en {CATALOGO.grupos.length}{' '}
          módulos.
        </p>
      </div>

      <section id="erd-seccion" className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-fg">Diagrama entidad-relación</h2>
          <p className="text-sm text-fg-muted mt-1">
            Generado desde <code>catalogo.json</code>. Haz clic en una entidad para ver sus campos.
          </p>
        </div>
        <ErdDiagram abierta={erdAbierta} onToggle={seleccionarEnErd} />
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-fg">Explorador de relaciones</h2>
          <p className="text-sm text-fg-muted mt-1">Selecciona una entidad en el diagrama para ver sus conexiones directas.</p>
        </div>
        <EntityExplorer
          entidadSeleccionada={erdAbierta}
          onSeleccionar={seleccionarDesdeExplorador}
          onVerEnCatalogo={verEnCatalogo}
        />
      </section>

      <section id="catalogo-seccion" className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-fg">Catálogo de campos</h2>
          <p className="text-sm text-fg-muted mt-1">
            Referencia de todas las entidades y campos disponibles en la base de datos. Úsala para identificar a qué
            atributo mapear los datos de tu archivo.
          </p>
        </div>
        <Card className="p-0">
          <div className="p-5">
            <CatalogoCampos entidadSeleccionada={catalogoEntidad} onSeleccionar={setCatalogoEntidad} />
          </div>
        </Card>
      </section>
    </div>
  )
}
