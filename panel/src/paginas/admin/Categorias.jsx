import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api'

// GET /categorias (publico) y POST /admin/categorias
export default function Categorias() {
  const queryClient = useQueryClient()
  const [nombre, setNombre] = useState('')
  const { data: categorias, isPending } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => api.get('/categorias'),
  })

  const crear = useMutation({
    mutationFn: (datos) => api.post('/admin/categorias', datos),
    onSuccess: () => {
      setNombre('')
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })

  function enviar(e) {
    e.preventDefault()
    crear.mutate({ nombre })
  }

  return (
    <section className="flex max-w-2xl flex-col gap-6 p-10">
      <h1 className="text-2xl font-semibold">Categorías</h1>

      <form className="flex flex-wrap gap-2" onSubmit={enviar}>
        <label htmlFor="nueva-categoria" className="sr-only">
          Nueva categoría
        </label>
        <input
          id="nueva-categoria"
          required
          placeholder="Nueva categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-[15px] focus:border-panel-acento focus:ring-2 focus:ring-panel-acento/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={crear.isPending}
          className="cursor-pointer rounded-md bg-panel-acento px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-panel-acento-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          Agregar
        </button>
      </form>
      {crear.error && (
        <p role="alert" className="text-sm text-red-600">
          {crear.error.errores?.nombre?.[0] ?? crear.error.message}
        </p>
      )}

      {isPending ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {categorias.map((c) => (
            <li key={c.id} className="px-4 py-3 text-[15px]">
              {c.nombre}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
