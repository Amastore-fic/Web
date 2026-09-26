import Pendiente from '../componentes/Pendiente'

// Funcionalidad 7: GET /pedidos
export default function Pedidos() {
  return (
    <Pendiente titulo="Mis pedidos">
      Listar pedidos con folio, fecha, total y estado; cada uno enlaza a /pedidos/:id.
    </Pendiente>
  )
}
