import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatearMoneda } from '@shared/utilidades/formato'
import { useProducto } from '../hooks/useCatalogo'

export default function Producto() {
  const { id } = useParams()
  const { data: producto, isPending, error } = useProducto(id)
  const [imagenFalla, setImagenFalla] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const [agregando, setAgregando] = useState(false)

  if (isPending) return <p>Cargando...</p>
  if (error) return <p className="error">{error.message}</p>

  const promedio = producto.calificaciones_avg_puntuacion
  const mostrarImagen = producto.imagen_url && !imagenFalla

  const handleAgregarAlCarrito = async () => {
    // 1. Verificamos primero si existe el token en el navegador
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Debes iniciar sesión como cliente para agregar productos al carrito.')
      return
    }

    setAgregando(true)
    try {
      // 2. Hacemos la petición GET enviando el token en los headers de autorización
      const response = await fetch(`http://127.0.0.1:8000/api/v1/carrito?id_producto=${producto.id}&cantidad=${cantidad}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const datos = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(datos.message || 'Error al agregar al carrito')
      }

      alert('¡Producto agregado al carrito exitosamente!')

    } catch (err) {
      console.error("Error al agregar al carrito:", err)
      alert(`Hubo un problema: ${err.message}`)
    } finally {
      setAgregando(false)
    }
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
        </section>

        {/* Selector de cantidad y Botón de agregar */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-bold"
              disabled={producto.existencias === 0}
            >
              -
            </button>
            <span className="px-4 py-2 font-semibold">{cantidad}</span>
            <button
              type="button"
              onClick={() => setCantidad(Math.min(producto.existencias, cantidad + 1))}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-bold"
              disabled={cantidad >= producto.existencias || producto.existencias === 0}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAgregarAlCarrito}
            disabled={producto.existencias === 0 || agregando}
            className={`p-3 rounded-lg text-white font-semibold transition-colors
              ${producto.existencias === 0 || agregando
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#607ADB] hover:bg-blue-700 cursor-pointer'}`}
          >
            {agregando ? 'Agregando...' : producto.existencias === 0 ? 'Sin Stock' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </article>
  )
}
