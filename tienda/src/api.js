import { crearClienteApi } from '@shared/api/cliente'
import { crearSesion } from '@shared/sesion/sesion'

export const sesion = crearSesion('tienda')

export const api = crearClienteApi({
  baseUrl: import.meta.env.VITE_API_URL,
  sesion,
  alNoAutenticado: () => window.location.assign('/login'),
})
