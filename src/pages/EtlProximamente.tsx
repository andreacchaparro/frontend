import { useSearchParams } from 'react-router-dom'

interface Props {
  titulo: string
}

// Placeholder para rutas /etl/* cuyo origen en el prototipo (backend/docs/pages/)
// todavía no se migró a React — ver plan de migración en
// context/personal/tasks/inprogress/migrar-etl-datos-a-frontend.md
export function EtlProximamente({ titulo }: Props) {
  const [searchParams] = useSearchParams()
  const query = searchParams.toString()

  return (
    <div className="flex-1 p-6 max-w-3xl mx-auto w-full flex flex-col items-center justify-center text-center gap-2 min-h-[50vh]">
      <p className="text-3xl" aria-hidden>
        🚧
      </p>
      <h1 className="text-lg font-bold text-fg">{titulo}</h1>
      <p className="text-sm text-fg-muted">Esta sección todavía está en migración desde el prototipo.</p>
      {query && <p className="text-xs text-fg-subtle font-mono mt-2">?{query}</p>}
    </div>
  )
}
