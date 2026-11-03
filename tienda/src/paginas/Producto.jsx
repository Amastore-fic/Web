import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatearMoneda } from '@shared/utilidades/formato'
import { useProducto } from '../hooks/useCatalogo'

export default function Producto() {
  const { id } = useParams()
  const { data: producto, isPending, error } = useProducto(id)
  const [imagenFalla, setImagenFalla] = useState(false)

  if (isPending) return <p>Cargando...</p>
  if (error) return <p className="error">{error.message}</p>

  const promedio = producto.calificaciones_avg_puntuacion
  const mostrarImagen = producto.imagen_url && !imagenFalla

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

        {/* TODO: selector de cantidad + POST /carrito/items */}
        <button
          type="button"
          disabled
          className="cursor-no-drop rounded-lg bg-[#607ADB] p-3 text-white"
        >
          Agregar al carrito (pendiente)
        </button>
      </div>
    </article>
  )
}