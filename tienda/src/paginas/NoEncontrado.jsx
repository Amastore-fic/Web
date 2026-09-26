import { Link } from 'react-router-dom'

export default function NoEncontrado() {
  return (
    <section>
      <h1>Pagina no encontrada</h1>
      <Link to="/">Volver al catalogo</Link>
    </section>
  )
}
