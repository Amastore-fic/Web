// Secciones del panel segun el rol. Las usan el encabezado y el pie de pagina.
export const MENU = {
  vendedor: [
    { a: '/vendedor/productos', texto: 'Mis productos' },
    { a: '/vendedor/pedidos', texto: 'Mis ventas' },
  ],
  administrador: [
    { a: '/admin/usuarios', texto: 'Usuarios' },
    { a: '/admin/pedidos', texto: 'Pedidos' },
    { a: '/admin/categorias', texto: 'Categorías' },
  ],
}

export const NOMBRE_SECCION = {
  vendedor: 'Vendedores',
  administrador: 'Administración',
}
