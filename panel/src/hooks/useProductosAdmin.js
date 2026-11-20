import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cambiarEstadoProductoAdmin, listarProductosAdmin } from '../servicios/productosAdmin'

const CLAVE = ['admin', 'productos']

export function useListaProductosAdmin(filtros) {
  return useQuery({
    queryKey: [...CLAVE, filtros],
    queryFn: () => listarProductosAdmin(filtros),
    placeholderData: keepPreviousData,
  })
}

export function useCambiarEstadoProductoAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, estado }) => cambiarEstadoProductoAdmin(id, estado),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLAVE }),
  })
}