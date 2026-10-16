import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { formatearMoneda } from '@shared/utilidades/formato'
import { useCategorias, useProductos } from '../hooks/useCatalogo'

function BannerOfertas() {
  return (
    <div className="mx-3.5 sm:mx-5 lg:mx-8 mb-8 mt-10 rounded-lg overflow-hidden bg-gradient-to-r from-[#607ADB] to-[#1B1F2E] text-white p-8 sm:p-8 lg:p-10 flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide opacity-80">
          Ofertas de la semana
        </p>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">
          Hasta 40% de descuento
        </h2>
        <p className="text-sm opacity-90 mt-1">En productos seleccionados</p>
      </div>
      <Link
        to="/"
        className="sm:block bg-white text-[#1B1F2E] font-semibold text-sm rounded-md px-4 py-2 hover:bg-gray-200"
      >
        Ver ofertas
      </Link>
    </div>
  )
}

function ProductCard({ producto }) {
  const { id, titulo, precio, categoria, vendedor, rating, reviews, imagen_url } = producto

  return (
    <Link
      to={`/productos/${id}`}
      className="block bg-[#1B1F2E] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#6f81c0b7] transition flex flex-col justify-between"
    >
      {/* Contenedor de la imagen corregido para mostrar la foto real o un respaldo si no tiene */}
      <div className="bg-[#D9D9D9] h-36 w-full overflow-hidden flex items-center justify-center">
        {imagen_url ? (
          <img
            src={imagen_url}
            alt={titulo}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs text-gray-500 italic">Sin imagen</span>
        )}
      </div>

      <div className="p-2.5 flex flex-col justify-between flex-grow">
        <p className="text-white text-[16px] line-clamp-2 min-h-[2lh]">{titulo}</p>

        {rating != null && (
          <p className="text-[#8A8FA3] text-[10px] sm:text-[11px] my-1">
            <span className="text-amber-400">★ {rating}</span>
            {reviews != null && ` (${reviews})`}
          </p>
        )}

        <p className="text-[#7C93FF] font-bold text-[17px] mt-1">
          {formatearMoneda(precio)}
        </p>

        <p className="text-[#8A8FA3] text-[10px] sm:text-[11px] mt-1 line-clamp-1">
          {categoria?.nombre} · {vendedor?.nombre_comercial}
        </p>
      </div>
    </Link>
  )
}

function ProductGrid({
  productos,
  cols = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mt-8 pb-10 lg:pb-30',
}) {
  return (
    <div className={`grid ${cols} gap-2.5 sm:gap-3.5 px-3.5 sm:px-5 lg:px-8 pb-5`}>
      {productos.map((p) => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  )
}

export default function Catalogo() {
  const [params] = useSearchParams()
  const buscar = params.get('buscar') ?? ''
  const categoria = params.get('categoria') ?? ''

  const hayFiltros = buscar !== '' || categoria !== ''

  const { data, isPending, error } = useProductos({ buscar, categoria })
  const productos = data?.data ?? []

  return (
    <section>
      {!hayFiltros && <BannerOfertas />}
      
      <p className="px-3.5 sm:px-5 lg:px-8 text-[18px] font-bold text-white">Productos en tendencia</p>

      {isPending && <p className="px-3.5 sm:px-5 lg:px-8 text-gray-400 mt-4">Cargando productos...</p>}
      {error && <p className="error px-3.5 sm:px-5 lg:px-8 mt-4 text-red-400">{error.message}</p>}
      {data && productos.length === 0 && (
        <p className="px-3.5 sm:px-5 lg:px-8 text-gray-400 mt-4">No hay productos que coincidan.</p>
      )}

      {productos.length > 0 && <ProductGrid productos={productos} />}
    </section>
  )
}