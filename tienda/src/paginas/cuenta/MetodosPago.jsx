import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import PaginaCuenta from '../../componentes/perfil/PaginaCuenta'
import { TarjetaPerfil } from '../../componentes/perfil/PiezasPerfil'

// Solo la estructura de la pantalla: los metodos de pago aun no existen en la API
// (el pago del MVP es simulado y se captura en el checkout). Nada aqui guarda datos.
export default function MetodosPago() {
  return (
    <PaginaCuenta titulo="Métodos de pago" descripcion="Guarda tus tarjetas para pagar más rápido.">
      {() => (
        <>
          <p
            role="status"
            className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800"
          >
            Próximamente: por ahora el pago se captura al confirmar cada compra.
          </p>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <button
                type="button"
                disabled
                className="flex h-full min-h-40 w-full cursor-not-allowed flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white text-gray-400"
              >
                <AddCardRoundedIcon sx={{ fontSize: 40 }} />
                <span className="text-[17px] font-semibold">Agregar tarjeta</span>
              </button>
            </li>
          </ul>

          <TarjetaPerfil id="historial-pagos" titulo="Tus transacciones">
            <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-gray-500">
              <CreditCardOutlinedIcon sx={{ fontSize: 36 }} />
              Aquí verás los pagos de tus pedidos.
            </div>
          </TarjetaPerfil>
        </>
      )}
    </PaginaCuenta>
  )
}
