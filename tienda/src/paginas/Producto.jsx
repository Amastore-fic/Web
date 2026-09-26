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
    <article className="ficha">
      <h1>{producto.titulo}</h1>
      <p className="precio">{formatearMoneda(producto.precio)}</p>
      <p>{producto.descripcion}</p>
      <p className="secundario">
        {producto.existencias} disponibles · {producto.categoria?.nombre}
      </p>

      <section className="tarjeta">
        <h2>Vendedor</h2>
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
      <button type="button" disabled>
        Agregar al carrito (pendiente)
      </button>
    </article>
  )
}
