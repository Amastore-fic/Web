import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import { TarjetaOpcion } from '../../componentes/perfil/PiezasPerfil'
import { useSesion } from '../../hooks/useSesion'

const OPCIONES = [
  {
    a: '/pedidos',
    Icono: ReceiptLongOutlinedIcon,
    titulo: 'Mis pedidos',
    descripcion: 'Consulta el estado de tus compras y califica lo que recibiste.',
  },
  {
    a: '/perfil/seguridad',
    Icono: ShieldOutlinedIcon,
    titulo: 'Inicio de sesión y seguridad',
    descripcion: 'Cambia tu correo electrónico y tu contraseña.',
  },
  {
    a: '/perfil/datos',
    Icono: BadgeOutlinedIcon,
    titulo: 'Datos personales',
    descripcion: 'Actualiza tu nombre y tu número de teléfono.',
  },
  {
    a: '/perfil/direcciones',
    Icono: HomeWorkOutlinedIcon,
    titulo: 'Direcciones',
    descripcion: 'Agrega o edita las direcciones a donde enviamos tus pedidos.',
  },
  {
    a: '/perfil/pagos',
    Icono: CreditCardOutlinedIcon,
    titulo: 'Métodos de pago',
    descripcion: 'Administra tus tarjetas y consulta tus transacciones. Próximamente.',
  },
]

// Mi cuenta del cliente: cada tarjeta lleva a su propia pantalla
export default function MiCuenta() {
  const { usuario } = useSesion()

  return (
    <section className="bg-gray-100 px-3.5 py-8 sm:px-5 sm:py-10 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold text-[#1B1F2E]">Mi cuenta</h1>
          {usuario && <p className="mt-1 text-sm text-[#8A8FA3]">Hola, {usuario.nombre}.</p>}
        </header>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OPCIONES.map((opcion) => (
            <li key={opcion.a}>
              <TarjetaOpcion {...opcion} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
