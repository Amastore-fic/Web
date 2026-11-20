import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api'
import Toast from '../../componentes/usuarios/Toast'
import {
  useCambiarEstadoProductoAdmin,
  useListaProductosAdmin,
} from '../../hooks/useProductosAdmin'

export default function Productos() {
  const [busqueda, setBusqueda] = useState('')
  const [buscar, setBuscar] = useState('')
  const [estado, setEstado] = useState('')
  const [idCategoria, setIdCategoria] = useState('')
  const [pagina, setPagina] = useState(1)
  const [filas, setFilas] = useState(6)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setBuscar(busqueda.trim())
      setPagina(1)
    }, 400)
    return () => clearTimeout(t)
  }, [busqueda])

  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => api.get('/categorias'),
  })

  const { data, isLoading, isFetching, error } = useListaProductosAdmin({
    pagina,
    porPagina: filas,
    buscar,
    estado,
    idCategoria,
  })

  const cambiarEstado = useCambiarEstadoProductoAdmin()

  const conReinicio = (setter) => (valor) => {
    setter(valor)
    setPagina(1)
  }

  function handleToggleEstado(producto) {
    const nuevoEstado = producto.estado === 'activo' ? 'retirado' : 'activo'

    cambiarEstado.mutate(
      { id: producto.id, estado: nuevoEstado },
      {
        onSuccess: (respuesta) => {
          setToast({
            tipo: 'success',
            mensaje:
              respuesta?.message ??
              (nuevoEstado === 'activo' ? 'Producto reactivado.' : 'Producto desactivado.'),
          })
        },
        onError: (e) => {
          setToast({
            tipo: 'error',
            mensaje: e?.message || 'No se pudo cambiar el estado del producto.',
          })
        },
      }
    )
  }

  const productos = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
  const cargando = isLoading || (isFetching && !data)
  const paginaActual = data?.current_page ?? pagina
  const ultimaPagina = data?.last_page ?? 1

  return (
    <section className="mx-auto max-w-[1640px] pt-10 pb-8 pl-20 pr-20">
      <h1 className="sr-only">Productos</h1>

      <div className="overflow-hidden rounded-3xl border border-gray-300 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-6">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por producto o vendedor..."
              className="w-full max-w-xs rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />

            <select
              value={estado}
              onChange={(e) => conReinicio(setEstado)(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="retirado">Retirados</option>
            </select>

            <select
              value={idCategoria}
              onChange={(e) => conReinicio(setIdCategoria)(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Todas las categorías</option>
              {(Array.isArray(categorias) ? categorias : []).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Filas:</span>
            <select
              value={filas}
              onChange={(e) => {
                setFilas(Number(e.target.value))
                setPagina(1)
              }}
              className="rounded-xl border border-gray-300 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-600">
                <th className="px-6 py-4">Imagen</th>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Vendedor</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {cargando ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Cargando productos...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-red-600">
                    {error?.message || 'Error al cargar los productos.'}
                  </td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No hay productos para mostrar.
                  </td>
                </tr>
              ) : (
                productos.map((prod) => {
                  const estaActivo = prod.estado === 'activo'
                  const nombreVendedor =
                    [prod.vendedor?.usuario?.nombre, prod.vendedor?.usuario?.apellido]
                      .filter(Boolean)
                      .join(' ') ||
                    prod.vendedor?.usuario?.correo ||
                    'Sin vendedor'

                  return (
                    <tr key={prod.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        {prod.imagen_url ? (
                          <img
                            src={prod.imagen_url}
                            alt={prod.titulo}
                            className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                            Sin foto
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-900">{prod.titulo}</td>
                      <td className="px-6 py-3 text-gray-700">{nombreVendedor}</td>
                      <td className="px-6 py-3 text-gray-600">{prod.categoria?.nombre || 'N/A'}</td>
                      <td className="px-6 py-3 font-semibold text-gray-800">${prod.precio}</td>
                      <td className="px-6 py-3 text-gray-600">{prod.existencias}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            estaActivo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {estaActivo ? 'Activo' : 'Retirado'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          type="button"
                          disabled={cambiarEstado.isPending}
                          onClick={() => handleToggleEstado(prod)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition disabled:opacity-50 ${
                            estaActivo
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                        >
                          {estaActivo ? 'Desactivar' : 'Reactivar'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 text-sm text-gray-600">
          <span>
            Página {paginaActual} de {ultimaPagina}
            {typeof data?.total === 'number' ? ` (${data.total} productos)` : ''}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={paginaActual <= 1 || cargando}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={paginaActual >= ultimaPagina || cargando}
              onClick={() => setPagina((p) => Math.min(ultimaPagina, p + 1))}
              className="rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <Toast toast={toast} onCerrar={() => setToast(null)} />
    </section>
  )
}