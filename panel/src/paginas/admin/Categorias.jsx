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
    <section>
      <h1>Categorias</h1>

      <form className="filtros" onSubmit={enviar}>
        <input
          required
          placeholder="Nueva categoria"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button type="submit" disabled={crear.isPending}>
          Agregar
        </button>
      </form>
      {crear.error && <p className="error">{crear.error.message}</p>}

      {isPending ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {categorias.map((c) => (
            <li key={c.id}>{c.nombre}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
