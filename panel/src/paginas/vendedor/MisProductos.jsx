import Pendiente from '../../componentes/Pendiente'

// Funcionalidad 2: GET/POST /vendedor/productos, PUT/DELETE /vendedor/productos/{id}
export default function MisProductos() {
  return (
    <Pendiente titulo="Mis productos">
      Tabla de publicaciones (activas y retiradas) con acciones editar y retirar, y formulario de
      alta con titulo, descripcion, precio, existencias, categoria e imagen. Todos los campos son
      obligatorios salvo la imagen.
    </Pendiente>
  )
}
