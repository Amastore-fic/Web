import { crearClienteApi } from '@shared/api/cliente'
import { crearSesion } from '@shared/sesion/sesion'

export const sesion = crearSesion('panel')

export const api = crearClienteApi({
  baseUrl: import.meta.env.VITE_API_URL,
  sesion,
  alNoAutenticado: () => window.location.assign(`${import.meta.env.BASE_URL}login`),
})
