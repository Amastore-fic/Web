import PaginaCuenta from '../../componentes/perfil/PaginaCuenta'
import SeccionDirecciones from '../../componentes/perfil/SeccionDirecciones'

export default function Direcciones() {
  return (
    <PaginaCuenta
      titulo="Direcciones"
      descripcion="Al confirmar una compra eliges a cuál de ellas enviarla."
    >
      {() => <SeccionDirecciones />}
    </PaginaCuenta>
  )
}
