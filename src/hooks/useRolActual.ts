import { useAuthStore } from '@/store/useAuthStore'

const ROL_ADMIN = 'admin_datos'

export function useRolActual() {
  const usuario = useAuthStore((s) => s.usuario)
  const roles = usuario?.roles ?? []

  return {
    usuario,
    roles,
    isAdmin: roles.includes(ROL_ADMIN),
  }
}
