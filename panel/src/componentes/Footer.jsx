import { Link } from 'react-router-dom'
import { URL_TIENDA } from '@shared/utilidades/enlaces'
import { useSesion } from '../hooks/useSesion'
import { MENU } from './menuPanel'

// Mismo estilo que tienda/src/componentes/Footer.jsx
const titulo = 'text-white font-semibold text-[14px] mb-3'
const enlace = 'text-panel-tenue-oscuro text-[13px] hover:text-white'

// Paginas que aun no existen: se muestran como texto.
const ayuda = ['Preguntas frecuentes para vendedores', 'Cómo publicar un producto']
const legal = ['Aviso de privacidad', 'Términos para vendedores']

export default function Footer() {
  const { usuario } = useSesion()
  const secciones = usuario ? (MENU[usuario.rol] ?? []) : []

  return (
    <footer className="mt-8 border-t border-gray-500 bg-panel-oscuro pb-4 text-white">
      <div className="grid grid-cols-2 gap-6 px-3.5 py-8 sm:px-5 lg:grid-cols-4 lg:px-8">
        {/* Panel */}
        <div>
          <h3 className={titulo}>Panel</h3>
          <ul className="space-y-2">
            {usuario ? (
              secciones.map((s) => (
                <li key={s.a}>
                  <Link to={s.a} className={enlace}>
                    {s.texto}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li>
                  <Link to="/login" className={enlace}>
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link to="/registro" className={enlace}>
                    Crear cuenta de vendedor
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Tienda */}
        <div>
          <h3 className={titulo}>Compradores</h3>
          <ul className="space-y-2">
            <li>
              <a href={URL_TIENDA} className={enlace}>
                Ir a la tienda
              </a>
            </li>
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
              <a href="mailto:vendedores@comprasegura.com" className={enlace}>
                vendedores@comprasegura.com
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
      <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-700 px-3.5 py-4 sm:flex-row sm:px-5 lg:px-8">
        <p className="text-[12px] text-panel-tenue-oscuro">
          © {new Date().getFullYear()} CompraSegura. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
