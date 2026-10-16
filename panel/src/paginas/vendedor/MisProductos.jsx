import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, sesion } from '../../api'

const ESTADO_INICIAL = {
  titulo: '',
  descripcion: '',
  precio: '',
  existencias: '',
  id_categoria: '',
  imagen: null,
}

export default function MisProductos() {
  const queryClient = useQueryClient()
  const [editandoId, setEditandoId] = useState(null)
  const [errorForm, setErrorForm] = useState(null)
  const [formData, setFormData] = useState(ESTADO_INICIAL)

  // 1. Cargar Categorías y Productos
  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const res = await api.get('/categorias')
      return res.data || res
    },
  })

  const { data: productos = [], isLoading: cargandoProductos, error: errorProductos } = useQuery({
    queryKey: ['vendedor-productos'],
    queryFn: async () => {
      const res = await api.get('/vendedor/productos')
      return res.data || res
    },
  })

  // Mutación limpia usando el cliente oficial del proyecto
  const guardarMutation = useMutation({
    mutationFn: (payload) => {
      const url = editandoId ? `/vendedor/productos/${editandoId}?_method=PUT` : '/vendedor/productos'
      return api.post(url, payload) // El cliente ahora detecta el FormData automáticamente
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendedor-productos'] })
      limpiarFormulario()
    },
    onError: (err) => {
      // err es una instancia de ErrorApi con .errores ({ campo: ['mensaje'] }) o .message
      if (err.errores && Object.keys(err.errores).length > 0) {
        const listaMensajes = Object.values(err.errores).flat().join(' | ')
        setErrorForm(listaMensajes)
      } else {
        setErrorForm(err.message || 'Error al procesar la solicitud.')
      }
    },
  })

  // 3. Mutación para Retirar Producto (Baja Lógica)
  const retirarMutation = useMutation({
    mutationFn: (id) => api.delete(`/vendedor/productos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendedor-productos'] }),
    onError: (err) => setErrorForm(err.response?.data?.message || 'Error al retirar el producto.'),
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] || null : value,
    }))
  }

  const limpiarFormulario = () => {
    setFormData(ESTADO_INICIAL)
    setEditandoId(null)
    setErrorForm(null)
    const el = document.getElementById('input-imagen')
    if (el) el.value = ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorForm(null)

    // Validar imagen obligatoria al crear
    if (!editandoId && !formData.imagen) {
      setErrorForm('La imagen del producto es obligatoria.')
      return
    }

    if (formData.descripcion.trim().length < 20) {
      setErrorForm('La descripción debe tener al menos 20 caracteres.')
      return
    }

    const payload = new FormData()
    payload.append('titulo', String(formData.titulo).trim())
    payload.append('descripcion', String(formData.descripcion).trim())
    payload.append('precio', String(formData.precio))
    payload.append('existencias', String(formData.existencias))
    payload.append('id_categoria', String(formData.id_categoria))

    if (editandoId) {
      payload.append('_method', 'PUT')
    }

    if (formData.imagen) {
      payload.append('imagen', formData.imagen)
    }

    guardarMutation.mutate(payload)
  }

  const handleEditar = (producto) => {
    setEditandoId(producto.id)
    setFormData({
      titulo: producto.titulo,
      descripcion: producto.descripcion,
      precio: producto.precio,
      existencias: producto.existencias,
      id_categoria: producto.id_categoria,
      imagen: null,
    })
    setErrorForm(null)
  }

  if (cargandoProductos) {
    return <p className="p-8 text-center text-gray-500">Cargando tus publicaciones...</p>
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Mis Productos</h1>

      {(errorForm || errorProductos) && (
        <div className="rounded border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
          {errorForm || errorProductos?.message}
        </div>
      )}

      {/* Formulario de Alta / Edición */}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-md">
        <h2 className="border-b pb-2 text-xl font-semibold">
          {editandoId ? 'Editar Producto' : 'Publicar Nuevo Producto'}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título *</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría *</label>
            <select
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Precio ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Existencias *</label>
            <input
              type="number"
              min="0"
              name="existencias"
              value={formData.existencias}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Imagen {editandoId ? '(Opcional si deseas mantener la actual)' : '*'}
            </label>
            <div className="mt-2 flex items-center gap-3">
              <label
                htmlFor="input-imagen"
                className="cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200"
              >
                Seleccionar archivo
              </label>
              <input
                id="input-imagen"
                type="file"
                name="imagen"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-sm italic text-gray-600">
                {formData.imagen ? formData.imagen.name : 'Ningún archivo seleccionado'}
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Descripción (mínimo 20 caracteres) *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              minLength={20}
              required
              rows={3}
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {editandoId && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={guardarMutation.isPending}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {guardarMutation.isPending
              ? 'Guardando...'
              : editandoId
              ? 'Guardar Cambios'
              : 'Publicar Producto'}
          </button>
        </div>
      </form>

      {/* Tabla de Publicaciones */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 border-b pb-2 text-xl font-semibold">Publicaciones</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-700">
                <th className="p-3">Imagen</th>
                <th className="p-3">Título</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    No tienes publicaciones registradas.
                  </td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {prod.imagen_url ? (
                        <img
                          src={prod.imagen_url}
                          alt={prod.titulo}
                          className="h-12 w-12 rounded border object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
                          Sin foto
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-medium text-gray-900">{prod.titulo}</td>
                    <td className="p-3 text-gray-600">{prod.categoria?.nombre || 'N/A'}</td>
                    <td className="p-3 font-semibold text-gray-800">${prod.precio}</td>
                    <td className="p-3 text-gray-600">{prod.existencias}</td>
                    <td className="p-3">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          prod.estado === 'activo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prod.estado}
                      </span>
                    </td>
                    <td className="space-x-2 p-3 text-center">
                      <button
                        onClick={() => handleEditar(prod)}
                        className="rounded bg-amber-500 px-3 py-1 text-sm text-white hover:bg-amber-600"
                      >
                        Editar
                      </button>
                      {prod.estado === 'activo' && (
                        <button
                          onClick={() =>
                            confirm('¿Seguro que deseas retirar esta publicación?') &&
                            retirarMutation.mutate(prod.id)
                          }
                          disabled={retirarMutation.isPending}
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Retirar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}