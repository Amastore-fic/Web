import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cambiarEstadoUsuario, listarUsuarios } from '../servicios/usuariosAdmin'
 
const CLAVE = ['admin', 'usuarios']
 
export function useListaUsuarios(filtros) {
  return useQuery({
    queryKey: [...CLAVE, filtros],
    queryFn: () => listarUsuarios(filtros),
    placeholderData: keepPreviousData, // evita parpadeos al cambiar de pagina o filtro
  })
}
 
export function useCambiarEstadoUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, activo }) => cambiarEstadoUsuario(id, activo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLAVE }),
  })
}