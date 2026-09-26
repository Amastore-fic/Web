import { useQuery } from '@tanstack/react-query'
import { api } from '../api'

export function useProductos(filtros) {
  return useQuery({
    queryKey: ['productos', filtros],
    queryFn: () => api.get('/productos', filtros),
  })
}

export function useProducto(id) {
  return useQuery({
    queryKey: ['producto', id],
    queryFn: () => api.get(`/productos/${id}`),
  })
}

export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => api.get('/categorias'),
    staleTime: 5 * 60 * 1000,
  })
}
