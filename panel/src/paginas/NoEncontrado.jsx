import { Link } from 'react-router-dom'

export default function NoEncontrado() {
  return (
    <section className="flex flex-col items-start gap-4 p-10">
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <p className="text-gray-600">La dirección que abriste no existe en el panel.</p>
      <Link
        to="/"
        className="rounded-md bg-panel-acento px-4 py-2 text-[14px] font-semibold text-white hover:bg-panel-acento-hover"
      >
        Volver al inicio
      </Link>
    </section>
  )
}
