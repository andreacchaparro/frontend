import { create } from 'zustand'
import type { Responsable } from '@/types'

interface UsuarioDrawerStore {
  open: boolean
  editingUsuario: Responsable | null
  openDrawer: (usuario?: Responsable) => void
  closeDrawer: () => void
}

export const useUsuarioDrawerStore = create<UsuarioDrawerStore>((set) => ({
  open: false,
  editingUsuario: null,
  openDrawer: (usuario) => set({ open: true, editingUsuario: usuario ?? null }),
  closeDrawer: () => set({ open: false, editingUsuario: null }),
}))
