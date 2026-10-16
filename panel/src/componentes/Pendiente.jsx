// Marcador para pantallas del MVP que aun no se construyen.
// Mismo estilo que tienda/src/componentes/Pendiente.jsx
export default function Pendiente({ titulo, children }) {
  return (
    <section className="flex flex-col gap-6 p-10">
      <h1 className="text-2xl font-semibold">{titulo}</h1>
      <div className="rounded-lg border-2 border-panel-acento/45 bg-panel-acento/20 p-6">
        {children}
      </div>
    </section>
  )
}
