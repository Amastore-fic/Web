import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { formatearMoneda } from '@shared/utilidades/formato'
import { useProducto } from '../hooks/useCatalogo'

export default function Producto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: producto, isPending, error } = useProducto(id)
  
  const [cantidad, setCantidad] = useState(1)
  const [agregando, setAgregando] = useState(false)

  if (isPending) return <p>Cargando...</p>
  if (error) return <p className="error">{error.message}</p>

  const promedio = producto.calificaciones_avg_puntuacion

  const handleAgregarAlCarrito = async () => {
    // Clave exacta donde tu Login guarda la sesión
    const token = localStorage.getItem('comprasegura:tienda:token')
    
    if (!token) {
      alert('Debes iniciar sesión para agregar productos al carrito.')
      navigate('/login')
      return
    }

    setAgregando(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/carrito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_producto: producto.id,
          cantidad: cantidad
        })
      })

      const datos = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(datos.message || datos.error || 'Error al agregar al carrito')
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
    <article className="flex flex-col gap-3 max-w-180 p-10 lg:pb-35 sm:pb-30">
      <h1 className="text-2xl font-bold">{producto.titulo}</h1>
      <p className="font-semibold">Descripción del producto</p>
      <p>{producto.descripcion}</p>
      <p className="font-bold text-3xl">{formatearMoneda(producto.precio)}</p>
      
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
            : 'Aún no tiene calificaciones.'}
        </p>
      </section>

      {/* Selector de cantidad y botón de agregar */}
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
          className={`p-3 rounded-lg text-white font-semibold transition-colors ${
            producto.existencias === 0 || agregando 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#607ADB] hover:bg-blue-700 cursor-pointer'
          }`}
        >
          {agregando ? 'Agregando...' : producto.existencias === 0 ? 'Sin Stock' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  )
}