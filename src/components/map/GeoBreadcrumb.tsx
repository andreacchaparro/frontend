interface BreadcrumbItem {
  label: string
  onClick?: () => void
}

interface Props {
  items: BreadcrumbItem[]
  onReset?: () => void
  showReset?: boolean
}

export function GeoBreadcrumb({ items, onReset, showReset }: Props) {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-md border border-slate-300 bg-white/95 px-3 py-1.5 shadow-sm dark:border-slate-600 dark:bg-slate-800/95">
      <nav className="flex items-center gap-1 text-xs">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-slate-400 dark:text-slate-500">/</span>}
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="font-medium text-slate-700 hover:text-slate-900 hover:underline dark:text-slate-200 dark:hover:text-white"
              >
                {item.label}
              </button>
            ) : (
              <span className="font-semibold text-slate-900 dark:text-white">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
      {showReset && (
        <button
          type="button"
          onClick={onReset}
          className="ml-1 border-l border-slate-300 pl-2 text-xs text-slate-500 hover:text-slate-800 dark:border-slate-600 dark:text-slate-400 dark:hover:text-slate-100"
          title="Volver arriba"
        >
          ⤒ Volver arriba
        </button>
      )}
    </div>
  )
}
