import { api } from '../api'

export function listarProductosAdmin({ pagina = 1, porPagina = 6, buscar, estado, idCategoria }) {
  return api.get('/admin/productos', {
    page: pagina,
    por_pagina: porPagina,
    buscar,
    estado,
    id_categoria: idCategoria,
  })
}

export function cambiarEstadoProductoAdmin(id, estado) {
  return api.patch(`/admin/productos/${id}/estado`, { estado })
}