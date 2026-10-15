import { CAMPOS_CORREO } from '@shared/perfil/campos'
import FormularioPerfil from '../../componentes/perfil/FormularioPerfil'
import PaginaCuenta from '../../componentes/perfil/PaginaCuenta'
import SeccionPassword from '../../componentes/perfil/SeccionPassword'

export default function Seguridad() {
  return (
    <PaginaCuenta titulo="Inicio de sesión y seguridad">
      {(perfil) => (
        <>
          <FormularioPerfil
            id="correo"
            titulo="Correo electrónico"
            descripcion="Es el correo con el que inicias sesión y al que te escribimos."
            campos={CAMPOS_CORREO}
            perfil={perfil}
            mensajeExito="Tu correo se actualizó."
          />
          <SeccionPassword />
        </>
      )}
    </PaginaCuenta>
  )
}
