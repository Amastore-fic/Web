import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSesion } from '../hooks/useSesion'

const MENU = {
  vendedor: [
    { a: '/vendedor/productos', texto: 'Mis productos' },
    { a: '/vendedor/pedidos', texto: 'Mis ventas' },
  ],
  administrador: [
    { a: '/admin/usuarios', texto: 'Usuarios' },
    { a: '/admin/pedidos', texto: 'Pedidos' },
    { a: '/admin/categorias', texto: 'Categorias' },
  ],
}

export default function Layout() {
  const { usuario, cerrar } = useSesion()
  const navigate = useNavigate()

  async function salir() {
    await cerrar()
    navigate('/login')
  }

  return (
    <>
      <header className="encabezado">
        <span className="marca">CompraSegura · Panel</span>
        {usuario && (
          <nav>
            {MENU[usuario.rol]?.map((opcion) => (
              <NavLink key={opcion.a} to={opcion.a}>
                {opcion.texto}
              </NavLink>
            ))}
            <button type="button" className="boton-texto" onClick={salir}>
              Salir ({usuario.nombre})
            </button>
          </nav>
        )}
      </header>
      <main className="contenido">
        <Outlet />
      </main>
    </>
  )
}
