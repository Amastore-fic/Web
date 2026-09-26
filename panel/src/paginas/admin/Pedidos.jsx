import Pendiente from '../../componentes/Pendiente'

// GET /admin/pedidos
export default function Pedidos() {
  return (
    <Pendiente titulo="Supervision de pedidos">
      Todos los pedidos del sistema, filtrables por estado y vendedor.
    </Pendiente>
  )
}
