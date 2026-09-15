import { useQuery } from '@tanstack/react-query'
import { usuariosService } from '@/services/usuarios.service'

export function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuariosService.listUsuarios(),
  })
}
