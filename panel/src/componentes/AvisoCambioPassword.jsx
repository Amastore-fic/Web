import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { avisoOculto, ocultarAviso } from '@shared/perfil/avisoPassword'
import { puedeCambiarSinLaActual } from '@shared/perfil/perfil'
import { useSesion } from '../hooks/useSesion'

// Aparece al entrar con una contrasena temporal y recomienda cambiarla
export default function AvisoCambioPassword() {
  const { usuario } = useSesion()
  const { pathname } = useLocation()
  const hasta = usuario?.cambio_password_hasta
  const [oculto, setOculto] = useState(false)

  if (
    !puedeCambiarSinLaActual(usuario) ||
    pathname === '/restablecer-password' ||
    oculto ||
    avisoOculto(hasta)
  ) {
    return null
  }

  function ahoraNo() {
    ocultarAviso(hasta)
    setOculto(true)
  }

  return (
    <div role="status" className="border-b-2 border-amber-500 bg-amber-400 px-4 py-3.5">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 text-gray-900">
          <WarningAmberRoundedIcon className="shrink-0" aria-hidden="true" />
          <p className="text-sm">
            <strong className="block text-[15px] font-bold">
              Entraste con una contraseña temporal
            </strong>
            Ahora es tu contraseña. Te recomendamos cambiarla por una que puedas recordar.
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-4">
          <button
            type="button"
            onClick={ahoraNo}
            className="cursor-pointer text-sm font-medium text-gray-900 underline-offset-2 hover:underline"
          >
            Ahora no
          </button>
          <Link
            to="/restablecer-password"
            className="rounded-md bg-panel-oscuro hover:bg-panel-barra px-4 py-2.5 text-sm font-bold text-white"
          >
            Cambiar contraseña
          </Link>
        </div>
      </div>
    </div>
  )
}
