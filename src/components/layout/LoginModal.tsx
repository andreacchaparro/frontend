import { useState, type FormEvent } from 'react'
import { useLogin } from '@/hooks/useAuth'

interface Props {
  open: boolean
  onClose: () => void
}

export function LoginModal({ open, onClose }: Props) {
  const login = useLogin()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!open) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await login.mutateAsync({ correo: correo.trim(), password })
      setCorreo('')
      setPassword('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-panel border border-border rounded-xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-fg">Iniciar sesión</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-fg">Correo</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              autoFocus
              className="bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-fg">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-surface border border-border text-fg text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>
          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
          <div className="flex justify-end gap-2.5 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="bg-surface border border-border text-fg-muted hover:text-fg text-sm font-semibold px-4 py-2 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={login.isPending}
              className="bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-md transition-colors"
            >
              {login.isPending ? 'Ingresando…' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
