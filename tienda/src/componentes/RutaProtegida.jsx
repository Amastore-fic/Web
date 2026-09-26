import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSesion } from '../hooks/useSesion'

// Solo deja pasar a clientes con sesion. La API vuelve a validar el rol en cada llamada.
export default function RutaProtegida() {
  const location = useLocation()
  const { usuario } = useSesion()

  if (!usuario || usuario.rol !== 'cliente') {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  }

  return <Outlet />
}
