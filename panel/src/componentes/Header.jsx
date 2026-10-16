import { Link, NavLink, useNavigate } from 'react-router-dom'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PersonIcon from '@mui/icons-material/Person'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import { URL_TIENDA } from '@shared/utilidades/enlaces'
import { useSesion } from '../hooks/useSesion'
import { MENU, NOMBRE_SECCION } from './menuPanel'

// Mismo estilo que tienda/src/componentes/Header.jsx
const botonNav =
  'flex items-center justify-center gap-2 bg-panel-acento text-white text-[13px] font-semibold rounded-md px-3 py-2 whitespace-nowrap cursor-pointer hover:bg-panel-acento-hover'

const botonSecundario =
  'flex items-center justify-center gap-2 border border-gray-500 text-gray-200 text-[13px] font-semibold rounded-md px-3 py-2 whitespace-nowrap hover:bg-panel-barra hover:text-white'

export default function Header() {
  const { usuario, cerrar } = useSesion()
  const navigate = useNavigate()

  async function salir() {
    await cerrar()
    navigate('/login')
  }

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-500 bg-panel-oscuro p-6 py-5 text-white sm:px-5 sm:py-3.5 lg:gap-8 lg:px-8 lg:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-medium whitespace-nowrap">
          <LocalGroceryStoreOutlinedIcon sx={{ fontSize: 20 }} />
          <p className="text-[20px]">Amastore</p>
          <span className="rounded bg-panel-barra px-2 py-0.5 text-[11px] font-semibold text-gray-200">
            {NOMBRE_SECCION[usuario?.rol] ?? 'Vendedores'}
          </span>
        </Link>

        {/* Acciones */}
        <div className="flex flex-wrap gap-2">
          <a href={URL_TIENDA} className={botonSecundario}>
            <StorefrontOutlinedIcon sx={{ fontSize: 19 }} />
            Ir a la tienda
          </a>
          {usuario ? (
            <>
              <NavLink to="/perfil" className={botonSecundario}>
                <AccountCircleRoundedIcon sx={{ fontSize: 19 }} />
                Mi cuenta
              </NavLink>
              <button type="button" onClick={salir} className={botonNav}>
                <LogoutRoundedIcon sx={{ fontSize: 19 }} />
                Salir ({usuario.nombre})
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={botonNav}>
                <PersonIcon sx={{ fontSize: 20 }} />
                Iniciar sesión
              </NavLink>
              <NavLink to="/registro" className={botonNav}>
                <PersonAddIcon sx={{ fontSize: 19.5 }} />
                Crear cuenta
              </NavLink>
            </>
          )}
        </div>
      </header>

      {/* Menu de la seccion (ocupa el lugar de las categorias en la tienda) */}
      <nav className="flex gap-3 overflow-x-auto bg-panel-barra px-3.5 py-2.5 text-[13px] text-gray-200 sm:gap-4 sm:px-5 lg:gap-6 lg:px-8 lg:text-[14px]">
        {usuario ? (
          MENU[usuario.rol]?.map((opcion) => (
            <NavLink
              key={opcion.a}
              to={opcion.a}
              className={({ isActive }) =>
                `whitespace-nowrap ${isActive ? 'font-semibold text-white' : 'hover:text-white'}`
              }
            >
              {opcion.texto}
            </NavLink>
          ))
        ) : (
          <span className="whitespace-nowrap">
            Publica tus productos y llega a compradores que confían en vendedores verificados.
          </span>
        )}
      </nav>
    </div>
  )
}
