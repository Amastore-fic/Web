import { Link } from 'react-router-dom'
import { mensajeError } from '@shared/perfil/perfil'
import { usePerfil } from '../../hooks/usePerfil'
import { AlertaError } from '../FormularioAuth'

// Marco de las subpaginas de "Mi cuenta": ruta de regreso, titulo y contenido.
// children es una funcion que recibe el perfil ya cargado: {(perfil) => ...}
export default function PaginaCuenta({ titulo, descripcion, children }) {
  const { data: perfil, isPending, error } = usePerfil()

  return (
    <section className="bg-gray-100 px-3.5 py-8 sm:px-5 sm:py-10 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header>
          <nav aria-label="Ruta" className="text-sm">
            <ol className="flex items-center gap-1.5 text-[#8A8FA3]">
              <li>
                <Link to="/perfil" className="font-semibold text-[#607ADB] hover:underline">
                  Mi cuenta
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">{titulo}</li>
            </ol>
          </nav>
          <h1 className="mt-3 text-2xl font-bold text-[#1B1F2E]">{titulo}</h1>
          {descripcion && <p className="mt-1 text-sm text-[#8A8FA3]">{descripcion}</p>}
        </header>

        {isPending ? (
          <p className="text-gray-600">Cargando...</p>
        ) : error ? (
          <AlertaError>{mensajeError(error)}</AlertaError>
        ) : (
          children(perfil)
        )}
      </div>
    </section>
  )
}
