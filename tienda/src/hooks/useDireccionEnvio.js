import { createContext, useContext } from 'react'

export const DireccionEnvioContext = createContext(null)

// { direcciones, direccion, elegir(id), cargando } — ver componentes/DireccionEnvioProvider.jsx
export function useDireccionEnvio() {
  return useContext(DireccionEnvioContext)
}
