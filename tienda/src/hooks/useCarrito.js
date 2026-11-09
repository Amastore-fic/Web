import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'

// Todas las rutas del carrito responden el carrito completo: con eso se actualiza la
// cache y no hace falta volver a pedirlo. Totales y subtotales los calcula la API.
//   GET    /carrito
//   POST   /carrito/items        { id_producto, cantidad }
//   PUT    /carrito/items/{id}   { cantidad }
//   DELETE /carrito/items/{id}
const CLAVE = ['carrito']

export function useCarrito() {
  return useQuery({ queryKey: CLAVE, queryFn: () => api.get('/carrito') })
}

function useCambioCarrito(llamada) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: llamada,
    onSuccess: (carrito) => queryClient.setQueryData(CLAVE, carrito),
  })
}

export function useAgregarAlCarrito() {
  return useCambioCarrito(({ idProducto, cantidad }) =>
    api.post('/carrito/items', { id_producto: idProducto, cantidad })
  )
}

export function useCambiarCantidad() {
  return useCambioCarrito(({ idItem, cantidad }) =>
    api.put(`/carrito/items/${idItem}`, { cantidad })
  )
}

export function useQuitarDelCarrito() {
  return useCambioCarrito((idItem) => api.delete(`/carrito/items/${idItem}`))
}

// Primer mensaje de error de la API: el de un campo (cantidad, id_producto) o el general
export function mensajeCarrito(error) {
  const deCampo = Object.values(error?.errores ?? {})[0]?.[0]
  if (deCampo) return deCampo
  if (!error?.estado) return 'No se pudo conectar con el servidor. Intenta de nuevo.'
  return error.message
}
