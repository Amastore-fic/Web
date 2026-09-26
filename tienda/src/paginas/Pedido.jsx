import Pendiente from '../componentes/Pendiente'

// Funcionalidades 7 y 8: GET /pedidos/{id} y, si esta pagado, calificar cada producto
export default function Pedido() {
  return (
    <Pendiente titulo="Detalle del pedido">
      Mostrar folio, estado, direccion de envio y detalle. Si el pedido esta pagado, permitir
      calificar cada producto (POST /productos/:id/calificaciones).
    </Pendiente>
  )
}
