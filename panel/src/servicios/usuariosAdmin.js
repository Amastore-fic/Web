import { api } from '../api'
 
// GET /admin/usuarios?page=&por_pagina=&buscar=&rol=&activo=
// `activo` se envia como '1' o '0'; los valores vacios los ignora el cliente HTTP.
export function listarUsuarios({ pagina = 1, porPagina = 6, buscar, rol, activo }) {
  return api.get('/admin/usuarios', {
    page: pagina,
    por_pagina: porPagina,
    buscar,
    rol,
    activo,
  })
}
 
// PATCH /admin/usuarios/{id}/estado { activo: boolean }
// Responde { message, usuario }
export function cambiarEstadoUsuario(id, activo) {
  return api.patch(`/admin/usuarios/${id}/estado`, { activo })
}