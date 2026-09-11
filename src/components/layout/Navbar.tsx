import { NavLink } from 'react-router-dom'
import { useThemeStore } from '@/store/useThemeStore'

const LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/mapas', label: 'Mapas' },
  { to: '/dashboard', label: 'Datos' },
  { to: '/reportar', label: 'Reportar' },
  { to: '/educacion', label: 'Educación' },
  { to: '/chat', label: 'Chat' },
]

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="h-14 shrink-0 bg-panel border-b border-border flex items-center px-6 gap-6 sticky top-0 z-30">
      <NavLink to="/" className="flex items-center gap-2 shrink-0">
        <span className="text-xl" aria-hidden>
          🌿
        </span>
        <div>
          <h1 className="text-sm font-bold tracking-wide uppercase text-green-800 dark:text-green-400 leading-none">
            Colflux
          </h1>
          <p className="text-xs text-fg-muted leading-none mt-0.5">
            Gases de Efecto Invernadero · Colombia
          </p>
        </div>
      </NavLink>

      <nav className="hidden md:flex items-center gap-1 ml-4">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'text-green-700 dark:text-green-400 bg-green-700/10'
                  : 'text-fg-muted hover:text-fg hover:bg-surface'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="text-xs bg-surface border border-border text-fg-muted hover:text-fg px-3 py-1.5 rounded-full font-medium transition-colors"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
        </button>
        <button className="text-xs bg-green-700 hover:bg-green-800 text-white px-4 py-1.5 rounded-full font-semibold transition-colors">
          Iniciar sesión
        </button>
      </div>
    </header>
  )
}
