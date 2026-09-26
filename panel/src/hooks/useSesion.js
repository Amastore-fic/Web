import { createContext, useContext } from 'react'

export const SesionContext = createContext(null)

// { usuario, iniciar(correo, password), cerrar() } — ver componentes/SesionProvider.jsx
export function useSesion() {
  return useContext(SesionContext)
}
