import { CAMPOS_NEGOCIO } from '@shared/perfil/campos'
import FormularioPerfil from '../../componentes/perfil/FormularioPerfil'
import PaginaCuenta from '../../componentes/perfil/PaginaCuenta'

// Datos con los que el comprador identifica al vendedor (solo rol vendedor)
export default function MiNegocio() {
  return (
    <PaginaCuenta
      titulo="Mi negocio"
      descripcion="Así te identifican los compradores en el catálogo."
    >
      {(perfil) => (
        <>
          {perfil.vendedor?.codigo_vendedor && (
            <p className="text-sm text-panel-tenue">
              Código de vendedor:{' '}
              <span className="font-mono font-semibold text-panel-oscuro">
                {perfil.vendedor.codigo_vendedor}
              </span>
            </p>
          )}
          <FormularioPerfil
            id="negocio"
            campos={CAMPOS_NEGOCIO}
            perfil={perfil}
            origen={(usuario) => usuario.vendedor}
            mensajeExito="Los datos de tu negocio se guardaron."
          />
        </>
      )}
    </PaginaCuenta>
  )
}
