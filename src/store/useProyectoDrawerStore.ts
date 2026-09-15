import { create } from 'zustand'

interface ProyectoDrawerStore {
  open: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

export const useProyectoDrawerStore = create<ProyectoDrawerStore>((set) => ({
  open: false,
  openDrawer: () => set({ open: true }),
  closeDrawer: () => set({ open: false }),
}))
