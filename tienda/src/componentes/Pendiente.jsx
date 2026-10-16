// Marcador para pantallas del MVP que aun no se construyen.
export default function Pendiente({ titulo, children }) {
  return (
    <section className="p-10 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{titulo}</h1>
      <div className="bg-[#607bdb5a] p-6 border-2 rounded-lg border-[#607bdb73]">{children}</div>
    </section>
  )
}
