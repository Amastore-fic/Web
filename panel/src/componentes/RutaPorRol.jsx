import { Navigate, Outlet } from 'react-router-dom'
import { esAdministrador } from '@shared/sesion/traspaso'
import { useSesion } from '../hooks/useSesion'

// <Route element={<RutaPorRol rol="vendedor" />}> ... </Route>
// Sin rol solo pide sesion (cualquier rol del panel), por ejemplo para "Mi perfil".
// rol="administrador" tambien deja pasar al superadmin.
export default function RutaPorRol({ rol }) {
  const { usuario } = useSesion()

  if (!usuario) return <Navigate to="/login" replace />
  const permitido = rol === 'administrador' ? esAdministrador(usuario.rol) : usuario.rol === rol
  if (rol && !permitido) return <Navigate to="/" replace />

  return <Outlet />
}
