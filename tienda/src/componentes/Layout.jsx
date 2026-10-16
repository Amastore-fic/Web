import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSesion } from '../hooks/useSesion'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const { usuario, cerrar } = useSesion()
  const navigate = useNavigate()

  async function salir() {
    await cerrar()
    navigate('/')
  }

  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <Header />
        {/* <header className="encabezado">
        <Link to="/" className="marca">
          Amastore
        </Link>
        <nav>
          <NavLink to="/">Catalogo</NavLink>
          {usuario ? (
            <>
              <NavLink to="/carrito">Carrito</NavLink>
              <NavLink to="/pedidos">Mis pedidos</NavLink>
              <button type="button" className="boton-texto" onClick={salir}>
                Salir ({usuario.nombre})
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Iniciar sesion</NavLink>
              <NavLink to="/registro">Crear cuenta</NavLink>
            </>
          )}
        </nav>
      </header> */}
        <main className="contenido flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>

    </>
  )
}
