import Pendiente from '../componentes/Pendiente'

// Funcionalidad 4 del MVP: GET /carrito, PUT/DELETE /carrito/items/{id}
export default function Carrito() {
  return (
    <Pendiente titulo="Carrito">
      {/* Mostrar lineas con cantidad editable, boton para eliminar, total calculado por la API y boton
      &quot;Confirmar compra&quot; que lleva a /checkout. */}
      Aqui se mostraran los productos agregados
    </Pendiente>
  )
}
