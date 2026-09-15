import { useQuery } from '@tanstack/react-query'
import { reglasService } from '@/services/reglas.service'

// Mismo queryKey que useReglasAutollenado (comparten caché/fetch); esta
// variante expone la lista cruda en vez del Record indexado por campo,
// para poder filtrar por campo en reglas-campo.
export function useReglasAutollenadoLista() {
  return useQuery({
    queryKey: ['reglas-autollenado'],
    queryFn: () => reglasService.listReglasAutollenado(),
  })
}
