import { useAuthStore } from '@/store/useAuthStore'
import type { NivelAcceso } from '@/types'

const NIVELES_ACCESO: NivelAcceso[] = ['ciudadano', 'investigador', 'reportador', 'admin']

export function useRolActual() {
  const usuario = useAuthStore((s) => s.usuario)
  const nivel = usuario?.nivel ?? 'ciudadano'

  const tieneNivel = (minimo: NivelAcceso) =>
    NIVELES_ACCESO.indexOf(nivel) >= NIVELES_ACCESO.indexOf(minimo)

  return {
    usuario,
    nivel,
    tieneNivel,
    puedeDescargar: tieneNivel('investigador'),
    puedeSubirDatos: tieneNivel('reportador'),
    isAdmin: nivel === 'admin',
  }
}
