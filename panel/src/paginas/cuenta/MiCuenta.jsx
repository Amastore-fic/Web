import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import { TarjetaOpcion } from '../../componentes/perfil/PiezasPerfil'
import { useSesion } from '../../hooks/useSesion'

const SEGURIDAD = {
  a: '/perfil/seguridad',
  Icono: ShieldOutlinedIcon,
  titulo: 'Inicio de sesión y seguridad',
  descripcion: 'Cambia tu correo electrónico y tu contraseña.',
}

const DATOS = {
  a: '/perfil/datos',
  Icono: BadgeOutlinedIcon,
  titulo: 'Datos personales',
  descripcion: 'Actualiza tu nombre y tu número de teléfono.',
}

// Tarjetas segun el rol: primero la cuenta, despues los accesos del dia a dia
const OPCIONES = {
  vendedor: [
    {
      a: '/perfil/negocio',
      Icono: StorefrontOutlinedIcon,
      titulo: 'Mi negocio',
      descripcion: 'Nombre comercial, sucursal y descripción que ven los compradores.',
    },
    SEGURIDAD,
    DATOS,
    {
      a: '/vendedor/productos',
      Icono: Inventory2OutlinedIcon,
      titulo: 'Mis productos',
      descripcion: 'Publica productos y actualiza precios y existencias.',
    },
    {
      a: '/vendedor/pedidos',
      Icono: PointOfSaleOutlinedIcon,
      titulo: 'Mis ventas',
      descripcion: 'Revisa los pedidos que te han hecho y prepáralos.',
    },
  ],
  administrador: [
    SEGURIDAD,
    DATOS,
    {
      a: '/admin/usuarios',
      Icono: GroupOutlinedIcon,
      titulo: 'Usuarios',
      descripcion: 'Consulta las cuentas y activa o desactiva el acceso.',
    },
    {
      a: '/admin/pedidos',
      Icono: ReceiptLongOutlinedIcon,
      titulo: 'Pedidos',
      descripcion: 'Supervisa los pedidos de toda la plataforma.',
    },
    {
      a: '/admin/categorias',
      Icono: CategoryOutlinedIcon,
      titulo: 'Categorías',
      descripcion: 'Da de alta las categorías del catálogo.',
    },
  ],
}

// Mi cuenta de vendedor o administrador: cada tarjeta lleva a su propia pantalla
export default function MiCuenta() {
  const { usuario } = useSesion()

  return (
    <section className="bg-gray-100 px-3.5 py-8 sm:px-5 sm:py-10 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold text-panel-oscuro">Mi cuenta</h1>
          <p className="mt-1 text-sm text-panel-tenue">Hola, {usuario.nombre}.</p>
        </header>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OPCIONES[usuario.rol]?.map((opcion) => (
            <li key={opcion.a}>
              <TarjetaOpcion {...opcion} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
