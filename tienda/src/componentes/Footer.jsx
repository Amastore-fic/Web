import { Link } from 'react-router-dom'
import { useSesion } from '../hooks/useSesion'
import { useCategorias } from '../hooks/useCatalogo'
 
const titulo = 'text-white font-semibold text-[14px] mb-3'
const enlace = 'text-[#8A8FA3] text-[13px] hover:text-white'
 
// Páginas que aún no existen: se muestran como texto.
// Cuando crees la ruta, cámbialas por <Link to="/ruta">.
const ayuda = ['Preguntas frecuentes', 'Devoluciones y reembolsos', 'Rastrear mi pedido']
const legal = ['Aviso de privacidad', 'Términos y condiciones']
const pagos = ['Pago con tarjeta']
 
export default function Footer() {
  const { usuario } = useSesion()
  const { data: categorias } = useCategorias()
 
  return (
    <footer className="bg-[#1B1F2E] border-t border-gray-500 text-white mt-8 pb-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-3.5 sm:px-5 lg:px-8 py-8">
        
        {/* Compra */}
        <div>
          <h3 className={titulo}>Compra</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className={enlace}>
                Inicio
              </Link>
            </li>
            {categorias?.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link to={`/?categoria=${c.id}`} className={enlace}>
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
 
        {/* Cuenta */}
        <div>
          <h3 className={titulo}>Mi cuenta</h3>
          <ul className="space-y-2">
            {usuario ? (
              <>
                <li>
                  <Link to="/pedidos" className={enlace}>
                    Mis pedidos
                  </Link>
                </li>
                <li>
                  <Link to="/carrito" className={enlace}>
                    Carrito
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className={enlace}>
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link to="/registro" className={enlace}>
                    Crear cuenta
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
 
        {/* Ayuda */}
        <div>
          <h3 className={titulo}>Ayuda</h3>
          <ul className="space-y-2">
            {ayuda.map((t) => (
              <li key={t} className={enlace}>
                {t}
              </li>
            ))}
            <li>
              <a href="mailto:contacto@comprasegura.com" className={enlace}>
                contacto@comprasegura.com
              </a>
            </li>
          </ul>
        </div>
 
        {/* Legal */}
        <div>
          <h3 className={titulo}>Legal</h3>
          <ul className="space-y-2">
            {legal.map((t) => (
              <li key={t} className={enlace}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
 
      {/* Franja inferior */}
      <div className="border-t border-gray-700 px-3.5 sm:px-5 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[#8A8FA3] text-[12px]">
          © {new Date().getFullYear()} CompraSegura. Todos los derechos reservados.
        </p>
        <ul className="flex gap-2">
          {pagos.map((p) => (
            <li
              key={p}
              className="bg-[#242939] text-gray-200 text-[11px] rounded px-2 py-1"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}