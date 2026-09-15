interface Props {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  loading?: boolean
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="bg-panel border border-border rounded-xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-fg">{title}</h3>
        <p className="text-sm text-fg-muted">{description}</p>
        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="bg-surface border border-border text-fg-muted hover:text-fg disabled:opacity-50 text-sm font-semibold px-4 py-2 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`text-white text-sm font-bold px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${
              danger ? 'bg-amber-600 hover:bg-amber-700' : 'bg-brand-teal hover:bg-brand-teal-dark'
            }`}
          >
            {loading ? 'Procesando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
