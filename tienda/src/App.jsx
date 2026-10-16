import { Route, Routes } from 'react-router-dom'
import Layout from './componentes/Layout'
import RutaProtegida from './componentes/RutaProtegida'
import Carrito from './paginas/Carrito'
import Catalogo from './paginas/Catalogo'
import Checkout from './paginas/Checkout'
import Login from './paginas/Login'
import NoEncontrado from './paginas/NoEncontrado'
import Pedido from './paginas/Pedido'
import Pedidos from './paginas/Pedidos'
import Producto from './paginas/Producto'
import Registro from './paginas/Registro'
import RecuperarPassword from './paginas/RecuperarPassword'
import RestablecerPassword from './paginas/RestablecerPassword'
import DatosPersonales from './paginas/cuenta/DatosPersonales'
import Direcciones from './paginas/cuenta/Direcciones'
import MetodosPago from './paginas/cuenta/MetodosPago'
import MiCuenta from './paginas/cuenta/MiCuenta'
import Seguridad from './paginas/cuenta/Seguridad'



// Flujo principal del MVP: catalogo -> ficha -> carrito -> checkout (direccion + pago) -> pedido
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Catalogo />} />
        <Route path="productos/:id" element={<Producto />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />

        <Route path="recuperar-password" element={<RecuperarPassword />} />
        <Route path="restablecer-password" element={<RestablecerPassword />} />

        <Route element={<RutaProtegida />}>
          <Route path="carrito" element={<Carrito />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="pedidos/:id" element={<Pedido />} />
          <Route path="perfil" element={<MiCuenta />} />
          <Route path="perfil/datos" element={<DatosPersonales />} />
          <Route path="perfil/seguridad" element={<Seguridad />} />
          <Route path="perfil/direcciones" element={<Direcciones />} />
          <Route path="perfil/pagos" element={<MetodosPago />} />
        </Route>

        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  )
}
