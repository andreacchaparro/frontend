import { create } from 'zustand'
import type { FuenteDatos } from '@/types'

interface FuenteDrawerStore {
  open: boolean
  editingFuente: FuenteDatos | null
  proyectoContextId: number | null
  openDrawer: (options?: { fuente?: FuenteDatos; proyectoContextId?: number | null }) => void
  closeDrawer: () => void
}

export const useFuenteDrawerStore = create<FuenteDrawerStore>((set) => ({
  open: false,
  editingFuente: null,
  proyectoContextId: null,
  openDrawer: ({ fuente = undefined, proyectoContextId = null } = {}) =>
    set({ open: true, editingFuente: fuente ?? null, proyectoContextId }),
  closeDrawer: () => set({ open: false, editingFuente: null, proyectoContextId: null }),
}))
