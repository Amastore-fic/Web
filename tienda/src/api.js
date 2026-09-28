import { crearClienteApi } from '@shared/api/cliente'
import { crearSesion } from '@shared/sesion/sesion'

export const sesion = crearSesion('tienda')

export const api = crearClienteApi({
  // Sin .env se usa la API local de Docker
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  sesion,
  alNoAutenticado: () => window.location.assign('/login'),
})
