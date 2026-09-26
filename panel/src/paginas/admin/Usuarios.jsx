import Pendiente from '../../componentes/Pendiente'

// GET /admin/usuarios y PATCH /admin/usuarios/{id}/estado
export default function Usuarios() {
  return (
    <Pendiente titulo="Usuarios">
      Lista de clientes y vendedores filtrable por rol, con accion para bloquear o desbloquear la
      cuenta.
    </Pendiente>
  )
}
