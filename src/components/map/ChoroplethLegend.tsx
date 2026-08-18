import { Select } from '@/components/common/Select'
import { COLOR_LOW, COLOR_MID, COLOR_HIGH, METRIC_LABELS, type MetricField } from '@/utils/choropleth'

interface Props {
  metric: MetricField
  onMetricChange: (metric: MetricField) => void
  min: number
  max: number
  unidad?: string
}

export function ChoroplethLegend({ metric, onMetricChange, min, max, unidad }: Props) {
  return (
    <div className="absolute top-3 right-16 z-10 flex flex-col gap-2 rounded-md border border-slate-300 bg-white/95 px-3 py-2 shadow-sm dark:border-slate-600 dark:bg-slate-800/95">
      <div className="w-40">
        <Select
          label="Métrica"
          value={metric}
          options={Object.entries(METRIC_LABELS).map(([value, label]) => ({ value, label }))}
          onChange={(v) => onMetricChange(v as MetricField)}
        />
      </div>
      <div
        className="h-2.5 w-40 rounded-full"
        style={{ background: `linear-gradient(to right, ${COLOR_LOW}, ${COLOR_MID}, ${COLOR_HIGH})` }}
      />
      <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
        <span>
          {min.toLocaleString('es-CO', { maximumFractionDigits: 2 })} {unidad ?? ''}
        </span>
        <span>
          {max.toLocaleString('es-CO', { maximumFractionDigits: 2 })} {unidad ?? ''}
        </span>
      </div>
    </div>
  )
}
