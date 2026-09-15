import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { Select } from '@/components/common/Select'

const CANALES = [
  { icon: '📄', title: 'Formulario web', desc: 'Completa el formulario', action: 'Ir al formulario' },
  { icon: '📘', title: 'Guía de reporte', desc: 'Aprende cómo reportar', action: 'Ver guía' },
]

const ETL_CARD = {
  icon: '📂',
  title: 'Gestión de Datos',
  desc: 'Proyectos, fuentes y carga de datos',
  action: 'Abrir panel de datos',
}

const ECOSISTEMAS = [
  { value: '', label: 'Selecciona un ecosistema' },
  { value: 'paramo', label: 'Páramo' },
  { value: 'humedal', label: 'Humedal' },
  { value: 'bosque', label: 'Bosque andino' },
  { value: 'otro', label: 'Otro' },
]

export function Participacion() {
  const [enviado, setEnviado] = useState(false)
  const [ecosistema, setEcosistema] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [descripcion, setDescripcion] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-xl font-bold text-fg">Reporta información desde tu territorio</h1>
        <p className="text-sm text-fg-muted mt-1">
          Tu información es muy importante para entender y cuidar nuestros ecosistemas.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CANALES.map((c) => (
          <Card key={c.title} className="flex flex-col items-start gap-2">
            <span className="text-xl" aria-hidden>
              {c.icon}
            </span>
            <p className="text-sm font-semibold text-fg">{c.title}</p>
            <p className="text-xs text-fg-muted">{c.desc}</p>
            <button
              type="button"
              className="mt-auto text-xs font-semibold text-brand-teal dark:text-brand-teal-bright hover:underline"
            >
              {c.action} →
            </button>
          </Card>
        ))}

        <Card className="flex flex-col items-start gap-2">
          <span className="text-xl" aria-hidden>
            {ETL_CARD.icon}
          </span>
          <p className="text-sm font-semibold text-fg">{ETL_CARD.title}</p>
          <p className="text-xs text-fg-muted">{ETL_CARD.desc}</p>
          <Link
            to="/data"
            className="mt-auto text-xs font-semibold text-brand-teal dark:text-brand-teal-bright hover:underline"
          >
            {ETL_CARD.action} →
          </Link>
        </Card>
      </div>

      <Card title="Nuevo reporte" className="max-w-2xl">
        {enviado ? (
          <div className="text-center py-8">
            <p className="text-2xl" aria-hidden>
              ✅
            </p>
            <p className="mt-2 text-sm font-semibold text-fg">¡Gracias por tu reporte!</p>
            <p className="text-xs text-fg-muted mt-1">
              Tu información quedó registrada localmente en esta demo (aún no se envía a un
              servidor).
            </p>
            <button
              onClick={() => {
                setEnviado(false)
                setEcosistema('')
                setUbicacion('')
                setDescripcion('')
              }}
              className="mt-4 text-xs font-semibold text-brand-teal dark:text-brand-teal-bright hover:underline"
            >
              Enviar otro reporte
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Select
              label="Tipo de observación"
              value={ecosistema}
              options={ECOSISTEMAS}
              onChange={setEcosistema}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-fg-muted font-medium">Ubicación</label>
              <input
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Busca un lugar o descríbelo"
                className="bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-fg-muted font-medium">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Cuéntanos lo que observaste…"
                className="bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal resize-none"
              />
              <p className="text-xs text-fg-subtle text-right">{descripcion.length}/500</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-fg-muted font-medium">Foto (opcional)</label>
              <div className="border border-dashed border-border rounded-md p-4 flex items-center justify-center text-fg-subtle text-xs gap-2">
                <span aria-hidden>📷</span> Agrega una foto
              </div>
            </div>

            <button
              type="submit"
              className="bg-brand-teal hover:bg-brand-teal-dark text-white px-4 py-2.5 rounded-md font-semibold text-sm transition-colors"
            >
              Enviar mensaje
            </button>
          </form>
        )}
      </Card>
    </div>
  )
}
