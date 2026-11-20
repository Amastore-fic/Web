import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { formatearMoneda } from '@shared/utilidades/formato'
import { useCategorias, useProductos } from '../hooks/useCatalogo'
import imgTelefono from '../assets/telefono_prueba.png'
import imgMonitor from '../assets/pantalla_prueba.png'
import imgTermos from '../assets/termos_prueba.png'



/* -------------------------------------------------------------------------- */
/*                                  Carrusel                                  */
/* -------------------------------------------------------------------------- */

// Para agregar un banner nuevo basta con sumar un objeto a esta lista.
// "enlace": '#productos' baja a la lista de productos; '/?buscar=termo' filtra el catalogo.
const BANNERS = [
  {
    id: 'mejora',
    etiqueta: 'Lo último en tecnología',
    titulo: 'Mejora tu mundo',
    texto: 'Descubre los smartphones y accesorios más nuevos de las mejores marcas, a precios increíbles.',
    boton: 'Comprar ahora',
    botonSecundario: 'Ver ofertas',
    enlace: '#productos',
    fondo: 'from-[#1B1F2E] via-[#2B3358] to-[#607ADB]',
    imagen: imgTelefono,
    imagenAlt: 'Smartphone destacado',
  },
  {
    id: 'gadgets',
    etiqueta: 'Ofertas calientes',
    titulo: 'Ofertas en gadgets',
    destacado: 'Hasta 15% de descuento',
    texto: 'Lo más nuevo en tecnología con las mejores ofertas.',
    boton: 'Comprar ahora',
    enlace: '#productos',
    fondo: 'from-[#607ADB] via-[#3F4F9A] to-[#1B1F2E]',
    imagen: imgMonitor,
    imagenAlt: 'Monitor de alta resolución',
  },
  {
    id: 'termos',
    etiqueta: 'Nuevo ingreso',
    titulo: 'Termos premium',
    texto: 'Mantén el calor · Mantén el frío · Todo el día',
    boton: 'Comprar ahora',
    enlace: '/?buscar=termo',
    fondo: 'from-[#1B1F2E] via-[#3A4270] to-[#7C93FF]',
    imagen: imgTermos,
    imagenAlt: 'Termos térmicos',
  },
]

const SEGUNDOS_POR_BANNER = 10

function CarruselBanners() {
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [inicioToque, setInicioToque] = useState(null)

  const total = BANNERS.length
  const ir = (n) => setIndice((n + total) % total)

  useEffect(() => {
    if (pausado) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const intervalo = setInterval(() => setIndice((i) => (i + 1) % total), SEGUNDOS_POR_BANNER * 1000)
    return () => clearInterval(intervalo)
  }, [pausado, indice, total])

  //deslizar con el dedo en celular
  function alTerminarToque(e) {
    if (inicioToque === null) return
    const diferencia = e.changedTouches[0].clientX - inicioToque
    if (Math.abs(diferencia) > 50) ir(indice + (diferencia < 0 ? 1 : -1))
    setInicioToque(null)
  }

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Ofertas destacadas"
      className="relative mx-3.5 mb-8 mt-10 overflow-hidden rounded-lg sm:mx-5 lg:mx-8"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      onTouchStart={(e) => setInicioToque(e.touches[0].clientX)}
      onTouchEnd={alTerminarToque}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${indice * 100}%)` }}
      >
        {BANNERS.map((b, i) => {
          const activo = i === indice
          const Enlace = b.enlace.startsWith('#') ? 'a' : Link
          const propsEnlace = b.enlace.startsWith('#') ? { href: b.enlace } : { to: b.enlace }

          return (
            <div
              key={b.id}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${total}`}
              aria-hidden={!activo}
              className={`flex h-60 min-w-full items-center justify-between bg-gradient-to-r px-8 text-white sm:h-64 lg:h-72 lg:px-16 ${b.fondo}`}
            >
              <div className="max-w-md">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#C9D3FF] sm:text-sm">
                  {b.etiqueta}
                </p>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl lg:text-4xl">{b.titulo}</h2>
                {b.destacado && (
                  <p className="mt-1 text-xl font-bold text-[#7C93FF] sm:text-2xl">{b.destacado}</p>
                )}
                <p className="mt-2 text-sm opacity-90">{b.texto}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Enlace
                    {...propsEnlace}
                    tabIndex={activo ? 0 : -1}
                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#1B1F2E] hover:bg-gray-200"
                  >
                    {b.boton}
                  </Enlace>
                  {b.botonSecundario && (
                    <Enlace
                      {...propsEnlace}
                      tabIndex={activo ? 0 : -1}
                      className="rounded-md border border-white/70 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      {b.botonSecundario}
                    </Enlace>
                  )}
                </div>
              </div>

              {/* El dibujo se oculta en celular para que el texto tenga espacio */}
              {b.imagen && (
                <div className="hidden pr-4 md:flex md:items-center lg:pr-12" aria-hidden="true">
                  <img
                    src={b.imagen}
                    alt={b.imagenAlt ?? ''}
                    className="max-h-60 lg:max-h-70 w-auto object-contain drop-shadow-2xl"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Flechas */}
      <button
        type="button"
        onClick={() => ir(indice - 1)}
        aria-label="Banner anterior"
        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-xl text-white hover:bg-black/50"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => ir(indice + 1)}
        aria-label="Banner siguiente"
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-xl text-white hover:bg-black/50"
      >
        ›
      </button>

      {/* Puntos */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {BANNERS.map((b, i) => (
          <button
            key={b.id}
            type="button"
            onClick={() => ir(i)}
            aria-label={`Ir al banner ${i + 1}`}
            aria-current={i === indice}
            className={`h-2 rounded-full transition-all ${i === indice ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                         Tarjetas y cuadricula (sin cambios)                */
/* -------------------------------------------------------------------------- */

function ProductCard({ producto }) {
  const { id, titulo, precio, categoria, vendedor, rating, reviews, imagen_url } = producto

  return (
    <Link
      to={`/productos/${id}`}
      className="block bg-[#1B1F2E] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#6f81c0b7] transition flex flex-col justify-between"
    >
      <div className="bg-[#D9D9D9] h-36 w-full overflow-hidden flex items-center justify-center">
        {imagen_url ? (
          <img src={imagen_url} alt={titulo} className="h-full w-full object-cover" />
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

        <p className="text-[#7C93FF] font-bold text-[17px] mt-1">{formatearMoneda(precio)}</p>

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
      {!hayFiltros && <CarruselBanners />}

      <p id="productos" className="px-3.5 sm:px-5 lg:px-8 text-[18px] font-bold text-white scroll-mt-4">
        Productos en tendencia
      </p>

      {isPending && <p className="px-3.5 sm:px-5 lg:px-8 text-gray-400 mt-4">Cargando productos...</p>}
      {error && <p className="error px-3.5 sm:px-5 lg:px-8 mt-4 text-red-400">{error.message}</p>}
      {data && productos.length === 0 && (
        <p className="px-3.5 sm:px-5 lg:px-8 text-gray-400 mt-4">No hay productos que coincidan.</p>
      )}

      {productos.length > 0 && <ProductGrid productos={productos} />}
    </section>
  )
}