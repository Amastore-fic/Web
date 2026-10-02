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



// Flujo principal del MVP: catalogo -> ficha -> carrito -> checkout (direccion + pago) -> pedido
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Catalogo />} />
        <Route path="productos/:id" element={<Producto />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />

        <Route element={<RutaProtegida />}>
          <Route path="carrito" element={<Carrito />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="pedidos/:id" element={<Pedido />} />
        </Route>

        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  )
}
