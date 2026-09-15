import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useLogout } from '@/hooks/useAuth'

const NOMBRES_NIVEL: Record<string, string> = {
  ciudadano: 'Ciudadano',
  investigador: 'Investigador',
  reportador: 'Reportador',
  admin: 'Administrador',
}

function iniciales(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/)
  const primeras = palabras.length > 1 ? [palabras[0], palabras[palabras.length - 1]] : [palabras[0]]
  return primeras.map((p) => p[0]?.toUpperCase() ?? '').join('')
}

export function UserMenu() {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useLogout()
  const [open, setOpen] = useState(false)

  if (!usuario) return null

  const rolesTexto = NOMBRES_NIVEL[usuario.nivel] || usuario.nivel

  return (
    <div className="relative flex items-center gap-2.5">
      <div className="hidden sm:flex flex-col items-end leading-tight">
        <span className="text-xs font-semibold text-fg">{usuario.nombre}</span>
        <span className="text-[10px] text-fg-subtle">{rolesTexto}</span>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        title={`${usuario.nombre} · ${rolesTexto}`}
        aria-label="Cuenta"
        className="w-8 h-8 shrink-0 rounded-full bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold flex items-center justify-center transition-colors"
      >
        {iniciales(usuario.nombre)}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 bg-panel border border-border rounded-md shadow-lg z-50 py-1 min-w-[170px]">
            <div className="px-3 py-2 border-b border-border sm:hidden">
              <p className="text-sm font-semibold text-fg">{usuario.nombre}</p>
              <p className="text-[10px] text-fg-subtle">{rolesTexto}</p>
            </div>
            <button
              onClick={() => {
                setOpen(false)
                logout.mutate()
              }}
              className="w-full text-left px-3 py-2 text-sm text-fg hover:bg-surface"
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  )
}
