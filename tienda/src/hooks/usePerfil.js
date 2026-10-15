import { useQuery } from '@tanstack/react-query'
import { obtenerPerfil } from '@shared/perfil/perfil'
import { api } from '../api'

// GET /auth/perfil. Lo comparten "Mi cuenta" y sus subpaginas (una sola peticion).
export function usePerfil() {
  return useQuery({
    queryKey: ['perfil'],
    queryFn: () => obtenerPerfil(api),
  })
}
