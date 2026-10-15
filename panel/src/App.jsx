import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './componentes/Layout'
import RutaPorRol from './componentes/RutaPorRol'
import { useSesion } from './hooks/useSesion'
import Categorias from './paginas/admin/Categorias'
import PedidosAdmin from './paginas/admin/Pedidos'
import Usuarios from './paginas/admin/Usuarios'
import Login from './paginas/Login'
import NoEncontrado from './paginas/NoEncontrado'
import DatosPersonales from './paginas/cuenta/DatosPersonales'
import MiCuenta from './paginas/cuenta/MiCuenta'
import MiNegocio from './paginas/cuenta/MiNegocio'
import Seguridad from './paginas/cuenta/Seguridad'
import RegistroVendedor from './paginas/RegistroVendedor'
import MisProductos from './paginas/vendedor/MisProductos'
import Ventas from './paginas/vendedor/Ventas'

// Redirige a la pantalla principal segun el rol en sesion
function Inicio() {
  const { usuario } = useSesion()
  if (!usuario) return <Navigate to="/login" replace />
  return (
    <Navigate
      to={usuario.rol === 'administrador' ? '/admin/usuarios' : '/vendedor/productos'}
      replace
    />
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<RegistroVendedor />} />

        <Route path="vendedor" element={<RutaPorRol rol="vendedor" />}>
          <Route path="productos" element={<MisProductos />} />
          <Route path="pedidos" element={<Ventas />} />
        </Route>

        <Route path="admin" element={<RutaPorRol rol="administrador" />}>
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="pedidos" element={<PedidosAdmin />} />
          <Route path="categorias" element={<Categorias />} />
        </Route>

        <Route path="perfil" element={<RutaPorRol />}>
          <Route index element={<MiCuenta />} />
          <Route path="datos" element={<DatosPersonales />} />
          <Route path="seguridad" element={<Seguridad />} />
        </Route>
        <Route path="perfil/negocio" element={<RutaPorRol rol="vendedor" />}>
          <Route index element={<MiNegocio />} />
        </Route>

        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  )
}
