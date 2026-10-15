import { CAMPOS_DATOS } from '@shared/perfil/campos'
import FormularioPerfil from '../../componentes/perfil/FormularioPerfil'
import PaginaCuenta from '../../componentes/perfil/PaginaCuenta'

export default function DatosPersonales() {
  return (
    <PaginaCuenta titulo="Datos personales" descripcion="Tu nombre y tu teléfono de contacto.">
      {(perfil) => (
        <FormularioPerfil
          id="datos"
          campos={CAMPOS_DATOS}
          perfil={perfil}
          mensajeExito="Tus datos se guardaron."
        />
      )}
    </PaginaCuenta>
  )
}
