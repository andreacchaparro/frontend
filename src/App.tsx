import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home } from '@/pages/Home'
import { MapaInteractivo } from '@/pages/MapaInteractivo'
import { DashboardIndicadores } from '@/pages/DashboardIndicadores'
import { Participacion } from '@/pages/Participacion'
import { InsightsIA } from '@/pages/InsightsIA'
import { Educacion } from '@/pages/Educacion'
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
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mapas" element={<MapaInteractivo />} />
            <Route path="/dashboard" element={<DashboardIndicadores />} />
            <Route path="/reportar" element={<Participacion />} />
            <Route path="/insights" element={<InsightsIA />} />
            <Route path="/educacion" element={<Educacion />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
