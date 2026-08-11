import { create } from 'zustand'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    set({ theme: next })
  },
}))
