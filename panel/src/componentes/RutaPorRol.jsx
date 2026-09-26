import { Navigate, Outlet } from 'react-router-dom'
import { useSesion } from '../hooks/useSesion'

// <Route element={<RutaPorRol rol="vendedor" />}> ... </Route>
export default function RutaPorRol({ rol }) {
  const { usuario } = useSesion()

  if (!usuario) return <Navigate to="/login" replace />
  if (usuario.rol !== rol) return <Navigate to="/" replace />

  return <Outlet />
}
