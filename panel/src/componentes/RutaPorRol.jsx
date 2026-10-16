import { Navigate, Outlet } from 'react-router-dom'
import { useSesion } from '../hooks/useSesion'

// <Route element={<RutaPorRol rol="vendedor" />}> ... </Route>
// Sin rol solo pide sesion (cualquier rol del panel), por ejemplo para "Mi perfil".
export default function RutaPorRol({ rol }) {
  const { usuario } = useSesion()

  if (!usuario) return <Navigate to="/login" replace />
  if (rol && usuario.rol !== rol) return <Navigate to="/" replace />

  return <Outlet />
}
