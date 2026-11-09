import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { formatearMoneda } from '@shared/utilidades/formato'
import { AlertaError, AlertaExito } from '../componentes/FormularioAuth'
import { useProducto } from '../hooks/useCatalogo'
import { mensajeCarrito, useAgregarAlCarrito } from '../hooks/useCarrito'
import { useSesion } from '../hooks/useSesion'

export default function Producto() {
  const { id } = useParams()
  const location = useLocation()
  const { usuario } = useSesion()
  const { data: producto, isPending, error } = useProducto(id)
  const [imagenFalla, setImagenFalla] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const agregar = useAgregarAlCarrito()

  if (isPending) return <p>Cargando...</p>
  if (error) return <p className="error">{error.message}</p>

  const promedio = producto.calificaciones_avg_puntuacion
  const mostrarImagen = producto.imagen_url && !imagenFalla
  const sinExistencias = producto.existencias === 0
  const esCliente = usuario?.rol === 'cliente'

  function cambiarCantidad(nueva) {
    setCantidad(Math.min(Math.max(1, nueva), producto.existencias))
    agregar.reset()
  }

  return (
    <article className="grid max-w-5xl gap-8 p-10 sm:pb-30 md:grid-cols-2 lg:pb-35">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-gray-100 shadow-[0_0_8px_3px_rgba(0,0,0,0.12)]">
        {mostrarImagen ? (
          <img
            src={producto.imagen_url}
            alt={producto.titulo}
            onError={() => setImagenFalla(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="px-4 text-center text-gray-500">Sin imagen disponible</span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">{producto.titulo}</h1>
        <p className="font-semibold">Descripcion del producto</p>
        <p>{producto.descripcion}</p>
        <p className="text-3xl font-bold">{formatearMoneda(producto.precio)}</p>

        <p className="text-gray-700">
          {producto.existencias} disponibles · {producto.categoria?.nombre}
        </p>

        <section className="rounded-md p-5 shadow-[0_0_8px_3px_rgba(0,0,0,0.12)]">
          <h2 className="font-semibold">Vendedor</h2>
          <p>
            <strong>{producto.vendedor.nombre_comercial}</strong>
            <span className="secundario"> · {producto.vendedor.codigo_vendedor}</span>
          </p>
          {producto.vendedor.sucursal && <p className="secundario">{producto.vendedor.sucursal}</p>}
        </section>

        <section>
          <h2>Calificaciones</h2>
          <p>
            {promedio
              ? `${Number(promedio).toFixed(1)} de 5 (${producto.calificaciones_count} compras verificadas)`
              : 'Aun no tiene calificaciones.'}
          </p>
          {/* TODO: listar GET /productos/{id}/calificaciones */}
        </section>

        {!usuario && (
          <Link
            to="/login"
            state={{ desde: location.pathname }}
            className="mt-4 rounded-lg bg-[#607ADB] p-3 text-center font-semibold text-white hover:bg-[#4f68c4]"
          >
            Inicia sesión para comprar
          </Link>
        )}

        {esCliente && (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                <button
                  type="button"
                  onClick={() => cambiarCantidad(cantidad - 1)}
                  disabled={sinExistencias || cantidad <= 1}
                  aria-label="Quitar una pieza"
                  className="cursor-pointer bg-gray-100 px-4 py-2 font-bold hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-4 py-2 font-semibold" aria-live="polite">
                  {cantidad}
                </span>
                <button
                  type="button"
                  onClick={() => cambiarCantidad(cantidad + 1)}
                  disabled={sinExistencias || cantidad >= producto.existencias}
                  aria-label="Agregar una pieza"
                  className="cursor-pointer bg-gray-100 px-4 py-2 font-bold hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => agregar.mutate({ idProducto: producto.id, cantidad })}
                disabled={sinExistencias || agregar.isPending}
                className="cursor-pointer rounded-lg bg-[#607ADB] p-3 font-semibold text-white transition-colors hover:bg-[#4f68c4] disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {agregar.isPending
                  ? 'Agregando...'
                  : sinExistencias
                    ? 'Sin existencias'
                    : 'Agregar al carrito'}
              </button>
            </div>

            {agregar.isSuccess && (
              <AlertaExito>
                Se agregó a tu carrito.{' '}
                <Link to="/carrito" className="font-semibold underline">
                  Ver carrito
                </Link>
              </AlertaExito>
            )}
            {agregar.isError && <AlertaError>{mensajeCarrito(agregar.error)}</AlertaError>}
          </>
        )}
      </div>
    </article>
  )
}
