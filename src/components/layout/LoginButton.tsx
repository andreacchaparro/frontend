import { useState } from 'react'
import { LoginModal } from '@/components/layout/LoginModal'

export function LoginButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs bg-brand-yellow hover:bg-brand-yellow-dark text-brand-brown px-4 py-1.5 rounded-full font-semibold transition-colors"
      >
        Iniciar sesión
      </button>
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
