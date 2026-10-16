import { useParams } from 'react-router-dom'
import { formatearMoneda } from '@shared/utilidades/formato'
import { useProducto } from '../hooks/useCatalogo'

export default function Producto() {
  const { id } = useParams()
  const { data: producto, isPending, error } = useProducto(id)

  if (isPending) return <p>Cargando...</p>
  if (error) return <p className="error">{error.message}</p>

  const promedio = producto.calificaciones_avg_puntuacion

  return (
    <article className="flex flex-col gap-3 max-w-180 p-10 lg:pb-35 sm:pb-30">
      <h1 className='text-2xl font-bold'>{producto.titulo}</h1>
      <p className='font-semibold'>Descripcion del producto</p>
      <p>{producto.descripcion}</p>
      <p className="font-bold text-3xl">{formatearMoneda(producto.precio)}</p>
      
      <p className="text-gray-700">
        {producto.existencias} disponibles · {producto.categoria?.nombre}
      </p>

      <section className="rounded-md p-5 shadow-[0_0_8px_3px_rgba(0,0,0,0.12)]">
        <h2 className='font-semibold'>Vendedor</h2>
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
      <button type="button" disabled className='bg-[#607ADB] p-3 rounded-lg text-white cursor-no-drop'>
        Agregar al carrito (pendiente)
      </button>
    </article>
  )
}
