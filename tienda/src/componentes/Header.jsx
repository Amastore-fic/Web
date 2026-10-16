import { Link, NavLink, Outlet, useNavigate, useSearchParams  } from 'react-router-dom'
import { useSesion } from '../hooks/useSesion'
import { useCategorias } from '../hooks/useCatalogo'
import SelectorDireccion from './SelectorDireccion'

import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { URL_REGISTRO_VENDEDOR } from '@shared/utilidades/enlaces';


const botonNav =
    "flex flex-1 items-center justify-center gap-2 bg-[#607ADB] text-white text-[13px] font-semibold rounded-md px-2 py-2 whitespace-nowrap cursor-pointer hover:bg-[#4f68c4]";


export default function Header() {

    const { usuario, cerrar } = useSesion()
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const { data: categorias } = useCategorias()

    const buscarActual = params.get('buscar') ?? ''
    const categoriaActiva = params.get('categoria') ?? ''

    async function salir() {
        await cerrar();
        navigate("/");
    }

    function buscarProductos(e) {
        e.preventDefault()
        const texto = String(new FormData(e.currentTarget).get('buscar') ?? '').trim()
        const nuevos = new URLSearchParams()
        if (texto) nuevos.set('buscar', texto)
        if (categoriaActiva) nuevos.set('categoria', categoriaActiva) // conserva la categoría
        const consulta = nuevos.toString()
        navigate(consulta ? `/?${consulta}` : '/')
    }


    return (

        <div>

            <header className="flex flex-wrap  items-center justify-between lg:gap-8 gap-4 bg-[#1B1F2E] border-b border-gray-500 text-white p-6 py-5 sm:px-5 sm:py-3.5 lg:px-8 lg:py-4 ">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-medium whitespace-nowrap cursor-pointer">

                    <LocalGroceryStoreOutlinedIcon sx={{ fontSize: 20 }} />

                    <p className="text-[20px] sm:text-[20px] lg:text-[20px]">
                        Amastore
                    </p>

                </Link>

                {/* Boton de direccion */}

                {usuario && <SelectorDireccion />}





                {/* Buscador */}
                <form
                    onSubmit={buscarProductos}
                    className="basis-full sm:basis-auto sm:flex-1 order-4 sm:self-stretch flex lg:p-2.5"
                >
                    <div className="bg-white rounded-md text-gray-400 flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 text-[14px] w-full">
                        <input
                            key={buscarActual}
                            name="buscar"
                            type="search"
                            defaultValue={buscarActual}
                            placeholder="Buscar producto..."
                            className="w-full h-full py-0 pl-3 text-gray-800 focus:outline-none"
                        />
                        <button type="submit" aria-label="Buscar" className="cursor-pointer">
                            <SearchIcon sx={{ fontSize: 20 }} />
                        </button>
                    </div>
                </form>


                {/* Acciones nav */}

                <div className="flex gap-2 basis-full sm:basis-auto order-5">
                    {usuario ? (
                        <>
                            <NavLink to="/pedidos" className={botonNav}>
                                <ReceiptRoundedIcon sx={{ fontSize: 20 }} />
                                Mis pedidos
                            </NavLink>
                            <NavLink to="/carrito" className={botonNav}>
                                <ShoppingCartRoundedIcon sx={{ fontSize: 20 }} />
                                Carrito
                            </NavLink>
                            <NavLink to="/perfil" className={botonNav}>
                                <AccountCircleRoundedIcon sx={{ fontSize: 20 }} />
                                Mi cuenta
                            </NavLink>
                            <button type="button" onClick={salir} className={botonNav}>
                                <PersonIcon sx={{ fontSize: 20 }} />
                                Salir
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

            {/* Nav de categorías */}
            <nav nav className="bg-[#242939] text-gray-200 text-[13px] lg:text-[14px] px-3.5 sm:px-5 lg:px-8 py-2.5 flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto">
                <Link
                    to="/"
                    className={`whitespace-nowrap ${!categoriaActiva ? 'text-white font-semibold' : ''}`}
                >
                    Todas
                </Link>
                {categorias?.map((c) => (
                    <Link
                        key={c.id}
                        to={`/?categoria=${c.id}`}
                        className={`whitespace-nowrap ${String(c.id) === categoriaActiva ? 'text-white font-semibold' : ''
                            }`}
                    >
                        {c.nombre}
                    </Link>
                ))}

                {/* Lleva al registro de vendedores en el panel */}
                <a
                    href={URL_REGISTRO_VENDEDOR}
                    className="ml-auto flex items-center gap-1 whitespace-nowrap font-semibold text-[#9EB0F5] hover:text-white"
                >
                    <StorefrontOutlinedIcon sx={{ fontSize: 17 }} />
                    Vende con nosotros
                </a>
            </nav>



        </div >



    )



}