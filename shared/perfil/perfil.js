// Llamadas de la seccion "Mi perfil", compartidas por tienda y panel.
// Cada funcion recibe el cliente de la app (import { api } from '../api').
//
// Contrato con la API (los marcados con * todavia no existen en el backend):
//   GET    /auth/perfil            -> usuario con su vendedor (si es vendedor)
//   PUT    /auth/perfil          * -> { nombre, apellido, correo, telefono } y, si es vendedor,
//                                     { nombre_comercial, sucursal, descripcion }. Solo se
//                                     cambian los campos enviados. Responde el usuario actualizado.
//   PUT    /auth/password        * -> { password_actual, password, password_confirmation }
//   GET    /direcciones            -> direcciones del cliente
//   POST   /direcciones            -> crea una direccion
//   PUT    /direcciones/{id}     * -> edita una direccion propia
//   DELETE /direcciones/{id}     * -> borra una direccion propia (los pedidos guardan su copia)

import { mensajeApi } from '../utilidades/validaciones'

export const obtenerPerfil = (api) => api.get('/auth/perfil')
export const actualizarPerfil = (api, datos) => api.put('/auth/perfil', datos)
export const cambiarPassword = (api, datos) => api.put('/auth/password', datos)

export const listarDirecciones = (api) => api.get('/direcciones')
export const crearDireccion = (api, datos) => api.post('/direcciones', datos)
export const actualizarDireccion = (api, id, datos) => api.put(`/direcciones/${id}`, datos)
export const eliminarDireccion = (api, id) => api.delete(`/direcciones/${id}`)

export const ETIQUETAS_ROL = {
  cliente: 'Cliente',
  vendedor: 'Vendedor',
  administrador: 'Administrador',
}

// Errores de validacion de la API ({ campo: ['mensaje'] }) a { campo: 'mensaje' }
export function erroresDeApi(error) {
  return Object.fromEntries(
    Object.entries(error?.errores ?? {}).map(([campo, mensajes]) => [
      campo,
      mensajeApi(mensajes[0]),
    ])
  )
}

// Mensaje general para un error que no es de un campo en particular
export function mensajeError(error) {
  // 404/405: la ruta aun no existe en la API (ver contrato arriba)
  if (error?.estado === 404 || error?.estado === 405) {
    return 'Esta opción todavía no está disponible en el servidor.'
  }
  if (Object.keys(error?.errores ?? {}).length > 0) return 'Revisa los campos marcados en rojo.'
  if (!error?.estado) return 'No se pudo conectar con el servidor. Intenta de nuevo.'
  return mensajeApi(error.message)
}
