import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatearMoneda } from '@shared/utilidades/formato'
import { AlertaError } from '../componentes/FormularioAuth'
import {
  mensajeCarrito,
  useCambiarCantidad,
  useCarrito,
  useQuitarDelCarrito,
} from '../hooks/useCarrito'

// Funcionalidad 4 del MVP. El total y los subtotales vienen de la API; aqui solo se muestran.
export default function Carrito() {
  const { data: carrito, isPending, error } = useCarrito()
  const cambiar = useCambiarCantidad()
  const quitar = useQuitarDelCarrito()
  const [errorAccion, setErrorAccion] = useState(null)

  if (isPending) return <p className="p-10">Cargando tu carrito...</p>
  if (error) return <p className="p-10 text-red-700">{mensajeCarrito(error)}</p>

  const ocupado = cambiar.isPending || quitar.isPending
  const alFallar = { onError: (err) => setErrorAccion(mensajeCarrito(err)) }

  function cambiarCantidad(item, cantidad) {
    setErrorAccion(null)
    cambiar.mutate({ idItem: item.id, cantidad }, alFallar)
  }

  function quitarItem(item) {
    setErrorAccion(null)
    quitar.mutate(item.id, alFallar)
  }

  if (carrito.items.length === 0) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-start gap-4 p-10">
        <h1 className="text-2xl font-bold">Tu carrito</h1>
        <p className="text-gray-700">Todavía no has agregado productos.</p>
        <Link
          to="/"
          className="rounded-lg bg-[#607ADB] px-4 py-2.5 font-semibold text-white hover:bg-[#4f68c4]"
        >
          Ver productos
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-6 p-6 sm:p-10">
      <h1 className="text-2xl font-bold">Tu carrito</h1>

      {errorAccion && <AlertaError>{errorAccion}</AlertaError>}

      <ul className="flex flex-col gap-4">
        {carrito.items.map((item) => (
          <li
            key={item.id}
            className={`flex flex-col gap-4 rounded-md bg-white p-4 shadow-[0_0_8px_3px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center ${
              item.disponible ? '' : 'opacity-70'
            }`}
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
              {item.producto.imagen_url ? (
                <img src={item.producto.imagen_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-gray-500">Sin imagen</span>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Link
                to={`/productos/${item.id_producto}`}
                className="font-semibold text-[#1B1F2E] hover:underline"
              >
                {item.producto.titulo}
              </Link>
              <p className="text-sm text-gray-600">
                {formatearMoneda(item.producto.precio)} c/u ·{' '}
                {item.producto.vendedor?.nombre_comercial}
              </p>
              {!item.disponible && (
                <p className="text-sm font-semibold text-red-700">
                  Ya no está disponible. Quítalo para continuar con tu compra.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              {item.disponible && (
                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(item, item.cantidad - 1)}
                    disabled={ocupado || item.cantidad <= 1}
                    aria-label={`Quitar una pieza de ${item.producto.titulo}`}
                    className="cursor-pointer bg-gray-100 px-3 py-1.5 font-bold hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 font-semibold">{item.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => cambiarCantidad(item, item.cantidad + 1)}
                    disabled={ocupado || item.cantidad >= item.producto.existencias}
                    aria-label={`Agregar una pieza de ${item.producto.titulo}`}
                    className="cursor-pointer bg-gray-100 px-3 py-1.5 font-bold hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              )}

              <p className="w-28 text-right font-semibold tabular-nums">
                {formatearMoneda(item.subtotal)}
              </p>

              <button
                type="button"
                onClick={() => quitarItem(item)}
                disabled={ocupado}
                className="cursor-pointer text-sm text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-end gap-3 border-t border-gray-200 pt-4">
        <p className="text-lg">
          Total ({carrito.cantidad_articulos}{' '}
          {carrito.cantidad_articulos === 1 ? 'artículo' : 'artículos'}):{' '}
          <strong className="tabular-nums">{formatearMoneda(carrito.total)}</strong>
        </p>
        {carrito.cantidad_articulos > 0 && (
          <Link
            to="/checkout"
            className="rounded-lg bg-[#607ADB] px-5 py-3 font-semibold text-white hover:bg-[#4f68c4]"
          >
            Confirmar compra
          </Link>
        )}
      </div>
    </section>
  )
}
