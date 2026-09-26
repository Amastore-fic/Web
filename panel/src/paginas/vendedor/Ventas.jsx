import Pendiente from '../../componentes/Pendiente'

// Funcionalidad 7 (vista del vendedor): GET /vendedor/pedidos
export default function Ventas() {
  return (
    <Pendiente titulo="Mis ventas">
      Pedidos que incluyen productos del vendedor: folio, fecha, cliente, total y estado.
    </Pendiente>
  )
}
