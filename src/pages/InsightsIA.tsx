import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'

export function InsightsIA() {
  return (
    <div className="flex-1 p-6 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-fg flex items-center gap-2">
            Insights <Badge label="IA" color="#198A77" />
          </h1>
          <p className="text-sm text-fg-muted mt-1">
            Análisis generados automáticamente a partir de las tendencias observadas en la
            plataforma.
          </p>
        </div>
      </div>

      <Card>
        <div className="flex items-start gap-4">
          <span className="text-3xl shrink-0" aria-hidden>
            🤖
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-fg-muted uppercase tracking-wider mb-2">
              Análisis inteligente
            </h3>
            <p className="text-sm text-fg leading-relaxed">
              En los últimos años, el carbono almacenado en los ecosistemas monitoreados muestra
              variaciones asociadas a cambios en el uso del suelo y en las condiciones climáticas
              locales.
            </p>
            <p className="text-xs text-fg-muted font-semibold uppercase tracking-wider mt-4 mb-2">
              Factores asociados
            </p>
            <ul className="text-sm text-fg space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="text-fg-subtle">•</span> Cambio en uso del suelo
              </li>
              <li className="flex items-center gap-2">
                <span className="text-fg-subtle">•</span> Sequías más frecuentes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-fg-subtle">•</span> Presión por actividades agropecuarias
              </li>
            </ul>
            <button className="mt-4 text-xs font-semibold text-brand-teal dark:text-brand-teal-bright hover:underline">
              Ver análisis completo →
            </button>
          </div>
        </div>
      </Card>

      <Card title="Predicción a 2030">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface rounded-md p-4 border border-border">
            <p className="text-xs text-fg-muted font-semibold uppercase tracking-wider">
              Escenario actual
            </p>
            <p className="text-2xl font-bold text-red-500 mt-1">-8%</p>
            <p className="text-xs text-fg-subtle mt-1">carbono almacenado proyectado</p>
          </div>
          <div className="bg-surface rounded-md p-4 border border-border">
            <p className="text-xs text-fg-muted font-semibold uppercase tracking-wider">
              Escenario con restauración
            </p>
            <p className="text-2xl font-bold text-brand-green mt-1">+15%</p>
            <p className="text-xs text-fg-subtle mt-1">carbono almacenado proyectado</p>
          </div>
        </div>
        <p className="text-xs text-fg-subtle mt-4">
          * Modelos generados con IA. Información de referencia — no reemplaza el análisis
          técnico oficial.
        </p>
      </Card>
    </div>
  )
}
