import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Dashboard } from '@/pages/Dashboard'
import { useThemeStore } from '@/store/useThemeStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-surface text-fg flex flex-col">
        {/* navbar */}
        <header className="h-14 shrink-0 bg-panel border-b border-border flex items-center px-6 gap-3">
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
          <div className="ml-auto">
            <button
              onClick={toggleTheme}
              className="text-xs bg-surface border border-border text-fg-muted hover:text-fg px-3 py-1.5 rounded-full font-medium transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
            </button>
          </div>
        </header>

        <Dashboard />
      </div>
    </QueryClientProvider>
  )
}
