import { useQuery } from '@tanstack/react-query'
import { etlService } from '@/services/etl.service'

// React-query ya descarta resultados de una queryKey vieja cuando el
// usuario sigue editando y la key cambia (equivalente al "existenciaSeq"
// del prototipo) — no hace falta una guarda manual de secuencia.
export function useVerificarExistencia(
  fuenteId: number | null,
  modelo: string,
  campo: string,
  valores: string[]
) {
  return useQuery({
    queryKey: ['verificar-existencia', fuenteId, modelo, campo, valores],
    queryFn: () => etlService.verificarExistencia(fuenteId as number, modelo, campo, valores),
    enabled: fuenteId != null && Boolean(modelo) && Boolean(campo) && valores.length > 0,
    staleTime: 30_000,
  })
}
