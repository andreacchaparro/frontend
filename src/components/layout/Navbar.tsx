import { NavLink } from 'react-router-dom'
import { useThemeStore } from '@/store/useThemeStore'
import logoHorizontal from '@/assets/files/LOGO_FINAL_Horizontal.png'

const LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/mapas', label: 'Mapas' },
  { to: '/dashboard', label: 'Datos' },
  { to: '/reportar', label: 'Reportar' },
  { to: '/educacion', label: 'Educación' },
]

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="h-14 shrink-0 bg-panel border-b border-border flex items-center px-6 gap-6 sticky top-0 z-30">
      <NavLink to="/" className="flex items-center gap-3 shrink-0">
        <span className="dark:bg-white dark:rounded-md dark:px-2 dark:py-1 flex items-center">
          <img src={logoHorizontal} alt="Colflux" className="h-8 w-auto" />
        </span>
        <p className="hidden lg:block text-xs text-fg-muted leading-none border-l border-border pl-3">
          Gases de Efecto
          <br />
          Invernadero · Colombia
        </p>
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
                  ? 'text-brand-teal dark:text-brand-teal-bright bg-brand-teal/10'
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
        <button className="text-xs bg-brand-yellow hover:bg-brand-yellow-dark text-brand-brown px-4 py-1.5 rounded-full font-semibold transition-colors">
          Iniciar sesión
        </button>
      </div>
    </header>
  )
}
