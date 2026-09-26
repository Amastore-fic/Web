import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatearMoneda } from '@shared/utilidades/formato'
import { useCategorias, useProductos } from '../hooks/useCatalogo'

export default function Catalogo() {
  const [buscar, setBuscar] = useState('')
  const [categoria, setCategoria] = useState('')
  const { data: categorias } = useCategorias()
  const { data, isPending, error } = useProductos({ buscar, categoria })

  return (
    <section>
      <h1>Catalogo</h1>

      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar por nombre"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas las categorias</option>
          {categorias?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {isPending && <p>Cargando productos...</p>}
      {error && <p className="error">{error.message}</p>}
      {data?.data.length === 0 && <p>No hay productos que coincidan.</p>}

      <ul className="rejilla">
        {data?.data.map((p) => (
          <li key={p.id} className="tarjeta">
            <Link to={`/productos/${p.id}`}>
              <h2>{p.titulo}</h2>
            </Link>
            <p className="precio">{formatearMoneda(p.precio)}</p>
            <p className="secundario">
              {p.categoria?.nombre} · Vendido por {p.vendedor?.nombre_comercial}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
