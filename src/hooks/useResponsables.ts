import { useQuery } from '@tanstack/react-query'
import { responsablesService } from '@/services/responsables.service'

export function useResponsables() {
  return useQuery({
    queryKey: ['responsables'],
    queryFn: () => responsablesService.listResponsables(),
  })
}
