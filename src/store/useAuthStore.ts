import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Responsable } from '@/types'

interface AuthStore {
  token: string | null
  usuario: Responsable | null
  setSesion: (token: string, usuario: Responsable) => void
  cerrarSesion: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      setSesion: (token, usuario) => set({ token, usuario }),
      cerrarSesion: () => set({ token: null, usuario: null }),
    }),
    { name: 'colflux-auth' }
  )
)
