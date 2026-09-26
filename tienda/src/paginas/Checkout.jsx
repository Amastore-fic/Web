import Pendiente from '../componentes/Pendiente'

// Funcionalidades 5 y 6: direccion -> POST /pedidos -> POST /pedidos/{id}/pago
export default function Checkout() {
  return (
    <Pendiente titulo="Confirmar compra">
      1) Elegir o capturar direccion (GET/POST /direcciones). 2) Revisar resumen y confirmar (POST
      /pedidos; si faltan existencias, regresar al carrito indicando el producto). 3) Pagar (POST
      /pedidos/:id/pago); si se rechaza, conservar el carrito y permitir reintentar.
    </Pendiente>
  )
}
